const { pipeline } = require("stream/promises");
const { Transform } = require("stream");
const unwind = require("javascript-unwind");
const { table } = require("table");
const notifier = require("node-notifier");
require("dotenv").config();

const HTTPClientStreamJSONData = require("./HTTPClientStreamJSONData");

let jsonData = "";
const responseCollector = new Transform({
  //   encoding: "utf-8",
  objectMode: true,
  transform(chunk, enc, done) {
    jsonData += chunk;
    done();
  },
  flush(done) {
    this.push(JSON.parse(jsonData));
    done();
  },
});

const destructureCentres = new Transform({
  objectMode: true,
  transform(data, enc, done) {
    if (data?.centers) {
      data.centers.forEach((center) => {
        this.push(center);
      });
    } else {
      throw new Error("Centers is empty");
    }
    done();
  },
});

const filterLocation = new Transform({
  objectMode: true,
  transform(center, enc, done) {
    if (center?.address) {
      if (
        process.env.LOCATION_FILTER.split(",").some((l) =>
          center.address.toLowerCase().includes(l)
        )
      ) {
        this.push(center);
      }
    }
    done();
  },
});

const availabilityNotifier = new Transform({
  objectMode: true,
  transform(center, enc, done) {
    if (
      ["kandivali", "malad", "borivali", "vile"].some((l) =>
        center.address.toLowerCase().includes(l)
      )
    ) {
      notifier.notify(
        `(${center.sessions.available_capacity} Available) ${center.name}`
      );
    }
    this.push(center);
    done();
  },
});

const unwindCenterSession = new Transform({
  objectMode: true,
  transform(center, enc, done) {
    if (center?.sessions) {
      const result = unwind(center, "sessions");
      result.forEach((c) => this.push(c));
    } else {
      throw new Error("session not found");
    }
    done();
  },
});

const filterByAvailability = new Transform({
  objectMode: true,
  transform(center, enc, done) {
    if (center.sessions.available_capacity > 0) {
      this.push(center);
    }
    done();
  },
});

const data = [
  [
    "Hospital Name",
    "Address",
    "Available Capacity",
    "Type",
    "Date",
    "Age Group+",
  ],
];
const collectAndTabularize = new Transform({
  writableObjectMode: true,
  encoding: "utf-8",
  transform(center, enc, done) {
    data.push([
      center.name,
      center.address,
      center.sessions.available_capacity,
      center.fee_type,
      center.sessions.date,
      center.sessions.min_age_limit,
    ]);
    done();
  },
  flush(done) {
    this.push(table(data));
    done();
  },
});

(async () => {
  try {
    const jsonData$ = await new HTTPClientStreamJSONData().getDataStream();
    console.log(new Date());
    await pipeline(
      jsonData$,
      responseCollector,
      destructureCentres,
      filterLocation,
      unwindCenterSession,
      filterByAvailability,
      availabilityNotifier,
      collectAndTabularize,
      process.stdout
    );
  } catch (error) {
    console.error(error);
  }
})();

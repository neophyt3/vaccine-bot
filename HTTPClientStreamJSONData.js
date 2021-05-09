const https = require("https");

const { DISTRICT_ID, DATE, VACCINE_TYPE, LINK, AUTH } = process.env;

module.exports = class HTTPClientStreamJSONData {
  constructor() {
    this.link = new URL(LINK);
    this.district_id = DISTRICT_ID;
    this.date = DATE;
    this.vaccine_type = VACCINE_TYPE;
    this.searchParams = new URLSearchParams(
      `district_id=${this.district_id}&date=${this.date}&vaccine=${this.vaccine_type}`
    );
  }
  getDataStream() {
    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: this.link.hostname,
          method: "GET",
          path: this.link.pathname + "?" + this.searchParams.toString(),
          headers: {
            authority: "cdn-api.co-vin.in",
            authorization: AUTH,
            accept: "application/json, text/plain, */*",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.51",
            referer: "https://www.cowin.gov.in/",
          },
        },
        (res) => {
          res.setEncoding("utf8");
          if (res.statusCode === 200) {
            resolve(res);
          } else {
            const err = new Error("An error occured while requesting");
            err.httpStatusCode = res.statusCode;
            reject(err);
          }
        }
      );
      req.on("error", (e) => {
        reject(e);
      });
      req.end();
    });
  }
};

const https = require("https");

module.exports = class HTTPClientStreamJSONData {
  constructor(link, date) {
    this.link = new URL(link);
    this.district_id = 395;
    this.date = date;
    this.searchParams = new URLSearchParams(
      `district_id=${this.district_id}&date=${this.date}&vaccine=COVISHIELD`
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
            authorization: "",
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

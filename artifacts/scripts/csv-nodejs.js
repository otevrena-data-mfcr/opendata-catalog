const request = require("request");
const csv = require("csv-parse")();

csv.on("data", row => {
  // process one row
})

csv.on("end", () => {
  // relax
})

csv.on("error", () => {
  // panic!
})

request("%%%URL%%%").pipe(csvParse());
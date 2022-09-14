const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");
const dbconfig = require("../db_config.json")
let stream = fs.createReadStream("recommend_sql.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();
    // create a new connection to the database
    const connection = mysql.createConnection({
      host: dbconfig.host,
      port: dbconfig.port,
      user: dbconfig.user,
      password: dbconfig.password,
      database: dbconfig.database,
      multipleStatements: true, 
    });
    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        let query =
          "truncate TABLE recommend;"
          + 
          "INSERT INTO recommend (\
            title,\
            area_code,\
            r_spotId,\
            `date`,\
            avgTemp,\
            highTemp,\
            lowTemp,\
            rainProb,\
            weather,\
            predict) VALUES ?;"
          +
          "COMMIT;";
        connection.query(query, [csvData], (error, response) => {
          console.log("TABLE Created");
          console.log(error || response);
        });
        connection.end();
      }
    });
  });
stream.pipe(csvStream);
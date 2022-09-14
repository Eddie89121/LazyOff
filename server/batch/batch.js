const schedule = require('node-schedule');
// python execution timer
const process = {
  patch: () => {

    const pythonShell = require('python-shell');

    var options = {
    mode: 'text',
    pythonPath: 'python',
    pythonOptions: ['-u'],
    scriptPath: '',
    //   args: [arg1,arg2]
    };

    pythonShell.PythonShell.run('./batch/6_weatherScrap.py', options, function (err, results) {
        if (err) console.log(err);
        else console.log('weather scrap done');

    });

    pythonShell.PythonShell.run('./batch/modeling4server.py', options, function (err, results) {
        if (err) console.log(err);
        else console.log('model run done');

    });
    // job.cancel();
  },
    
    
    patchQuery: () => {
        
    const fs = require("fs");
        const mysql = require("mysql");
        const fastcsv = require("fast-csv");
        const db_config = require('../db_config.json');
        let stream = fs.createReadStream("./batch/recommend_sql.csv");
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
              host: db_config.host,
            port: db_config.port,
              user: db_config.user,
              password: db_config.password,
              database: db_config.database,
              multipleStatements: true, 
            });
            // open the connection
            connection.connect(error => {
              if (error) {
                console.error(error);
              } else {
                let query =                   
                    "TRUNCATE table recommend;"
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
    }


}


module.exports = {
  process
};


//시간별 타이머 참고 https://blog.naver.com/PostView.naver?blogId=qbxlvnf11&logNo=222489497378&categoryNo=0&parentCategoryNo=0&viewDate=&currentPage=1&postListTopCurrentPage=1&from=postView

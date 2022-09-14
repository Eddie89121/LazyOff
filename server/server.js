
//Import module
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const mysql = require('mysql');
const cors = require('cors');
const db_config = require('./db_config.json')

var url = require('url');

//DB
const db= mysql.createConnection({
    host : db_config.host,
    user : db_config.user,
    password : db_config.password,
    database : db_config.database,
    port     : db_config.port
});

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    const data = req.query;
    // console.log(data)

    // 지정 데이터 출력
    const sql = `SELECT * FROM (SELECT * FROM recommend as r LEFT JOIN spot as s ON r.r_spotId = s.spotId) j where area_code = ? AND date = ? ORDER BY predict DESC;`;
    const Query = [`${data.area}`, `${data.date}`]
    db.query(sql, Query, (error, rows) => {
        if (error) throw error;
        res.send(rows);
        // console.log(rows);
    });
});


const patchD = require('./batch/batch');
const schedule = require('node-schedule');


// 오전6시, 오후6시 batch작업 실행!!
const i = schedule.scheduleJob("10 00 06,18 * * *", function() {
    patchD.process.patch();
  });
const j = schedule.scheduleJob("25 00 06,18 * * *", function() {
    patchD.process.patchQuery();
  });
const k = schedule.scheduleJob("00 17 11 * * *", function() {
    patchD.process.patch();
  });
const l = schedule.scheduleJob("15 17 11 * * *", function() {
    patchD.process.patchQuery();
  });


app.listen(port, () => console.log(`Listening on port ${port}`));

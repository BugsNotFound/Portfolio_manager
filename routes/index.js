var express = require("express");
var router = express.Router();
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'SV7Qx2lPMU',
    password: 'NoIIr3qqoA',
    database: 'SV7Qx2lPMU'
});

connection.connect();


router.get("/", function(req, res, next) {
    connection.query("SELECT * FROM projects", function(err, rows, fields) {
        if (err) throw err;
        res.render('index', {
            "projects": rows
        })
    });
});


router.get("/details/:id", function(req, res, next) {
    connection.query("SELECT * FROM projects WHERE id=?", req.params.id, function(err, rows, fields) {
        if (err) throw err;
        res.render('details', {
            "project": rows[0]
        })
    });
});


module.exports = router;
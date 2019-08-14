var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: './public/images/portfolio' });
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
        res.render('admin/index', {
            "projects": rows
        })
    });
});


router.get("/add", function(req, res, next) {
    res.render("admin/add");
});

router.post("/add", upload.single('projectimage'), function(req, res, next) {
    //get form values
    var title = req.body.title;
    var description = req.body.description;
    var service = req.body.service;
    var url = req.body.url;
    var client = req.body.client;
    var projectdate = req.body.projectdate;

    if (req.file) {
        var projectImageName = req.file.filename;
    } else {
        var projectImageName = 'noimage.jpg';
    }

    //Form field validation
    req.checkBody('title', 'Title filed is required').notEmpty();
    req.checkBody('service', 'Service filed is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {

        res.render('admin/add', {
            errors: errors,
            title: title,
            description: description,
            service: service,
            client: client,
            url: url
        });

    } else {
        var project = {
            title: title,
            description: description,
            service: service,
            client: client,
            date: projectdate,
            url: url,
            image: projectImageName
        };
    }

    var query = connection.query('INSERT INTO projects SET ?', project, function(err, result) {
        console.log('Error: ' + err);
        console.log('Success: ' + result);
    });


    req.flash('success_msg', 'Project Added');
    res.redirect('/admin');

});

router.get("/edit/:id", function(req, res, next) {
    connection.query("SELECT * FROM projects WHERE id=?", req.params.id, function(err, rows, fields) {
        if (err) throw err;
        res.render('admin/edit', {
            "project": rows[0]
        })
    });
});

router.post("/edit/:id", upload.single('projectimage'), function(req, res, next) {
    //get form values
    var title = req.body.title;
    var description = req.body.description;
    var service = req.body.service;
    var url = req.body.url;
    var client = req.body.client;
    var projectdate = req.body.projectdate;

    if (req.file) {
        var projectImageName = req.file.filename;
    } else {
        var projectImageName = 'noimage.jpg';
    }

    //Form field validation
    req.checkBody('title', 'Title filed is required').notEmpty();
    req.checkBody('service', 'Service filed is required').notEmpty();

    var errors = req.validationErrors();

    if (req.file) {
        if (errors) {
            res.render('admin/add', {
                errors: errors,
                title: title,
                description: description,
                service: service,
                client: client,
                url: url
            });
        } else {
            var project = {
                title: title,
                description: description,
                service: service,
                client: client,
                date: projectdate,
                url: url,
                image: projectImageName
            };
        }
    } else {
        if (errors) {
            res.render('admin/add', {
                errors: errors,
                title: title,
                description: description,
                service: service,
                client: client,
                url: url
            });
        } else {
            var project = {
                title: title,
                description: description,
                service: service,
                client: client,
                date: projectdate,
                url: url
            };
        }
    }

    var query = connection.query('UPDATE projects SET ? WHERE id = ' + req.params.id, project, function(err, result) {
        console.log('Error: ' + err);
        console.log('Success: ' + result);
    });

    req.flash('success_msg', 'Project Updated');
    res.redirect('/admin');
});

router.delete('/delete/:id', function(req, res) {
    connection.query('DELETE FROM projects WHERE id = ' + req.params.id, function(err, result) {
        if (err) throw err;
        console.log('deleted ' + result.affectedRows + ' rows');
    });
    req.flash('success_msg', "Project Deleted");
    res.sendStatus(200);
});


module.exports = router;
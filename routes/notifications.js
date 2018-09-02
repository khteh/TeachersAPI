var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var async = require('async'); 
// GET /students list
router.get('/', function (req, res, next) {
	console.log('GET /students');
	res.json('');
});
// GET /students/:id
router.get('/:id', function (req, res, next) {
	console.log('GET /students/:id');
	res.json('');
});
// POST /students
router.post('/', function (req, res, next) {
    var teacherID = -1;
    console.log("POST /api/retrievefornotifications req: " + JSON.stringify(req.body));
    if (req.body.notification !== undefined && req.body.teacher !== undefined && req.body.notification.length > 0) {
        var notifications = req.body.notification.split(' @').splice(1);
        console.log("notifications: " + JSON.stringify(notifications));
        var students = notifications.join('\',\'');
        console.log(`students: ${students}`);
		async.series([
			function (callback) {
			    var teacher_query = `select id from teachers where email = '${req.body.teacher}'`;
			    db.query(teacher_query, function (error, result) {
			        if (error)
			            console.error(error.message);
			        else if (result.length > 0) {
			            teacherID = result[0].id;
			            console.log("Get teacher: " + teacherID);
			            //console.log('rows: '+rows+);
			        } else
			            console.log("No teacher "+req.body.teacher);
			        callback(error, result);
			    });
			}, function (callback) {
			    var recipients = [];
			    console.log("teacher "+teacherID);
			    if (teacherID !== -1) {
			        var student_query = `select * from students where isSuspended != 1 && (teacherid = ${teacherID} || email in ('${students}'))`;
			        console.log("select statement: " + student_query);
			        var newTeacher = db.query(student_query, function (error, result) {
			            if (error)
			                console.error(error.message); // if error occured during connection 
			            else {
			                // rows: {"fieldCount":0,"affectedRows":1,"insertId":2,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
			                console.log("results: " + JSON.stringify(result));
			                if (result.length > 0) {
			                    console.log(result.length + ' students: ' + JSON.stringify(result));
			                    result.map(function (item) {
			                        recipients.push(item.email);
			                    });
			                } else
			                    console.error(`No recipients for the notification from ${req.body.teacher} ID ${teacherID}`);
			            }
			            callback(error, recipients);
			        });
			    } else
			        callback(null, null);
			}
		], function(err, results) {
		    if (err) {
		        console.error("Error: " + JSON.stringify(err));
		        res.status(err.status || 500);
		    } else if (typeof results === 'undefined' || results === null || !results.length) {
		        console.error("Failed with null/empty result!");
		        res.status(err.status || 500);
		    } else {
		        // Index of results:
		        // 0: result from the first serial function
		        // 1: results from the second serial function
		        console.log("runs successfully! with " + results.length + " results: " + JSON.stringify(results));
		        res.json((results.length > 0) ? { recipients: results[1] } : { recipients: [] });
		    }
		});
	}
});
// PUT /todos/:id
router.put('/:id', function (req, res, next) {
	console.log('PUT /students/:id');
	res.json('');
});
// DELETE /todos/:id
router.delete('/:id', function (req, res, next) {
	console.log('DELETE /students/:id');
	res.json('');
});
module.exports = router;
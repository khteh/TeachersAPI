var express = require('express');
var emailvalidator = require('email-validator');
var router = express.Router();
var async = require('async');
var url = require('url');
function Greetings(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log('GET /api/greetings query: ' + JSON.stringify(query));
    var greetings = 'Hello';
	let now = new Date();
	let time = now.toLocaleString(undefined, {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	})
    if (query.name !== undefined && query.name.length > 0)
		greetings += ' ' + query.name;
	greetings += "! It's " + time + " now.";
	res.status(200);
	res.json({ 'message': greetings });	
};
module.exports = Greetings;
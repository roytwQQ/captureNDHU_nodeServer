var express = require('express');
var mongoose =require("mongoose");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");


var path = require('path');
var fs = require('fs');
var join = path.join;

//form express4, upload multipart(img), use bellow
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var app = express();

// configuration =================
mongoose.connect('mongodb://localhost/photo_app2');

app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.set('photos', path.join(__dirname, 'public/photos')); 


// define model =================
var Todo = mongoose.model('Todo', {
	text : String
});

var Photo = mongoose.model('Photo', {
	name: String,
	path: String
});
// var Photo = new mongoose.Schema({
// 	name: String,
// 	path: String
// });

// routes ======================================================================

// var photos = [];
// photos.push({
// name: 'Node.js Logo',
// path: 'http://nodejs.org/images/logos/nodejs-green.png'
// });
// photos.push({
// name: 'Ryan Speaking',
// path: 'http://nodejs.org/images/ryan-speaker.jpg'
// });


app.get('/api/todos', function(req, res) {

	Photo.find({}, function(err, photos){
		if (err) return next(err);
			res.json(photos);
		});
	
});


// app.post('/api/upload', function(req, res) {

// 		// create a todo, information comes from AJAX request from Angular
// 		Todo.create({
// 			text : req.body.text,
// 			done : false
// 		}, function(err, todo) {
// 			if (err)
// 				res.send(err);

// 			// get and return all the todos after you create another
// 			Todo.find(function(err, todos) {
// 				if (err)
// 					res.send(err)
// 				res.json(todos);
// 			});
// 		});

// 	});

app.post('/api/upload', multipartMiddleware, function(req, res, next) {
	console.log('!!!!!!@');
var img = req.files.photo.image;
var name = req.body.photo.name || img.name;
var path = join(app.get('photos'), img.name);
fs.rename(img.path, path, function(err){
if (err) return next(err);
Photo.create({
name: name,
path: img.name
}, function (err) {
if (err) return next(err);
res.json('@@');
// res.redirect('/photos');
});
});

});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");

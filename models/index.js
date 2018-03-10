
var env = process.env.NODE_ENV || 'development';
var config = require('../mongo-config.json')[env];
var mongoose = require('mongoose');
var Promise = require("bluebird");


mongoose.Promise = Promise;

var db = {};

db.IssueModel   = require('./issue.js');
db.ItemModel    = require('./item.js');
db.CommentModel = require('./comment.js');

db.mongoose = mongoose;
db.conn = mongoose.connection;

mongoose.connect(config.MONGODB_URI, function(err, data){
	if(err)
	    console.log(err);
	else{
	    console.log("connection success");
	    db.connflag = true;
	}
});

db.conn.on("error", function(error) {
    console.log("Mongoose Error: ", error);
    throw error;
});


module.exports = db;

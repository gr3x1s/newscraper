
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var issueSchema= new Schema({
    issue: String,
    items: [{type: Schema.Types.ObjectId, ref: 'Item'}]
});

var IssueModel = mongoose.model('Issue',issueSchema);

module.exports=IssueModel;

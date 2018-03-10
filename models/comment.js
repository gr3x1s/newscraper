
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema= new Schema({
    date: {type: Date, default: Date.now},
    name: String,
    body: String,
    deleted: {type: Boolean, default: false},
    item: {type: Schema.Types.ObjectId, ref: 'Item'}
});

var CommentModel = mongoose.model('Comment',commentSchema);

module.exports=CommentModel;

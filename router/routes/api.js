
module.exports = function(app, db, approot) {

    var path = require('path');

    var scraper = require(path.join(approot, '/scraper/scraper.js')).scraper;

    var renderdata = {
        heading: scraper.heading,
        origin:  scraper.origin
    };

    app.post('/api/list', function(req, res) {
        var issueId = db.mongoose.Types.ObjectId(req.body.issueselect);
        var issueText = '';

        db.IssueModel.findOne({'_id': issueId})
        .exec(function (err, doc) {
            if(err) throw err;
            issueText = doc.issue;
            db.ItemModel.find({'issue': issueId})
            .exec(function (err, items) {
                if(err) throw err;
                var itemlist = Object.assign({}, renderdata, {issueselect: issueId, issue: issueText, items : JSON.parse(JSON.stringify(items))});
                res.render('itemlist', itemlist);
            });
        });
    });

    app.post('/api/scrape', function(req, res) {
        scraper.scrapeIt(db, function(isNew) {
            var path = '/index?isnew='+isNew;
            res.redirect(path);
        });
    });

    app.post('/api/view', function(req, res) {
        var itemID = db.mongoose.Types.ObjectId(req.body.itemID);
        var issueID = db.mongoose.Types.ObjectId(req.body.issueselect);
        var issueText = req.body.issue;

        db.ItemModel.findOne({'_id': itemID})
        .exec(function(err, item) {
            if(err) throw err;
            var item = Object.assign({}, renderdata, {issueselect: issueID, issue: issueText, item : JSON.parse(JSON.stringify(item))});
            db.CommentModel.find({'item': itemID})
            .exec(function(err, comments) {
                var tmp = JSON.parse(JSON.stringify(comments));
                for(var idx = 0;idx < tmp.length;idx++) {
                    tmp[idx].date = new Date(tmp[idx].date).toLocaleString();
                }
                var fullitem = Object.assign({}, item, {comments : tmp});
                res.render('item', fullitem);
            });
        });
    });

    app.post('/api/comment', function(req, res) {
        var itemID = db.mongoose.Types.ObjectId(req.body.itemID);
        var issueText = req.body.issue;

        var newComment = {
            item: itemID,
            body: req.body.comment
        };

        var tmp = new db.CommentModel(newComment);
        tmp.save(function (err, doc) {
            if (err) throw err;
            db.ItemModel.findOneAndUpdate({_id: itemID},
                                          {$push:{'comments':doc._id, $sort: 1}},
                                          {new: true},
                function(err, item) {
                    if (err) throw err;
                    res.redirect(307,'/api/view');
                }
            );
        });
    });

    app.post('/api/delete', function(req, res) {
        var itemID = db.mongoose.Types.ObjectId(req.body.itemID);
        var commentID = db.mongoose.Types.ObjectId(req.body.commentID);
        var issueText = req.body.issue;

        db.CommentModel.findOneAndUpdate({_id: commentID},
                                         {deleted: true},
            function(err, item) {
                if (err) throw err;
                res.redirect(307,'/api/view');
            }
        );
    });
};

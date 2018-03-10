
module.exports = function(app, db, approot) {

    var path = require('path');

    var scraper = require(path.join(approot, '/scraper/scraper.js')).scraper;

    var renderData = {
        heading: scraper.heading,
        origin:  scraper.origin
    };

    app.get('/index', function(req, res) {
        db.IssueModel.find({}, function(err, issues) {
            if(err) throw err;
            if(issues.length <= 0) {
                // perform a "first" scrape
                scraper.scrapeIt(db, function(isNew) {
                    db.IssueModel.find({}, function(err, issues) {
                        if(err) throw err;
                        renderIndex(res, issues);
                    });
                });
            } else {
                if(req.query.isnew !== undefined) renderIndex(res, issues, req.query.isnew);
                else renderIndex(res, issues);
            }
        });
    });

    function renderIndex(res, issues, newScrape) {
        var messageHTML;

        if(newScrape !== undefined) {
            if(newScrape === 'true') messageHTML = '<i>New scrape data is available!</i>';
            else messageHTML = '<i>There is no new scrape data.</i>';
        }

        var scrapeData = Object.assign({}, renderData, {scrapemessage: messageHTML, issues : JSON.parse(JSON.stringify(issues))});
        res.render('index', scrapeData);
    };
};

var express = require('express');
var app = express();

var yahooFinance = require('yahoo-finance');

app.set('port', process.env.PORT || 5000);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  var ticker = req.query.ticker;
  yahooFinance.historical({ // HISTORICAL
    symbol: ticker,
    from: '2012-01-01',
    to: '2012-12-31',
    // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
  }, function (err, quotes) {
    res.render("home", { quotes: quotes, ticker: ticker });
  });
});

app.post('/search', function (req, res) {
  var ticker = req.body.ticker;
  res.redirect('/?ticker=' + ticker);
});

app.listen(app.get('port'), function() {
  console.log('App is running on port', app.get('port') + "!");
});
 
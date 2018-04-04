var express = require('express');
var app = express();

var yahooFinance = require('yahoo-finance');

app.set('port', process.env.PORT || 5000);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  yahooFinance.historical({ // HISTORICAL
    symbol: 'AAPL',
    from: '2012-01-01',
    to: '2012-12-31',
    // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
  }, function (err, quotes) {
    res.render("home", { quotes: quotes });
  });
});

app.listen(app.get('port'), function() {
  console.log('App is running on port', app.get('port') + "!");
});
 
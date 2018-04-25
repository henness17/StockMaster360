var express = require('express');
var app = express();
var http = require('http').Server(app);
var cts = require('check-ticker-symbol');
var io = require('socket.io')(http);
var errMsg = "";

const alpha = require('alphavantage')({ key: 'PTEM9VERB2FDGHUU' });

app.set('port', process.env.PORT || 5000);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  var ticker = req.query.ticker;
  var errMsg = req.query.errMsg;
  if (req.query.ticker == undefined) {
    ticker = 'AMZN';
    errMsg = 'none';
  }

  alpha.data.daily(ticker).then(stockData => {
    res.render("home", {
        stockData: stockData,
        ticker: ticker,
        errMsg: errMsg
      });
  });
});

app.post('/search', function (req, res) {
  var ticker = req.body.ticker.toUpperCase();
  if(cts.valid(ticker))
  {
    errMsg = "none";
    res.redirect('/?ticker=' + ticker + "&errMsg=" + errMsg);
  }
  else
  {
    errMsg = "Invalid ticker, please try again";
    res.redirect('/?ticker=AMZN' + "&errMsg=" + errMsg);
  }
  
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(app.get('port'), function () {
  console.log('listening on *:5000');
});
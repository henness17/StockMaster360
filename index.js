var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var yahooFinance = require('yahoo-finance');

app.set('port', process.env.PORT || 5000);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  var ticker = req.query.ticker;
  if(req.query.ticker == undefined){
    ticker = 'AMZN';
  }
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

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(app.get('port'), function(){
  console.log('listening on *:5000');
});
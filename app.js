
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , meetingRouter = require('./routes/meeting')
  , http = require('http')
  , path = require('path')
  , config = require('./config');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || config.port);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// 静态文件
// app.get('/', routes.main);

// Meeting Request Sender APIs
app.post('/api/meeting', meetingRouter.create);
app.del('/api/meeting', meetingRouter.delete);



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

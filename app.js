var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var serverRouter = require('./routes/server');

const swaggerUi = require('swagger-ui-express');
const swaggerSetting = require('./config/swagger');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 路徑 https://week3-express.herokuapp.com/api-doc/ 沒在postman檔案裡
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSetting));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/server', serverRouter);

// 判斷網址不存在
app.use((req, res, next) => {
  res.status(404).send('頁面不存在');
});

// 判斷執行不存在的方法
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    if (err.type === 'entity.parse.failed') {
      // JSON parse failed
      return res.status(400).send({ status: 404, message: '非JSON格式' });
    }
    return res.status(500).send('程式出現問題，請稍後再試');
  }
  next();
});

module.exports = app;

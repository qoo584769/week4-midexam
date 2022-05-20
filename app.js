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

// 出現會讓伺服器整個停掉的錯誤
process.on('uncaughtException', (err) => {
  console.log('伺服器出現重大錯誤');
  console.log(`err 名稱 : ${err.name}`);
  console.log(`err 訊息 : ${err.message}`);
  console.log(`err 記憶體堆疊 : ${err.stack}`);
  process.exit(1);
});

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

// 正式環境錯誤訊息
const resErrProd = (err, res) => {
  if (err.isOprational) {
    return res
      .status(err.statusCode)
      .json({ status: err.statusCode, message: err.message });
  } else {
    console.error('出現重大錯誤', err);
    return res
      .status(500)
      .json({ status: 'error', message: '系統錯誤，請聯絡系統管理員' });
  }
};
// 開發環境錯誤訊息
const resErrDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack
  });
};

// 判斷執行不存在的方法
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  // 開發環境錯誤
  if(process.env.NODE_ENV === 'dev'){
    return resErrDev(err,res);
  }
  // 正式環境錯誤
  if(err.name === 'ValidationError'){
    // 捕捉mongoose錯誤
    err.message = "資料欄位未填寫正確，請重新輸入！"
    err.isOperational = true;
    return resErrProd(err, res)
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    if (err.type === 'entity.parse.failed') {
      // JSON parse failed
      return res.status(400).send({ status: 404, message: '非JSON格式' });
    }
    return res.status(500).send('程式出現問題，請稍後再試');
  }
  next();
});

// 無法捕捉的catch 
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉的 rejection：', promise, '原因：', err);
});

module.exports = app;

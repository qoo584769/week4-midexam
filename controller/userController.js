const { HttpMethod } = require('../HttpFun.js')

// repl
const { createUserDB, loginDB } = require('../repository/userRepl')

// 丟出錯誤
const appError = require('../utils/appErr')

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return next(appError(400, '名稱 信箱 密碼 為必填', next))
  }
  // 新增測試使用者
  const data = {
    name,
    email,
    password,
  }
  const result = await createUserDB(data)
  if (result.status === false) {
    return next(appError(400, result.message, next))
  }
  return HttpMethod(res, 200, 'success', result, '會員註冊成功')
}

const loginUser = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(appError(400, '名稱 信箱 密碼 為必填', next))
  }
  const data = {
    email,
    password,
  }
  const result = await loginDB(data)
  console.log('登入訊息 ', result)
  if (result.status === false) {
    return next(appError(400, result.message, next))
  }
  return HttpMethod(res, 200, 'success', result, '會員登入成功')
}
module.exports = { createUser, loginUser }

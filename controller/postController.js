const { HttpMethod } = require('../HttpFun.js')

// model
const { userModel } = require('../models/userModel')
const { postModel } = require('../models/postModel')

// repl
const {
  getDB,
  postDB,
  patchDB,
  deleteOneDB,
  deleteAllDB,
} = require('../repository/postRepl')

// 丟出錯誤
const appError = require('../utils/appErr')

const getPost = async (req, res, next) => {
  const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt'
  const q =
    req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {}
  const data = {
    timeSort,
    q,
  }
  const userRes = await getDB(postModel, data)

  HttpMethod(res, 200, 'success', userRes, '資料查詢成功')
}

const postPost = async (req, res, next) => {
  const data = {
    userid: req.body.userid,
    content: req.body.content,
    image: req.body.image || '圖片路徑',
  }
  if (data.content === undefined) {
    return next(appError(400, '貼文內容未填寫', next))
  }
  // 新增新貼文
  const result = await postDB(data)
  if (result.status === false) {
    return next(appError(400, result.message, next))
  }
  HttpMethod(res, 200, 'success', result, '資料新增成功')
}

const editPost = async (req, res, next) => {
  const { postid, content, image } = req.body
  if (!postid || !content) {
    return next(appError(400, '貼文ID 貼文內容為必填', next))
  }
  const data = {
    _id: postid,
    content,
    image: image || '圖片路徑',
  }
  const result = await patchDB(data)
  if (!result) {
    return next(appError(400, '查無此貼文', next))
  }
  return HttpMethod(res, 200, 'success', result, '貼文編輯成功')
}

const deleteOnePost = async (req, res, next) => {
  const { postid } = req.body
  if (!postid) {
    return next(appError(400, '貼文ID 為必填', next))
  }
  const result = await deleteOneDB(postid)
  if (result.status === false) {
    return next(appError(400, result.message, next))
  }
  return HttpMethod(
    res,
    200,
    'success',
    result,
    `貼文 ID : ${postid}  刪除成功`
  )
}
const deleteAllPost = async (req, res, next) => {
  const result = await deleteAllDB()
  return HttpMethod(res, 200, 'success', result, '刪除全部貼文成功')
}

module.exports = {
  getPost,
  postPost,
  editPost,
  deleteOnePost,
  deleteAllPost,
}

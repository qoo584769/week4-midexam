const { HttpMethod } = require('../HttpFun.js');

// model
const { userModel } = require('../models/userModel');
const { messageModel } = require('../models/messageModel');

// repl
const { getDB, postDB, createUserDB } = require('../repository/postRepl');

const getPost = async (req, res) => {
  try {
    const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const data = {
      timeSort,
      q,
    };
    const userRes = await getDB(userModel, data);

    HttpMethod(res, 200, 'success', userRes, '資料查詢成功');
  } catch (error) {
    HttpMethod(res, 404, 'false', error, '資料查詢失敗');
    console.log('查詢失敗');
  }
};

const postPost = async (req, res) => {
  try {
    // 新增測試使用者
    // const data = {
    //   userid: req.body.name,
    //   email: req.body.email,
    // };
    // const result = await createUserDB(userModel,data)
    
    const data = {
      userid: req.body.userid,
      content: req.body.content,
    };
    // 新增新貼文
    const result = await postDB(messageModel, data);
    console.log(result);

    if (result.errors !== undefined) {
      HttpMethod(
        res,
        404,
        'false',
        result.errors.type.properties.message,
        '資料新增失敗'
      );
      return;
    }
    HttpMethod(res, 200, 'success', result, '資料新增成功');
  } catch (error) {
    console.log(error);
    HttpMethod(res, 404, 'false', error, '資料格式錯誤');
  }
};

// const editPost = async (req, res) => {
//   try {
//     let data = await buffParse(req);
//     const id = req.url.split('/').pop();
//     data.id = id;
//     const result = await modelOperator(req.method, data);
//     HttpMethod(res, 200, 'success', result, '資料更新成功');
//   } catch (error) {
//     console.log(error);
//     HttpMethod(res, 404, 'false', error, '資料格式錯誤');
//   }
// };
// const deleteOnePost = async (req, res) => {
//   try {
//     const id = req.url.split('/').pop();
//     const result = await modelOperator(req.method, id);
//     if (result.message) {
//       HttpMethod(res, 404, 'false', '資料ID錯誤', '刪除單筆資料失敗');
//       return;
//     }
//     HttpMethod(res, 200, 'success', result, '刪除單筆資料成功');
//   } catch (error) {
//     HttpMethod(res, 404, 'false', error, '資料不存在');
//   }
// };
// const deleteAllPost = async (req, res) => {
//   try {
//     const result = await modelOperator(req.method, '刪除全部');
//     HttpMethod(res, 200, 'success', result, '刪除多筆資料成功');
//   } catch (error) {
//     console.log(error);
//     HttpMethod(res, 404, 'false', error, '刪除多筆資料失敗');
//   }
// };
// const options = async (req, res) => {
//   HttpMethod(res, 200, 'true', '連線測試', '連線成功');
// };
// const noRoute = async (req, res) => {
//   HttpMethod(res, 404, 'false', '連線測試', '查無此路由');
// };
module.exports = {
  getPost,
  postPost,
  // editPost,
  // deleteOnePost,
  // deleteAllPost,
  // options,
  // noRoute,
};

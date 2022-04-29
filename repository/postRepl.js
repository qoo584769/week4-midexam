require('../connection/mongooseDB');
const { userModel } = require('../models/userModel');

// 用傳進來的model去資料庫搜尋
async function getDB(schemaModel, modelData = {}) {
  try {
    // 這邊直接寫死關聯訊息集合
    const result = await schemaModel
      .find(modelData.q)
      .populate({ path: 'messageid', select: 'name shot createAt messageid' })
      .sort(modelData.timeSort);
    return result;
  } catch (error) {
    console.log('查詢失敗');
    console.log(error);
  }
}

async function postDB(schemaModel, modelData) {
  try {
    // 新增貼文
    const newPost = await schemaModel.create(modelData);
    // 新增貼文成功會把貼文ID加入發文者的貼文裡面
    const addMsgIdInUser = await userModel.findByIdAndUpdate(
      { _id: newPost.userid },
      { $push: { messageid: newPost._id } },
      { new: true }
    );
    console.log('DB資料新增成功');
    return addMsgIdInUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}
async function createUserDB(schemaModel, modelData) {
  try {
    // 新增使用者
    const newUser = await schemaModel.create(modelData);
    console.log('使用者新增成功');
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}
// async function patchDB(schemaModel, modelData) {
//   // 等待資料庫連線
//   await DBConnect();
//   try {
//     const query = { _id: modelData.id };
//     const result = await schemaModel.findOneAndUpdate(query, modelData);
//     return result;
//   } catch (error) {
//     console.log('更新失敗');
//     return error;
//   }
// }
// // 直接刪除 未使用軟刪除
// async function deleteOneDB(schemaModel, id) {
//   // 等待資料庫連線
//   await DBConnect();
//   try {
//     const result = await schemaModel.findOneAndDelete({ _id: id });
//     return result;
//   } catch (error) {
//     console.log('刪除單筆資料失敗');
//     return error;
//   }
// }
// async function deleteAllDB(schemaModel) {
//   // 等待資料庫連線
//   await DBConnect();
//   try {
//     const result = await schemaModel.deleteMany();
//     return result;
//   } catch (error) {
//     console.log('刪除全部資料失敗');
//     return error;
//   }
// }

module.exports = { getDB, postDB, createUserDB,
  // patchDB, 
  // deleteOneDB, 
  // deleteAllDB 
};

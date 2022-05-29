require('../connection/mongooseDB')
const { userModel } = require('../models/userModel')
const { postModel } = require('../models/postModel')

// 用傳進來的model去資料庫搜尋
async function getDB(schemaModel, modelData = {}) {
  // 這邊直接寫死關聯訊息集合
  const result = await schemaModel
    .find(modelData.q)
    .populate({ path: 'userid', select: 'name shot createAt messageid' })
    .sort(modelData.timeSort)
  return result
}

async function postDB(modelData) {  
    const user = await userModel.findOne({_id:modelData.userid})
    if(!user){
      return {status:false,message:'使用者未註冊'}
    }
  // 新增貼文
  const newPost = await postModel.create(modelData)
  // 新增貼文成功會把貼文ID加入發文者的貼文裡面
  const addMsgIdInUser = await userModel.findByIdAndUpdate(
    { _id: newPost.userid },
    { $push: { postid: newPost._id } },
    { new: true }
  )
  console.log('DB資料新增成功')
  return addMsgIdInUser 
}

async function patchDB(modelData) {
  const { _id, content, image } = modelData
  const query = { _id }
  const result = await postModel.findOneAndUpdate(
    query,
    { content, image },
    { new: true }
  )
  return result
}
// 直接刪除 未使用軟刪除
async function deleteOneDB(id) {
    const result = await postModel.findOneAndDelete({ _id: id })
    console.log(result);
    // 刪除貼文成功會把貼文ID從發文者的貼文裡面刪除
  const pullMsgIdFromUser = await userModel.findByIdAndUpdate(
    { _id: result.userid },
    { $pull: { postid: result._id } },
    { new: true }
  )
    return pullMsgIdFromUser
}
async function deleteAllDB() {
    const result = await postModel.deleteMany()
    return result  
}

module.exports = {
  getDB,
  postDB,
  patchDB,
  deleteOneDB,
  deleteAllDB,
}

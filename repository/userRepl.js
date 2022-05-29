require('../connection/mongooseDB')
const { userModel } = require('../models/userModel')

const createUserDB = async (modelData) => {
  const check = await userModel.findOne({email:modelData.email})
  if(check){
    return {status:false,message:'會員已存在'}
  }
  // 新增使用者
  const newUser = await userModel.create(modelData)
  console.log('使用者新增成功')
  return newUser
}

const loginDB = async (modelData) => {
  const user = await userModel.findOne(modelData)
  .populate({ path: 'postid', select: 'name shot createAt postid' })
  if(!user){
      const errData = {
          status:false,
          message:'無此帳號'
      }
      return errData
  }
  const resData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    postid:user.postid
  }
  return resData;
}
module.exports = { createUserDB, loginDB }

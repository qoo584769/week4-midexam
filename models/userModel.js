const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, '使用者名稱需填寫'],
  },
  email: {
    type: String,
  },
  shot:{
    type:String,
    default:''
  },
  createAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  messageid: [
    {
      type: Schema.Types.ObjectId,
      ref: 'message',
    },
  ],
});

const userModel = model('user', userSchema);

module.exports = { userModel };

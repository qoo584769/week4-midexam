const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  content: {
    type: String,
    require:[true,'貼文內容必填']
  },
  image:{
      type:String,
      default:''
  },
  userid: {
      type:Schema.Types.ObjectId,
      ref:'user'
  },
  createAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
});

const messageModel = model('message', messageSchema);

module.exports = { messageModel };

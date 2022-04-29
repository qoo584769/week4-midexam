var express = require('express');
var router = express.Router();

const postConreoller = require('../controller/postController')

/* GET home page. */
router.get('/user', postConreoller.getPost);
router.post('/user', postConreoller.postPost);

module.exports = router;

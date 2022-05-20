var express = require('express');
var router = express.Router();

const handleErrorAsync = require('../middleware/errorHandler')
const postConreoller = require('../controller/postController')

/* GET home page. */
router.get('/user', handleErrorAsync(postConreoller.getPost));
router.post('/user', handleErrorAsync(postConreoller.postPost));

module.exports = router;

var express = require('express')
var router = express.Router()

const handleErrorAsync = require('../middleware/errorHandler')
const postController = require('../controller/postController')
const userController = require('../controller/userController')

router.post('/users/signup', handleErrorAsync(userController.createUser))
router.post('/users/login', handleErrorAsync(userController.loginUser))

router.get('/posts', handleErrorAsync(postController.getPost))
router.post('/posts', handleErrorAsync(postController.postPost))
router.patch('/posts', handleErrorAsync(postController.editPost))
router.delete('/posts', handleErrorAsync(postController.deleteOnePost))
router.delete('/delAllPosts', handleErrorAsync(postController.deleteAllPost))

module.exports = router

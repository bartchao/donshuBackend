var express = require('express');
var router = express.Router();
const Middleware = require('../middleware/');
const {checkToken,checkTokExp,ImgUpload,checkAPKversion} = Middleware;
const Controller = require('../db/controller/');
const { postController,
  typeController,
  topicController,
  userController,
  commentController ,
  replyController   } = Controller;
// for debug
router.use((req, res, next) => {  // just for debug
  console.log(req.headers);
  console.log(req.body);
  next();
})

router.post('/checkTokExp',checkTokExp);
router.use(checkToken);
// checkAPKversion
router.post('/checkAPKversion', checkAPKversion);
//  post
router.post('/post/addNewPost', postController.addNewPost);
router.post('/post/delete', postController.delete);
router.post('/post/update', postController.update);
// comment
router.post('/post/addComment', commentController.addNew);
router.post('/comment/addAndGet', commentController.addNewAndGetComments);
router.post('/comment/delete', commentController.delete);
router.post('/comment/update', commentController.update);
// reply
router.post('/comment/addReply',replyController.addNew);
router.post('/reply/delete',replyController.delete);
router.post('/reply/update',replyController.update);
// user
router.post('/user/getPosts',userController.getPosts);
router.post('/user/getUser',userController.getUser);
router.post('/user/update',userController.update);
router.post('/user/getOtherUser',userController.getOtherUser);
router.post('/user/getUserPosts',userController.getUserPosts);
router.post('/user/getAllUsername', userController.getAllUser);``
router.post('/user/searchUser', userController.searchUser);
// topic
router.post('/topic/addTopic',topicController.addTopic);
router.post('/topic/deleteTopic',topicController.deleteTopic);

// router.post('/user/delete',userController.delete);

// uploadImg
router.post('/uploadImg', ImgUpload);
module.exports = router;

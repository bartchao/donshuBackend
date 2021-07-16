const Model = require('../model');
const socketio = require('../../socketio');
const errHandler = require('../../util/errHandler');
const io = socketio.getSocketio();
const { Post, Comment,User,Reply } = Model;
const {postOrder,postInclude,cmtInclude} = require('../helper');
async function response(cmt,res,action) {
        cmt = await cmt.reload({include:cmtInclude});
        if(action=="DELETE")await cmt.destroy();
        return await Post.findOne({where:{id:cmt.postId},include:postInclude,order:postOrder})
        .then(post=>{
            const {io} =socketio;
            const response={
                action:action,
                comment:cmt,
                post:post,
            }
            res.status(200).send(response);
            io.emit('change', response);
        })
}
exports.addNew = (req, res, next) => {
    const {body,user} = req;
    const {postId}=body;
    let comment = body; 
    comment.userId = user.id;
    Post.findByPk(postId)
        .then(post =>(post === null)
                        ?   Promise.reject(new Error('Null'))
                        :   Comment.create(comment))
    .then(cmt=>response(cmt,res,action="ADD"))
    .catch(err => {
        console.log(err);
        res.status(500).send(err)
    })
}
exports.addNewAndGetComments = (req, res, next) => {
    // const {body,user} = req;
    // const {postId}=body;
    // let comment = body; 
    // comment.userId = user.id;
    // const comm = Comment.build(comment);
    // Post.findByPk(postId)
    //     .then(post =>(post === null)
    //                     ?   Promise.reject(new Error('Null'))
    //                     :   comm.save())
    //     .then(comment=>comment.getPost())
    //     .then(post=>post.getComments())
    //     .then(comments=>{
    //         const{io}=socketio;
    //         res.status(200).send(comments);
    //         io.emit('change', 1);
    //     })
    //     .catch(err =>errHandler(err,res))
}
exports.delete = (req, res, next) => {
    console.log("object");
    const {body,user} = req;
    const {id}=body;
    Comment.findByPk(id)
        .then(comment => {
            if (comment === null)
                return Promise.reject(new Error('Null'));
            if (comment.userId === req.user.id || req.user.role === 0)
                return response(comment,res,action="DELETE");
            else
                return Promise.reject(new Error('Forbbiden'));
        })
        .catch(err =>errHandler(err,res))
}
exports.update = (req, res, next) => {
    console.log("!!!!!!!!!!!!!!!!!!!!!!");
    const { body, user } = req;
    const { id , text} =body;
    Comment.findByPk(id)
        .then(comment => {
            if (comment === null)
                return Promise.reject(new Error('Null'));
            if (comment.userId === req.user.id || req.user.role === 0)
                return comment.update({"text":text})
            else
                return Promise.reject(new Error('Forbbiden'));
        })
        .then(cmt => response(cmt,res,action="UPDATE"))
        .catch(err =>errHandler(err,res))
}

const Op = require('sequelize').Op;
const Model = require('../model');
const {Post, File, Comment} = Model;
const order = require('../helper').postOrder;
const include = require('../helper').postInclude;
const checkValidDate = require('../../util/checkValidDate');
const errHandler = require('../../util/errHandler');
function preProcessData(body, user) {
    const {type, topic, startDate, endDate } = body;
    delete body.createdAt;
    body.typeId = type.id; delete body.type;
    body.topicId = topic.id; delete body.topic;
    body.startDate = new Date(startDate)
    if(checkValidDate(body.startDate)) delete body.startDate;
    body.endDate = new Date(endDate)
    if(checkValidDate(body.endDate)) delete body.endDate;
    body.userId = user.id;
    return body;
}
exports.query = (req,res,next)=>{
    const body = req.body;
    const { search , isNeed } = body;
    console.log(search);
    Post.findAll({ where: { 
                        [Op.or]: [
                             // LIKE '%search%'
                            {title: {[Op.substring]: search}},  
                            {text: {[Op.substring]: search}}
                        ], 
                        isNeed: (isNeed === "true") },order,include })
        .then(response => res.status(200).send(response))
        .catch(err => errHandler(err,res))
}
exports.addComment = (req, res, next) => {
    const {body,user} = req;
    const {postId}=body;
    let comment = body; 
    comment.userId = user.id;
    const comm = Comment.build(comment);
    Post.findByPk(postId)
        .then(post =>(post === null)
                        ?   Promise.reject(new Error('Null'))
                        :   comm.save())
        .then(()=>res.status(200).send({succeess:true}))
        .catch(err => errHandler(err,res))
}
exports.getAllWithType = (req, res, next) => {
    const body = req.body;
    const { typeId, isNeed } = body;
    Post.findAll({ where: { typeId: typeId, 
                            isNeed: (isNeed === "true") },order,include })
        .then(response => res.status(200).send(response))
        .catch(err => errHandler(err,res))
}
exports.getLimitWithType = (req, res, next) => {
    const body = req.body;
    let { typeId, isNeed, offset, limit } = body;
    offset = parseInt(offset);
    limit  = parseInt(limit);
    Post.findAll({
            where: {    typeId: typeId, 
                        isNeed: (isNeed === "true") },
            limit,
            offset,
            order,
            include })
        .then(response => {
            console.log(response);
            res.status(200).send(response)
        })
        .catch(err => errHandler(err,res))
}
exports.getById = (req,res,next)=>{
    const {body } = req;
    const { postId } = body;
    Post.findOne({ where: { id : postId},order,include })
        .then(response => res.status(200).send(response))
        .catch(err => errHandler(err,res))
}
exports.addNewPost = (req, res, next) => {
    let { body, user } = req;
    body = preProcessData(body, user);
    console.log(body);
    Post.create(body, { include: [File] })
        .then(result => res.status(200).send({ succeess: true }))
        .catch(err => errHandler(err,res))
}
exports.delete = (req, res, next) => {
    const body = req.body;
    const pk = body.postId;
    Post.findByPk(pk)
        .then(post => {
            if (post === null)
                return Promise.reject(new Error('Null'));
            if (post.userId === req.user.id || req.user.role === 0)
                return post.destroy()
            else
                return Promise.reject(new Error('Forbbiden'));
        })
        .then(() => res.status(200).send({ succeess: true }))
        .catch(err => errHandler(err,res))
}
exports.update = (req, res, next) => {
    const { body, user } = req;
    const { files } =body;
    let uPost = preProcessData(body, user);
    delete uPost.files ;
    const pk = body.id;
    Post.findByPk(pk, { include: [File] })
        .then(post => {
            if (post === null)
                return Promise.reject(new Error('Null'));
            if (post.userId === req.user.id){
                post.files.map(file=>file.destroy());
                uPost.userId = post.userId; // 把po文者換成原本的po文者    
                const postUpdate = post.update(uPost,{ fields: Object.keys(uPost)});
                const filesUpdate = files.map(file => {
                    delete file.id;
                    file.postId = post.id;
                    return File.create(file);
                });
                let update = [];
                update.push(postUpdate);
                update.push(filesUpdate);
                return Promise.all(update);
            }
            else
                return Promise.reject(new Error('Forbbiden'));
        })
        .then(post => {
            res.status(200).send({ succeess: true })
        })
        .catch(err => errHandler(err,res))
}

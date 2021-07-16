const Model = require('../model');
const {Topic,Post} = Model;
const errHandler = require('../../util/errHandler');
exports.getAll =(req, res, next)=>{
    Topic.findAll({attributes:["id","topicName"]})
    .then(response=>res.status(200).send(response))
    .catch(err =>errHandler(err,res))
} 
exports.getWithType = (req, res, next)=>{
    const {body} = req;
    const {typeId} = body;
    
    Topic.findAll({where:{typeId:typeId},attributes:["id","topicName"]})
    .then(response=>{
        console.log(response)
        res.status(200).send(response)
    })
    .catch(err =>errHandler(err,res))
} 
exports.addTopic = (req,res,next)=>{
	const {body,user} = req;
    if (req.user.role === 0)
		Topic.create(body)
			.then(result=>res.status(200).send(result))
			.catch(err => errHandler(err,res))
	else 
		res.status(403).send({message:"you are not adminstrator"});
}

exports.deleteTopic = (req,res,next)=>{
	const {body,user} = req;
	const {topicId} = body;
	const limitDelete = [42,43,44,45,46,47,48];
	let canDelete = true;
	limitDelete.forEach(val=>{
		if(topicId==val)canDelete=false;
	})
	if (req.user.role === 0 && canDelete)
		Topic.findByPk(topicId)
			.then(async topic=>{
				const otherTopicId = 41 + topic.typeId;
				await Post.update({topicId:otherTopicId},{where:{topicId:topicId}})
				return topic.destroy();	
			})
			.then(result=>res.status(200).send(result))
			.catch(err => errHandler(err,res))
	else 
		res.status(403).send({message:"you are not adminstrator"});
}
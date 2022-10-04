const sequelize = require('../db');
const Type = require('./type');
const Topic = require('./topic');
const User = require('./user');
const Post = require('./post');
const File = require('./file');
const Comment = require('./comment');
const Follow = require('./follow');
const Reply = require('./reply');
User.hasMany(Post);
User.hasMany(Follow)
Follow.belongsTo(Topic)
Topic.belongsTo(Type)
Post.belongsTo(User)
Post.belongsTo(Type)
Post.belongsTo(Topic)
Post.hasMany(File)
Post.hasMany(Comment)
Comment.belongsTo(User);
Comment.belongsTo(Post);
Comment.hasMany(Reply)
Reply.belongsTo(Comment);
Reply.belongsTo(User);


console.log("set sequelize...\n".help);
//  test 
sequelize.sync({force:false}).then(()=>{
    console.log("\nset sequelize successful!\n".success);
    /*
    const typeArr = ["食","衣","住","行","育","樂","醫療長照"];
    const topicArr =[
                    {topicName:"菜車",typeId:1},
                    {topicName:"商家資訊",typeId:1},
                    {topicName:"捐贈食品",typeId:1},
                    {topicName:"自助洗衣",typeId:2},
                    {topicName:"公益洗衣",typeId:2},
                    {topicName:"二手衣",typeId:2},
                    {topicName:"公益技師",typeId:3},
                    {topicName:"志工資訊",typeId:3},
                    {topicName:"白牌車",typeId:4},
                    {topicName:"惡犬",typeId:4},
                    {topicName:"東食Uber",typeId:4},
                    {topicName:"經驗傳承",typeId:5},
                    {topicName:"家庭代工",typeId:5},
                    {topicName:"志工招募",typeId:5},
                    {topicName:"活動資訊",typeId:6},
                    {topicName:"耆樂居",typeId:6}]
    return Promise.all(typeArr.map(element => Type.create({typeName:element})))
    .then(()=>Promise.all(topicArr.map(element => Topic.create(element))))
    */

    
    // .then(()=>User.addUser("CCCCC","pCCCCd","muC",1))
    // .then(user=>Post.create(
    //     {
    //         typeId:1,
    //         topicId:1,
    //         title:"EEEEE",
    //         startDate:new Date,
    //         endDate:new Date,
    //         position:"dqwdwqdwqdw",
    //         latitude:3213213213,
    //         longitude:123123213,
    //         text:"AAAA",
    //         userId:user.id,
    //         // postTime:new Date(),
    //         isNeed:true,
    //         files:[
    //             {
    //                 url:"fdewfew",
    //                 fileName:"fdewfew",
    //             },{
    //                 url:"AAAAA",
    //                 fileName:"AAAAAAAAA",
    //             }
    //         ],
    //         comments:[{
    //             text:"fewfewfewf",
    //             userId:user.id
    //             },
    //             {
    //                 text:"vvdsvdsvdsvdf",
    //                 userId:user.id
    //                 }
    //         ],            
    //     },{ include: [ File,Comment ]}))
// .then(()=>User.findOne({where:{account:"CCCCC"}}))
// .then(user=>{
//     console.log("user.id--------------------");
//     console.log(user.id);
//     return Post.create(
//         {
//             typeId:1,
//             topicId:1,
//             title:"sfwefewfewf",
//             text:"fewfewfewfwefew",
//             userId:user.id,
//             postTime:new Date(),
//             isNeed:true,          
//         })
// })
// .then(()=>User.findOne({where:{account:"CCCCC"}}))
// .then(user=>user.getPosts())
// .then(posts=>{
//     posts.map(value=>{
//         let element = value.dataValues;
//         console.log(element.title);
//     })
})


module.exports = {
 Type ,
 Topic ,
 User ,
 Post ,
 File ,
 Comment ,
 Follow ,
 Reply
}
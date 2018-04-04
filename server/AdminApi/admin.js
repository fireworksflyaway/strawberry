/**
 * Created by Mason Jackson in Office on 1/17/18.
 */
const jsonwebtoken=require('jsonwebtoken');
const sha256=require('js-sha256').sha256;
const MailApi=require('../MailApi');
const db=require('../db');
const {ADMIN_ACCESS_KEY} = require( '../configuration');
const accessOption={expiresIn: '6h'};

module.exports={
        signIn:(req, res) => {
                let {Username, Password}= req.body;
                Password=sha256(Password);
                db.select('Admin', {Username, Password}, function (result) {
                        let code='0'; //未知错误
                        if(result._err){
                                res.status(500).send(code);
                        } else {
                                if(result.length==0){
                                        code='10001'  //用户名不存在或密码错误;
                                        res.status(500).send(code);
                                } else {
                                        const token=jsonwebtoken.sign({username: Username}, ADMIN_ACCESS_KEY, accessOption);
                                        res.send({token});
                                }
                        }
                })
        },

        getUserList:(req, res) => {
                const {type}=req.query;
                db.select(`${type}User`,{}, function (result) {
                        db.aggregate(`${type}Report`, {$group:{_id:"$Username", event:{$sum:1}}}, function (err, list) {
                                if(err){
                                        res.status(500).send('0');
                                } else {
                                        const eventCount={};
                                        list.forEach(x=>{
                                                eventCount[x._id]=x.event;
                                        })
                                        result.forEach(res=>{
                                                res.Event=eventCount[res.Username];
                                                if(res.Event===undefined)
                                                        res.Event=0;
                                                delete res.Password;
                                        })
                                        res.send(result);
                                }

                        })
                })
        },

        getProfile:(req,res)=>{
                let {username}= req.user;
                db.select('Admin',{Username:username},function (result) {
                        let code='0';
                        if(result._err){
                                res.status(500).send(code);
                        }
                        else {
                                if(result.length==0){
                                        res.status(500).send(code);
                                }
                                else {
                                        const {Email}=result[0];
                                        res.send({username, email: Email});
                                }
                        }
                })
        },

        updateProfile:(req, res) => {
                const username=req.user.username;
                const {email}=req.body;
                db.updateOne('Admin', {Username: username}, {$set:{Email: email}}, function (result) {
                        if(result._err){
                                res.status(500).send('0');
                        }
                        else{
                                res.send({suc:true});
                        }
                })
        },

        updatePassword:(req, res) => {
                const {username}=req.user;
                let {currentPassword, newPassword}= req.body;
                currentPassword=sha256(currentPassword);
                db.select('Admin', {Username: username, Password:currentPassword}, function (result) {
                        if(result._err){
                                res.status(500).send('0');
                        }
                        else {
                                if (result.length === 0) {
                                        res.status(500).send('10004');   //密码错误
                                }
                                else {
                                        //update
                                        newPassword = sha256(newPassword);
                                        db.updateOne('Admin', {Username:username}, {$set: {Password: newPassword}}, function (result) {
                                                if (result._err) {
                                                        res.status(500).send('0');
                                                }
                                                else {
                                                        res.send({suc: true});
                                                }
                                        })
                                }
                        }
                        }
                )
        },

        certificate:(req, res) => {
                const {Username, Email, Type}=req.body;
                db.updateOne(`${Type}User`, {Username}, {$set:{Certification:true}}, function (result) {
                        if(result._err){
                                res.status(500).send('0');
                        }
                        else{
                                const mailOptions = {
                                        to: Email, // 收件地址
                                        subject: '博脑会员注册', // 标题
                                        html: `<b>您的会员注册请求已通过,现在可访问<a href=\"www.brainnow.cn\">我们的主页</a>登录并使用我们的服务</b><br />`
                                };
                                MailApi.sendEmail(mailOptions, function (error, info) {
                                        if(error)
                                        {
                                                console.error(error);
                                                res.status(500).send('40001');  //电子邮件发送失败
                                        }
                                        else
                                        {
                                                res.send({suc: true})
                                        }
                                });
                        }
                })

        }
}

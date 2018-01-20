/**
 * Created by Mason Jackson in Office on 1/17/18.
 */
const jsonwebtoken=require('jsonwebtoken');
const fs=require('fs');
const sha256=require('js-sha256').sha256;
const MailApi=require('../MailApi');
const MailService=new MailApi();
const DAL=require('../db');
const db=new DAL();
const config=JSON.parse(fs.readFileSync('./server/config.json', 'utf-8'));
const accessOption={expiresIn: '6h'};

class AdminAPI{
        signIn(req, res){
                let {username, password}= req.body;
                password=sha256(password);
                db.select('admin', {username, password}, function (result) {
                        let code='0'; //未知错误
                        if(result._err){
                                res.status(500).send(code);
                        } else {
                                if(result.length==0){
                                        code='10001'  //用户名不存在或密码错误;
                                        res.status(500).send(code);
                                } else {
                                        const token=jsonwebtoken.sign({username: username}, config.adminAccessKey, accessOption);
                                        res.send({token});
                                }
                        }
                })
        }

        getUserList(req, res){
                db.select('basicUser',{}, function (result) {
                        db.aggregate('basicReport',{$group:{_id:"$username", event:{$sum:1}}}, function (err, list) {
                                if(err){
                                        res.status(500).send('0');
                                } else {
                                        const eventCount={};
                                        list.forEach(x=>{
                                                eventCount[x._id]=x.event;
                                        })
                                        result.forEach(res=>{
                                                res.event=eventCount[res.username];
                                                if(res.event===undefined)
                                                        res.event=0;
                                                delete res.password;
                                        })
                                        res.send(result);
                                }

                        })
                })
        }

        getProfile(req,res){
                let {username}= req.user;
                db.select('admin',{username},function (result) {
                        let code='0';
                        if(result._err){
                                res.status(500).send(code);
                        }
                        else {
                                if(result.length==0){
                                        res.status(500).send(code);
                                }
                                else {
                                        const {email}=result[0];
                                        res.send({username, email});
                                }
                        }
                })
        }

        updateProfile(req, res){
                const username=req.user.username;
                const {email}=req.body;
                db.updateOne('admin', {username}, {$set:{email}}, function (result) {
                        if(result._err){
                                res.status(500).send('0');
                        }
                        else{
                                res.send({suc:true});
                        }
                })
        }

        updatePassword(req, res){
                const {username}=req.user;
                let {currentPassword, newPassword}= req.body;
                currentPassword=sha256(currentPassword);
                db.select('admin', {username, password:currentPassword}, function (result) {
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
                                        db.updateOne('admin', {username}, {$set: {password: newPassword}}, function (result) {
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
        }

        certificate(req, res){
                const {username, email}=req.body;
                db.updateOne('basicUser', {username}, {$set:{certification:true}}, function (result) {
                        if(result._err){
                                res.status(500).send('0');
                        }
                        else{
                                const mailOptions = {
                                        to: email, // 收件地址
                                        subject: '博脑会员注册', // 标题
                                        html: `<b>您的会员注册请求已通过,现在可访问<a href=\"www.brainnow.cn\">我们的主页</a>登录并使用我们的服务</b><br />`
                                };
                                MailService.sendEmail(mailOptions, function (error, info) {
                                        if(error)
                                        {
                                                console.error(error);
                                                res.status(500).send('40001');  //电子邮件发送失败
                                        }
                                        else
                                        {
                                                res.send({suc: true})
                                                // const token=jsonwebtoken.sign({username}, config.accessKey, accessOption);
                                                // res.send({token});
                                        }
                                });
                        }
                })

        }
}

module.exports=AdminAPI;
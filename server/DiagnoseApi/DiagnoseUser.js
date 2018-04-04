/**
 * Created by Mason Jackson in Office on 3/20/18.
 */
const jsonwebtoken=require('jsonwebtoken');
const sha256=require('js-sha256').sha256;
const db=require('../db');
const MailApi=require('../MailApi');
const {DIAGNOSE_ACCESS_KEY} = require( '../configuration');
const accessOption={expiresIn: '6h'};

module.exports={
        signIn:(req, res) => {
                let {Username, Password}= req.body;
                Password=sha256(Password);
                db.select('DiagnoseUser', {Username, Password}, function (result) {
                        let code='0'; //未知错误
                        if(result._err){
                                res.status(500).send(code);
                        } else {
                                if(result.length==0){
                                        code='10001'  //用户名不存在或密码错误;
                                        res.status(500).send(code);
                                } else {
                                        if(result[0].Certification===false)
                                                res.status(500).send('10005');  //用户尚未获得授权
                                        else {
                                                const token=jsonwebtoken.sign({username: Username}, DIAGNOSE_ACCESS_KEY, accessOption);
                                                res.send({token});
                                        }
                                }
                        }
                })
        },

        signUp:(req, res) => {
                let {Username, Password, Email, Phone, Department} = req.body;
                Password=sha256(Password);
                const userData={Username, Password, Email, Phone, Department, Certification: false};
                db.insert('DiagnoseUser', userData, function (result) {
                        if(result._err){
                                let code='0'; //未知错误
                                console.log(result._err);
                                if(result._err.message.includes('Username'))
                                        code='10002';  //用户名已被注册
                                else
                                        code='10003';  //邮箱已经被注册
                                res.status(500).send(code);
                        }
                        else{
                                //获得管理员邮箱
                                db.select('Admin', {Username:'admin'}, function (adResult) {
                                        if(adResult._err)
                                        {
                                                res.status(500).send('0');
                                        }
                                        else
                                        {
                                                const mailOptions = {
                                                        to: adResult[0].Email, // 收件地址
                                                        subject: '博脑会员注册', // 标题
                                                        html: `<b>新的博脑用户注册请求</b><br /><b>用户名: </b>${Username}<br />请及时处理` // html 内容
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
                })
        },

        getProfile:(req, res) => {
                const username=req.user.username;
                db.select('DiagnoseUser',{Username: username},function (result) {
                        let code='0';
                        if(result._err){
                                res.status(500).send(code);
                        }
                        else {
                                if(result.length==0){
                                        res.status(500).send(code);
                                }
                                else {
                                        const {Email, Phone, Department}=result[0];
                                        res.send({Username: username, Email, Phone, Department});
                                }
                        }
                })
        },

        updateProfile:(req, res) => {
                const username=req.user.username;
                const {email, phone, department}=req.body;
                db.updateOne('DiagnoseUser', {Username: username}, {$set:{Email:email, Phone: phone, Department: department}}, function (result) {
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
                db.select('DiagnoseUser', {Username:username, Password:currentPassword}, function (result) {
                        if(result._err){
                                res.status(500).send('0');
                        }
                        else{
                                if(result.length===0){
                                        res.status(500).send('10004');   //密码错误
                                }
                                else{
                                        //update
                                        newPassword=sha256(newPassword);
                                        db.updateOne('DiagnoseUser', {Username: username}, {$set:{Password: newPassword}}, function (result) {
                                                if(result._err){
                                                        res.status(500).send('0');
                                                }
                                                else{
                                                        res.send({suc:true});
                                                }
                                        })
                                }
                        }
                })
        }



}

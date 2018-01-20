/**
 * Created by Mason Jackson in Office on 2017/12/3.
 */
const jsonwebtoken=require('jsonwebtoken');
const fs=require('fs');
const sha256=require('js-sha256').sha256;
const DAL=require('../db');
const MailApi=require('../MailApi');
const MailService=new MailApi();
const db=new DAL();
const config=JSON.parse(fs.readFileSync('./server/config.json', 'utf-8'));
const accessOption={expiresIn: '6h'};

class UserAPI{
        signIn(req, res){
                let {username, password}= req.body;
                password=sha256(password);
                db.select('basicUser', {username, password}, function (result) {
                        let code='0'; //未知错误
                        if(result._err){
                                res.status(500).send(code);
                        } else {
                                if(result.length==0){
                                        code='10001'  //用户名不存在或密码错误;
                                        res.status(500).send(code);
                                } else {
                                        if(result[0].certification===false)
                                                res.status(500).send('10005');  //用户尚未获得授权
                                        else {
                                                const token=jsonwebtoken.sign({username: username}, config.accessKey, accessOption);
                                                res.send({token});
                                        }
                                }
                        }
                })
        }

        signUp(req, res){
                let {username, password, email, phone, department} = req.body;
                password=sha256(password);
                const userData={username, password, email, phone, department, certification: false};
                db.insert('basicUser', userData, function (result) {
                        if(result._err){
                                let code='0'; //未知错误
                                if(result._err.message.includes('username'))
                                        code='10002';  //用户名已被注册
                                else
                                        code='10003';  //邮箱已经被注册
                                res.status(500).send(code);
                        }
                        else{
                                //获得管理员邮箱
                                db.select('admin', {username:'admin'}, function (adResult) {
                                        if(adResult._err)
                                        {
                                                res.status(500).send('0');
                                        }
                                        else
                                        {
                                                const mailOptions = {
                                                        to: adResult[0].email, // 收件地址
                                                        subject: '博脑会员注册', // 标题
                                                        html: `<b>新的博脑用户注册请求</b><br /><b>用户名: </b>${username}<br />请及时处理` // html 内容
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
                })
        }
        
        getProfile(req, res){
                const username=req.user.username;
                db.select('basicUser',{username},function (result) {
                        let code='0';
                        if(result._err){
                                res.status(500).send(code);
                        }
                        else {
                                if(result.length==0){
                                        res.status(500).send(code);
                                }
                                else {
                                        const {email, phone}=result[0];
                                        res.send({username, email, phone});
                                }
                        }
                })
        }

        updateProfile(req, res){
                const username=req.user.username;
                const {email, phone}=req.body;
                db.updateOne('basicUser', {username}, {$set:{email, phone}}, function (result) {
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
                db.select('basicUser', {username, password:currentPassword}, function (result) {
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
                                        db.updateOne('basicUser', {username}, {$set:{password: newPassword}}, function (result) {
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

module.exports=UserAPI;
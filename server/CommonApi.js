/**
 * Created by Mason Jackson in Office on 3/5/18.
 */
const DAL=require('./db');
const MailApi=require('./MailApi');
const uuidV1 = require('uuid/v1');
const sha256=require('js-sha256').sha256;
const MailService=new MailApi();
const db=new DAL();

class CommonApi{
        forgetPassword(req, res){
                const {email, type}=req.body;
                db.getCount(`${type}User`, {Email: email}, function (count) {
                        if(count==0){
                                res.status(500).send('10006');
                        }
                        else{
                                const resetAuth=uuidV1();
                                let resetAuthExpireTime=new Date();
                                resetAuthExpireTime.setHours(resetAuthExpireTime.getHours()+1);  //有效期1小时

                                db.updateOne(`${type}User`, {Email: email}, {$set:{ResetAuth: resetAuth, ResetAuthExpireTime: resetAuthExpireTime}}, function (result) {
                                        if(result._err){
                                                res.status(500).send('0');
                                        }
                                        else{
                                                //send an email
                                                const query=encodeURI(`type=${type}&email=${email}&resetAuth=${resetAuth}`);
                                                console.log(query);
                                                const resetUrl=`http://localhost:3000/ResetPassword?${query}`;
                                                const mailOptions = {
                                                        to: email, // 收件地址
                                                        subject: '博脑会员密码重置', // 标题
                                                        html: `请通过以下链接重置密码(链接有效期为一小时)<br />${resetUrl}` // html 内容
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
                                                        }
                                                });
                                        }

                                })
                        }
                })
        }

        confirmResetAuth(req, res){
                const {email, type, resetAuth}=req.body;
                db.select(`${type}User`, {Email: email, ResetAuth: resetAuth, ResetAuthExpireTime: {$gte: new Date()}}, function (result) {
                        if(result._err){
                                res.status(500).send('0');
                        }
                        if(result.length!=1){
                                res.status(500).send('10007');
                        }
                        else{
                                res.send({username: result[0].Username});
                        }
                })
        }



        resetPassword(req, res){
                const {username, type, resetAuth, password}=req.body;
                db.select(`${type}User`, {Username: username, ResetAuth: resetAuth, ResetAuthExpireTime: {$gte: new Date()}}, function (result) {
                        if(result._err){
                                res.status(500).send('0');
                        }
                        if(result.length!=1){
                                res.status(500).send('10007');
                        }
                        else{
                                const newPassword=sha256(password);
                                db.updateOne(`${type}User`, {Username: username}, {$set:{Password: newPassword, ResetAuth:'', ResetAuthExpireTime: new Date()}}, function (result) {
                                        if(result._err){
                                                res.status(500).send('0');
                                        }
                                        else{
                                                res.send({suc:true});
                                        }
                                })
                        }
                })
        }
}
module.exports=CommonApi;
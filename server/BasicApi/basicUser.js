/**
 * Created by Mason Jackson in Office on 2017/12/3.
 */
const jsonwebtoken=require('jsonwebtoken');
const fs=require('fs');
const DAL=require('../db');
const db=new DAL();
const config=JSON.parse(fs.readFileSync('./server/config.json', 'utf-8'));
const accessOption={expiresIn: '6h'};

class UserAPI{
        signIn(req, res){
                const {username, password, lan}= req.body;
                db.select('basicUser', {username, password}, function (result) {
                        let code='0';
                        if(result._err){
                                db.getError(lan, code, function (error) {
                                        res.status(500).send({error});
                                })
                        } else {
                                if(result.length==0){
                                        code='10003';
                                        db.getError(lan, code, function (error) {
                                                res.status(500).send({error});
                                        })
                                } else {
                                        const token=jsonwebtoken.sign({username: username}, config.accessKey, accessOption);
                                        res.send({token});
                                }
                        }
                })
        }

        signUp(req, res){
                const {username, password, email, phone, lan} = req.body;
                const userData={username, password, email, phone};
                db.insert('basicUser', userData, function (result) {
                        if(result._err){
                                let code='10000';
                                if(result._err.code=='11000')
                                {
                                        if(result._err.message.includes('username'))
                                                code='10001';
                                        else
                                                code='10002';
                                }
                                db.getError(lan, code, function (error) {
                                        res.status(500).send({error});
                                })
                        }
                        else{
                                const token=jsonwebtoken.sign({username}, config.accessKey, accessOption);
                                res.send({token});
                        }
                })
        }
        
        getProfile(req, res){
                const username=req.user.username;
                db.select('basicUser',{username},function (result) {
                        let code='10000';
                        if(result._err){
                                db.getError(req.body.lan, code, function (error) {
                                        res.status(500).send({error});
                                })
                        }
                        else {
                                if(result.length==0){
                                        code='11000';
                                        db.getError(req.body.lan, code, function (error) {
                                                res.status(500).send({error});
                                        })
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
                                res.status(500).send({code: 0});
                        }
                        else{
                                res.send({suc:true});
                        }
                })
        }

        updatePassword(req, res){
                const {username}=req.user;
                const {currentPassword, newPassword}= req.body;
                db.select('basicUser', {username, password:currentPassword}, function (result) {
                        if(result._err){
                                res.status(500).send({code: 0});
                        }
                        else{
                                if(result.length===0){
                                        res.status(500).send({code: '10004'});   //密码错误
                                }
                                else{
                                        //update
                                        db.updateOne('basicUser', {username}, {$set:{password: newPassword}}, function (result) {
                                                if(result._err){
                                                        res.status(500).send({code: 0});
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
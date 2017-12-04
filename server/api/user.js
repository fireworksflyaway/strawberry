/**
 * Created by Mason Jackson in Office on 2017/12/3.
 */
const jsonwebtoken=require('jsonwebtoken');
const fs=require('fs');
const DAL=require('../db');
const db=new DAL();
const config=JSON.parse(fs.readFileSync('./server/config.json', 'utf-8'));
const accessOption={};

class UserAPI{
        signIn(req, res){
                const {username, password, lan}= req.body;
                db.select('user', {username, password}, function (result) {
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
                db.insert('user', userData, function (result) {
                        if(result._err){
                                let code='10000';
                                if(result._err.code==11000)
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
                                const token=jsonwebtoken.sign({username: username}, config.accessKey, accessOption);
                                res.send({token});
                        }
                })
        }
}

module.exports=UserAPI;
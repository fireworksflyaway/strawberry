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
                const {username, password}= req.body;
                if(username==='mason'&&password==='456'){
                        const token=jsonwebtoken.sign({username: username}, config.accessKey, accessOption);
                        res.send(JSON.stringify({token}));
                }
                else
                        res.status(500).send(JSON.stringify({error:'Invalid Password'}));
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
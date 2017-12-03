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
                console.log(config.accessKey);
                const {username, password, email, phone} = req.body;
                const userData={username, password, email, phone};
                db.insert('user', userData, function () {
                        if(res._err){
                                res.status(500).send({error:'Database failed'});
                        }
                        else{
                                const token=jsonwebtoken.sign({username: username}, config.accessKey, accessOption);
                                res.send({token});
                        }
                })
        }
}

module.exports=UserAPI;
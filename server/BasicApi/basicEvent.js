/**
 * Created by Mason Jackson in Office on 12/25/17.
 */
const fs=require('fs');
const DAL=require('../db');
const moment=require('moment');
const ObjectID = require('mongodb').ObjectID;
const db=new DAL();
const config=JSON.parse(fs.readFileSync('./server/config.json', 'utf-8'));

class BasicEventAPI{
    getEvent(req, res){
        const {username}=req.user;
        db.select("basicEvent", {username}, function (result) {
            //console.log(result);
                if(result._err){
                    res.status(500).send('0');
                    return;
                }
                let eventList=[];
                result.forEach(function (rr) {
                    eventList.push({
                        number: rr.number,
                        type: rr.type,
                        status: rr.status,
                        creationTime: moment((new ObjectID(rr._id)).getTimestamp()).format('YYYY/MM/DD HH:mm:ss'),
                        startTime: rr.startTime?moment(rr.startTime).format('YYYY/MM/DD HH:mm:ss'):'',
                        endTime: rr.endTime?moment(rr.endTime).format('YYYY/MM/DD HH:mm:ss'):'',
                    });
                })
                res.send({suc:true, eventList});
        })
    }

    getReport(req, res){
        const {username}=req.user;
        db.select("basicReport", {username}, function (result) {
            //console.log(result);
                if(result._err){
                        res.status(500).send('0');
                        return;
                }
                result.forEach(rr=>{
                    rr.creationTime=moment((new ObjectID(rr._id)).getTimestamp()).format('YYYY/MM/DD HH:mm:ss');
                })

                res.send({suc:true, result});
        })
    }
}

module.exports=BasicEventAPI;
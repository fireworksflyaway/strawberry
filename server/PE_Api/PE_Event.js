/**
 * Created by Mason Jackson in Office on 12/25/17.
 */
const fs=require('fs');
const DAL=require('../db');
const moment=require('moment');
const ObjectID = require('mongodb').ObjectID;
const db=new DAL();
const config=JSON.parse(fs.readFileSync('./server/config.json', 'utf-8'));

class PE_EventAPI{
    getEvent(req, res){
        const {username}=req.user;
        db.select("PE_Event", {Username: username}, function (result) {
            //console.log(result);
                if(result._err){
                    res.status(500).send('0');
                    return;
                }
                let eventList=[];
                result.forEach(function (rr) {

                    eventList.push({
                        Number: rr.Number,
                        IsBatch: rr.IsBatch,
                        Status: rr.Status,
                        CreationTime: moment((new ObjectID(rr._id)).getTimestamp()).format('YYYY/MM/DD HH:mm:ss'),
                        StartTime: rr.StartTime!==undefined?moment(rr.StartTime).format('YYYY/MM/DD HH:mm:ss'):'',
                        EndTime: rr.EndTime!==undefined?moment(rr.EndTime).format('YYYY/MM/DD HH:mm:ss'):'',
                    });
                })
                res.send({suc:true, eventList});
        })
    }

    getReport(req, res){
        const {username}=req.user;
        db.select("PE_Report", {Username: username}, function (result) {
            //console.log(result);
                if(result._err){
                        res.status(500).send('0');
                        return;
                }
                result.forEach(rr=>{
                    rr.CreationTime=moment((new ObjectID(rr._id)).getTimestamp()).format('YYYY/MM/DD HH:mm:ss');
                })

                res.send({suc:true, result});
        })
    }
}

module.exports=PE_EventAPI;
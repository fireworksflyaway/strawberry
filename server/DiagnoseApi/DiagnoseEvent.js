/**
 * Created by Mason Jackson in Office on 3/20/18.
 */
const fs=require('fs');
const DAL=require('../db');
const moment=require('moment');
const ObjectID = require('mongodb').ObjectID;
const db=new DAL();
const config=JSON.parse(fs.readFileSync('./server/config.json', 'utf-8'));

module.exports={
        getEvent: (req, res)=>{
                const {username}=req.user;
                db.select("DiagnoseEvent", {Username: username}, function (result) {
                        if(result._err){
                                res.status(500).send('0');
                                return;
                        }
                        let eventList=[];
                        result.forEach(function (rr) {
                                eventList.push({
                                        Number: rr.Number,
                                        DsType: rr.DsType,
                                        Status: rr.Status,
                                        CreationTime: moment((new ObjectID(rr._id)).getTimestamp()).format('YYYY/MM/DD HH:mm:ss'),
                                        StartTime: rr.StartTime?moment(rr.StartTime).format('YYYY/MM/DD HH:mm:ss'):'',
                                        EndTime: rr.EndTime?moment(rr.EndTime).format('YYYY/MM/DD HH:mm:ss'):'',
                                });
                        })
                        res.send({suc:true, eventList});
                })
        },

        getReport: (req, res)=>{
                const {username}=req.user;
                db.select("DiagnoseReport", {Username: username}, function (result) {
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


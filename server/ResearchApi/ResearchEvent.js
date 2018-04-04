/**
 * Created by Mason Jackson in Office on 3/1/18.
 */

const db=require('../db');
const moment=require('moment');
const ObjectID = require('mongodb').ObjectID;

module.exports={
        getEvent:(req, res) => {
                const {username}=req.user;
                db.select("ResearchEvent", {Username: username}, function (result) {
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
                                        StartTime: rr.StartTime?moment(rr.StartTime).format('YYYY/MM/DD HH:mm:ss'):'',
                                        EndTime: rr.EndTime?moment(rr.EndTime).format('YYYY/MM/DD HH:mm:ss'):'',
                                });
                        })
                        res.send({suc:true, eventList});
                })
        },

        getReport:(req, res) => {
                const {username}=req.user;
                db.select("ResearchReport", {Username: username}, function (result) {
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


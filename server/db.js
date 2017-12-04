/**
 * Created by Mason Jackson in Office on 2017/12/3.
 */
const MongoClient=require('mongodb').MongoClient;
const DB_CONN_STR='mongodb://localhost:27017/strawberry';

class DAL{
        insert(collection, data, callback){
                MongoClient.connect(DB_CONN_STR, function (err, db) {
                        db.collection(collection).insertOne(data, function (err, result) {
                                db.close();
                                if(err){
                                        console.error(err);
                                        callback({_err:err})
                                }
                                else
                                        callback(result);
                        })
                })
        }

        select(collection, whereStr, callback){
                MongoClient.connect(DB_CONN_STR, function (err, db) {
                        db.collection(collection).find(whereStr).toArray(function (err, result) {
                                db.close();
                                if(err){
                                        console.error(err);
                                        callback({_err:err})
                                }
                                else
                                        callback(result);
                        })
                })
        }

        getError(lan, code, callback){
                MongoClient.connect(DB_CONN_STR, function (err, db) {
                        db.collection('error').find({code}).toArray(function (err, result) {
                                db.close();
                                if(err){
                                        console.error(err);
                                        callback({code:'0', message:'Unknown Error'});
                                }
                                else
                                        callback(result[0][lan]);
                        })
                })
        }
}

module.exports=DAL;
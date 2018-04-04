/**
 * Created by Mason Jackson in Office on 2017/12/3.
 */

const MongoClient=require('mongodb').MongoClient;
const {MONGO_CONN}=require('./configuration');

module.exports = {
        insert(collection, data, callback){
                MongoClient.connect(MONGO_CONN, function (err, db) {
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
        },

        select(collection, whereStr, callback){
                MongoClient.connect(MONGO_CONN, function (err, db) {
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
        },

        updateOne(collection, queryOption, updateOption,  callback){
                MongoClient.connect(MONGO_CONN, function (err, db) {
                        db.collection(collection).updateOne(queryOption, updateOption,function (err, result) {
                                db.close();
                                if(err){
                                        console.error(err);
                                        callback({_err:err});
                                }
                                else
                                        callback(result);
                        })
                })
        },

        getCount(collection, queryOption, callback){
                MongoClient.connect(MONGO_CONN,function (err, db) {
                        db.collection(collection).count(queryOption, function (err, count) {
                                db.close();
                                if(err){
                                        console.error(err);
                                        callback({_err:err});
                                }
                                else
                                        callback(count);
                        })
                })
        },

        aggregate(collection, option, callback){
                MongoClient.connect(MONGO_CONN, function (err, db) {
                        db.collection(collection).aggregate(option, function (err, result) {
                                db.close();
                                callback(err, result);
                                // if(err){
                                //         console.error(err);
                                //         callback({_err:err});
                                // }
                                // else
                                //         callback(result);
                        })
                })
        },

}

/**
 * Created by Mason Jackson in Office on 2017/12/14.
 */
const fs=require('fs');
const DAL=require('../db');
const moment=require('moment');
const ObjectID = require('mongodb').ObjectID;
const redis=require('redis');
const db=new DAL();
class BasicUploadAPI{
        emptyDir(fileUrl) {
                if(!fs.existsSync(fileUrl))
                        return;
                let files = fs.readdirSync(fileUrl);//读取该文件夹
                files.forEach(function (file) {
                        let stats = fs.statSync(fileUrl + '/' + file);
                        if (stats.isDirectory()) {
                                this.emptyDir(fileUrl + '/' + file);
                        } else {
                                fs.unlinkSync(fileUrl + '/' + file);
                                console.log("删除文件" + fileUrl + '/' + file + "成功");
                        }
                });
        }

        uploadT1(req, res, upload){
                const T1Folder=`${__dirname}/Data/${req.user.username}/T1`;
                //clear T1 folder
                this.emptyDir(T1Folder);
                upload.fileHandler({
                        uploadDir: function () {
                                return T1Folder;
                        },
                        uploadUrl: function () {
                                return `/Data/${req.user.username}/T1`;
                        }
                })(req, res);
        }

        uploadT2(req, res, upload){
                const T2Folder=`${__dirname}/Data/${req.user.username}/T2`;
                //clear T2 folder
                this.emptyDir(T2Folder);
                upload.fileHandler({
                        uploadDir: function () {
                                return T2Folder;
                        },
                        uploadUrl: function () {
                                return `/Data/${req.user.username}/T2`;
                        }
                })(req, res);
        }

        uploadForm(req, res){
                const {username}=req.user;
                const {t1,t2,comment}=req.body;
                const isFlair=t2!=="";
                //get event count
                db.getCount('basicEvent',{username}, function (count) {
                        //console.log(count);
                        if(count._err){
                                console.error(count._err);
                                res.status(500);
                        }
                        const data={
                                number: count+1,
                                username,
                                status: 0,
                                isFlair,
                                comment
                        }
                        db.insert('basicEvent',data,function (result) {
                                if(result._err){
                                        console.error(result._err);
                                        res.status(500);
                                }
                                //const objectId=new ObjectID(result.insertedId);
                                //console.log(moment(objectId.getTimestamp()).format('YYMMDD-HHmmss'));
                                const objectId=result.insertedId.toString();

                                fs.mkdirSync(`${__dirname}/Data/${username}/${result.insertedId}`);
                                fs.renameSync(`${__dirname}/Data/${username}/T1/${t1}`, `${__dirname}/Data/${username}/${objectId}/dataF1.zip`);
                                if(isFlair)
                                        fs.renameSync(`${__dirname}/Data/${username}/T2/${t2}`, `${__dirname}/Data/${username}/${objectId}/dataF2.zip`);
                                let redisClient=redis.createClient(6379,'192.168.0.148');
                                const redisData=JSON.stringify({data:[objectId]});
                                console.log(redisData);
                                redisClient.LPUSH('BasicQueue', redisData);
                                redisClient.quit();
                                res.send({suc:true});
                        })

                })

        }
}

module.exports=BasicUploadAPI;
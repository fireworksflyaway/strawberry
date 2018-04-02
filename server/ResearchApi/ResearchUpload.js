/**
 * Created by Mason Jackson in Office on 3/1/18.
 */
const fs=require('fs');
const DAL=require('../db');
const moment=require('moment');
const ObjectID = require('mongodb').ObjectID;
const redis=require('redis');
const process=require('child_process');
const {EventStatus, EventType}=require('../definition');
const db=new DAL();
const config=JSON.parse(fs.readFileSync('./server/config.json', 'utf-8'));

class ResearchUploadAPI{
        emptyDir(fileUrl) {
                if(!fs.existsSync(fileUrl))
                        return;
                let files = fs.readdirSync(fileUrl);    //读取该文件夹
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
                const T1Folder=`${config.dataPath}/Research/${req.user.username}/T1`;
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
                const T2Folder=`${config.dataPath}/Research/${req.user.username}/T2`;
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

        uploadBatchFile(req, res, upload){
                const BatchFolder=`${config.dataPath}/Research/${req.user.username}/Batch`;
                this.emptyDir(BatchFolder);
                upload.fileHandler({
                        uploadDir: function () {
                                return BatchFolder;
                        },
                        uploadUrl: function () {
                                return `/Data/${req.user.username}/Batch`;
                        }
                })(req, res);
        }

        uploadSingleEvent(req, res){
                const {username}=req.user;
                const {t1,t2,comment}=req.body;
                const isFlair=t2!=="";
                //get event count
                db.getCount('ResearchEvent',{Username: username, IsBatch: false}, function (count) {
                        //console.log(count);
                        if(count._err){
                                console.error(count._err);
                                res.status(500);
                        }


                        const data={
                                Number: `BN-RS-S${count+100001}`,
                                Username: username,
                                Status: EventStatus.Waiting,
                                IsFlair : isFlair,
                                IsBatch: false
                        }
                        db.insert('ResearchEvent',data,function (result) {
                                if(result._err){
                                        console.error(result._err);
                                        res.status(500).send('0');
                                }
                                //const objectId=new ObjectID(result.insertedId);
                                //console.log(moment(objectId.getTimestamp()).format('YYMMDD-HHmmss'));
                                const objectId=result.insertedId.toString();
                                const targetPath=`${config.dataPath}/Research/${username}/${data.Number}`;

                                fs.mkdirSync(targetPath);

                                fs.renameSync(`${config.dataPath}/Research/${username}/T1/${t1}`, `${targetPath}/dataF1.zip`);
                                if(isFlair)
                                        fs.renameSync(`${config.dataPath}/Research/${username}/T2/${t2}`, `${targetPath}/dataF2.zip`);


                                const reportJson=JSON.stringify(
                                    {
                                            Comment: comment
                                    }
                                );
                                //create a report data json
                                fs.writeFileSync(`${targetPath}/report.json`, reportJson);

                                process.exec(`chmod -R 777 ${targetPath}`, function (err) {
                                        if(err)
                                        {
                                                console.log(err);
                                                res.status(500).send('20001'); //文件授权失败
                                        }
                                        else
                                        {
                                                let redisClient=redis.createClient(6379,config.redisHost);
                                                redisClient.auth(config.redisPwd);
                                                redisClient.on("error", function(error) {
                                                        console.log(error);
                                                        res.status(500).send('30001');  //Redis连接失败
                                                });

                                                //console.log(config.redisPwd);
                                                const redisData=JSON.stringify({Type: EventType.RS, Data:[objectId]});
                                                console.log(redisData);
                                                redisClient.LPUSH('EventQueue', redisData);
                                                redisClient.quit();
                                                res.send({suc:true});
                                        }
                                })


                        })

                })

        }

        uploadBatchEvent(req, res) {
                const {username}=req.user;
                const {filename}=req.body;
                const cmd=`mono ${config.cmdPath}/BatchProc.exe ${username} ${filename} ${config.dataPath}/Research/${username} ${config.mongoConn} ${config.redisHost} ${config.redisPwd} ${EventType.RS}`;
                //console.log(cmd);
                process.exec(cmd, function (err, stdout, stderr) {
                        if(err)
                                res.status(500);
                        else
                                res.send({suc:true});
                })
        }

}

module.exports=ResearchUploadAPI;
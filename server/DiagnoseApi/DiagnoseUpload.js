/**
 * Created by Mason Jackson in Office on 3/21/18.
 */
const fs=require('fs');
const DAL=require('../db');
const moment=require('moment');
const ObjectID = require('mongodb').ObjectID;
const redis=require('redis');
const process=require('child_process');
const {EventStatus, DiseaseType, EventType}=require('../definition');

const db=new DAL();
const config=JSON.parse(fs.readFileSync('./server/config.json', 'utf-8'));

module.exports={
        emptyDir:(fileUrl)=> {
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
        },

        uploadT1W:(req, res, upload)=>{
                const T1WFolder=`${config.dataPath}/Diagnose/${req.user.username}/T1W`;
                this.emptyDir(T1WFolder);
                upload.fileHandler({
                        uploadDir: function () {
                                return T1WFolder;
                        },
                        uploadUrl: function () {
                                return `/Data/${req.user.username}/T1W`;
                        }
                })(req, res);
        },


        upload2DT2:(req, res, upload)=>{
                const folder2DT2=`${config.dataPath}/Diagnose/${req.user.username}/2DT2`;
                this.emptyDir(folder2DT2);
                upload.fileHandler({
                        uploadDir: function () {
                                return folder2DT2;
                        },
                        uploadUrl: function () {
                                return `/Data/${req.user.username}/2DT2`;
                        }
                })(req, res);
        },

        upload3DT2:(req, res, upload)=>{
                const folder3DT2=`${config.dataPath}/Diagnose/${req.user.username}/3DT2`;
                this.emptyDir(folder3DT2);
                upload.fileHandler({
                        uploadDir: function () {
                                return folder3DT2;
                        },
                        uploadUrl: function () {
                                return `/Data/${req.user.username}/3DT2`;
                        }
                })(req, res);
        },

        uploadSWI:(req, res, upload)=>{
                const folderSWI=`${config.dataPath}/Diagnose/${req.user.username}/SWI`;
                this.emptyDir(folderSWI);
                upload.fileHandler({
                        uploadDir: function () {
                                return folderSWI;
                        },
                        uploadUrl: function () {
                                return `/Data/${req.user.username}/SWI`;
                        }
                })(req, res);
        },

        uploadDWI:(req, res, upload)=>{
                const folderDWI=`${config.dataPath}/Diagnose/${req.user.username}/DWI`;
                this.emptyDir(folderDWI);
                upload.fileHandler({
                        uploadDir: function () {
                                return folderDWI;
                        },
                        uploadUrl: function () {
                                return `/Data/${req.user.username}/DWI`;
                        }
                })(req, res);
        },
        

        uploadForm:(req, res)=>{
                const {username}=req.user;
                const {disease, comment, T1W, _2DT2, _3DT2, DWI, SWI}=req.body;

                //get event count
                db.getCount('DiagnoseEvent',{Username: username}, function (count) {
                        //console.log(count);
                        if(count._err){
                                console.error(count._err);
                                res.status(500);
                        }

                        const data={
                                Number: `BN-DG-S${count+100001}`,
                                Username: username,
                                Status: EventStatus.Waiting,
                                DsType: DiseaseType[disease],
                                Is2DT2: _2DT2!==undefined&&_2DT2!=='',
                                Is3DT2: _3DT2!==undefined&&_3DT2!=='',
                                IsDWI: DWI!==undefined&&DWI!=='',
                                IsSWI: SWI!==undefined&&SWI!=='',
                        }
                        db.insert('DiagnoseEvent',data,function (result) {
                                if(result._err){
                                        console.error(result._err);
                                        res.status(500).send('0');
                                }
                                //const objectId=new ObjectID(result.insertedId);
                                //console.log(moment(objectId.getTimestamp()).format('YYMMDD-HHmmss'));
                                const objectId=result.insertedId.toString();
                                const targetPath=`${config.dataPath}/Diagnose/${username}/${data.Number}`;

                                fs.mkdirSync(targetPath);
                                fs.renameSync(`${config.dataPath}/Diagnose/${username}/T1W/${T1W}`, `${targetPath}/T1W.zip`);
                                if(data.Is2DT2)
                                        fs.renameSync(`${config.dataPath}/Diagnose/${username}/2DT2/${_2DT2}`, `${targetPath}/2DT2.zip`);
                                if(data.Is3DT2)
                                        fs.renameSync(`${config.dataPath}/Diagnose/${username}/3DT2/${_3DT2}`, `${targetPath}/3DT2.zip`);
                                if(data.IsDWI)
                                        fs.renameSync(`${config.dataPath}/Diagnose/${username}/DWI/${DWI}`, `${targetPath}/DWI.zip`);
                                if(data.IsSWI)
                                        fs.renameSync(`${config.dataPath}/Diagnose/${username}/SWI/${SWI}`, `${targetPath}/SWI.zip`);
                                
                                const reportJson=JSON.stringify(
                                    {
                                            T1W,
                                            _2DT2,
                                            _3DT2,
                                            DWI,
                                            SWI,
                                            Diseases: DiseaseType[disease],
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
                                                const redisData=JSON.stringify({Type: EventType.DG, Data:[objectId]});
                                                console.log(redisData);
                                                redisClient.LPUSH('EventQueue', redisData);
                                                redisClient.quit();
                                                res.send({suc:true});
                                        }
                                })


                        })

                })

        },
        
}

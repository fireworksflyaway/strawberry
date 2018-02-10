/**
 * Created by Mason Jackson in Office on 2017/11/29.
 */
const express=require('express');
const bodyParser=require('body-parser');
const jwt=require('express-jwt');
const jsonwebtoken=require('jsonwebtoken');
const fs=require('fs');
const upload=require('jquery-file-upload-middleware');

const config=JSON.parse(fs.readFileSync('./server/config.json', 'utf-8'));

const PE_UserAPIClass=require('./PE_Api/PE_User');
const PE_UploadAPIClass=require('./PE_Api/PE_Upload');
const PE_EventAPIClass=require('./PE_Api/PE_Event');
const AdminAPIClass=require('./AdminApi/admin');
const PE_UserAPI=new PE_UserAPIClass();
const PE_UploadAPI=new PE_UploadAPIClass();
const PE_EventAPI=new PE_EventAPIClass();
const AdminAPI=new AdminAPIClass();

let app=express();

upload.configure({
        // uploadDir: __dirname+'/uploads',
        // uploadUrl: '/uploads',
        imageVersions: {
                thumbnail: {
                        width: 80,
                        height: 80
                }
        }
})




app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("X-Powered-By",' 3.2.1')
        res.header("Content-Type", "application/json;charset=utf-8");
        next();
});

app.get('/', function (req, res) {
        res.send('Hello Brainnow');
})

app.use('/PE_Auth', jwt({secret:config.accessKey}));   //6 hours


app.get('/PE_Auth/username', function (req, res) {
        //console.log(req.user);
        res.send({username: req.user.username});
})

app.get('/PE_Auth/getPE_profile', PE_UserAPI.getProfile);

app.post('/PE_Auth/updatePE_profile', PE_UserAPI.updateProfile);

app.post('/PE_Auth/updatePE_password', PE_UserAPI.updatePassword);

app.post('/PE_signin', PE_UserAPI.signIn);

app.post('/PE_signup', PE_UserAPI.signUp);

app.post('/PE_Auth/PE_uploadt1', function (req, res) {
        PE_UploadAPI.uploadT1(req, res, upload);
})

app.post('/PE_Auth/PE_uploadt2', function (req, res) {
        PE_UploadAPI.uploadT2(req, res, upload);
})

app.post('/PE_Auth/PE_uploadForm', PE_UploadAPI.uploadForm);

app.post('/PE_Auth/PE_uploadBatch', function (req, res) {
        PE_UploadAPI.uploadBatch(req, res, upload);
})

app.post('/PE_Auth/PE_uploadBatchForm', PE_UploadAPI.uploadBatchForm);

app.get('/PE_Auth/PE_getEvent', PE_EventAPI.getEvent);

app.get('/PE_Auth/PE_getReport', PE_EventAPI.getReport);




//admin
app.use('/AdminAuth', jwt({secret:config.adminAccessKey}));   //6 hours
app.post('/Adminsignin', AdminAPI.signIn);

app.get('/AdminAuth/username', function (req, res) {
        //console.log(req.user);
        res.send({username: req.user.username});
})

app.post('/AdminAuth/updateAdminpassword', AdminAPI.updatePassword)

app.get('/AdminAuth/getAdminProfile', AdminAPI.getProfile);

app.post('/AdminAuth/updateAdminProfile', AdminAPI.updateProfile);

app.get('/AdminAuth/getUserList', AdminAPI.getUserList);

app.post('/AdminAuth/certificate', AdminAPI.certificate);

const server=app.listen(8090, function () {
        let host = server.address().address;
        let port = server.address().port;
        console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
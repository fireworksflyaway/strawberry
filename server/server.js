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

const userAPIClass=require('./BasicApi/basicUser');
const basicUploadAPIClass=require('./BasicApi/basicUpload');
const basicEventAPIClass=require('./BasicApi/basicEvent');
const adminAPIClass=require('./AdminApi/admin');
const userAPI=new userAPIClass();
const basicUploadAPI=new basicUploadAPIClass();
const basicEventAPI=new basicEventAPIClass();
const adminAPI=new adminAPIClass();

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

app.use('/basicAuth', jwt({secret:config.accessKey}));   //6 hours


app.get('/basicAuth/username', function (req, res) {
        //console.log(req.user);
        res.send({username: req.user.username});
})

app.get('/basicAuth/getbasicprofile', userAPI.getProfile);

app.post('/basicAuth/updatebasicprofile', userAPI.updateProfile);

app.post('/basicAuth/updatebasicpassword', userAPI.updatePassword);

app.post('/basiclogin', userAPI.signIn);

app.post('/signup', userAPI.signUp);

app.post('/basicAuth/basicuploadt1', function (req, res) {
        basicUploadAPI.uploadT1(req, res, upload);
})

app.post('/basicAuth/basicuploadform', basicUploadAPI.uploadForm);

app.post('/basicAuth/basicuploadt2', function (req, res) {
        basicUploadAPI.uploadT2(req, res, upload);
})

app.post('/basicAuth/basicuploadbatch', function (req, res) {
        basicUploadAPI.uploadBatch(req, res, upload);
})

app.post('/basicAuth/basicuploadbatchform', basicUploadAPI.uploadBatchForm);

app.get('/basicAuth/getbasicevent', basicEventAPI.getEvent);

app.get('/basicAuth/getbasicreport', basicEventAPI.getReport);




//admin
app.use('/adminAuth', jwt({secret:config.adminAccessKey}));   //6 hours
app.post('/adminlogin', adminAPI.signIn);

app.get('/adminAuth/username', function (req, res) {
        //console.log(req.user);
        res.send({username: req.user.username});
})

app.post('/adminAuth/updateadminpassword', adminAPI.updatePassword)

app.get('/adminAuth/getadminprofile', adminAPI.getProfile);

app.post('/adminAuth/updateadminprofile', adminAPI.updateProfile);

app.get('/adminAuth/getuserlist', adminAPI.getUserList);

app.post('/adminAuth/certificate', adminAPI.certificate);

const server=app.listen(8090, function () {
        let host = server.address().address;
        let port = server.address().port;
        console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
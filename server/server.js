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
const userAPI=new userAPIClass();
const basicUploadAPI=new basicUploadAPIClass();
const basicEventAPI=new basicEventAPIClass();


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
        res.send('Hello World');
})

app.use('/auth', jwt({secret:config.accessKey}));


app.get('/auth/username', function (req, res) {
        //console.log(req.user);
        res.send({username: req.user.username});
})

app.get('/auth/getbasicprofile', userAPI.getProfile);

app.post('/auth/updatebasicprofile', userAPI.updateProfile);

app.post('/auth/updatebasicpassword', userAPI.updatePassword);

app.post('/login', userAPI.signIn);

app.post('/signup', userAPI.signUp);

app.post('/auth/basicuploadt1', function (req, res) {
        basicUploadAPI.uploadT1(req, res, upload);
})

app.post('/auth/basicuploadform', basicUploadAPI.uploadForm);

app.post('/auth/basicuploadt2', function (req, res) {
        basicUploadAPI.uploadT2(req, res, upload);
})

app.post('/auth/basicuploadbatch', function (req, res) {
        const BatchFolder=`${__dirname}/Data/${req.user.username}/Batch`
        //clear Batch folder
        emptyDir(BatchFolder);
        upload.fileHandler({
                uploadDir: function () {
                        return BatchFolder;
                },
                uploadUrl: function () {
                        return `/Data/${req.user.username}/Batch`;
                }
        })(req, res);
})

app.get('/auth/getbasicevent', basicEventAPI.getEvent);


const server=app.listen(8090, function () {
        let host = server.address().address;
        let port = server.address().port;
        console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
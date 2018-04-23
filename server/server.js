/**
 * Created by Mason Jackson in Office on 2017/11/29.
 */
const express=require('express');
const bodyParser=require('body-parser');
const jwt=require('express-jwt');
const upload=require('jquery-file-upload-middleware');

const CONFIG=require('./configuration');

const PE_EventAPI=require('./PE_Api/PE_Event');
const PE_UserAPI=require('./PE_Api/PE_User');
const PE_UploadAPI=require('./PE_Api/PE_Upload');
const ResearchUserAPI=require('./ResearchApi/ResearchUser');
const ResearchUploadAPI=require('./ResearchApi/ResearchUpload');
const ResearchEventAPI=require('./ResearchApi/ResearchEvent');
const DiagnoseUserAPI=require('./DiagnoseApi/DiagnoseUser');
const DiagnoseUploadAPI=require('./DiagnoseApi/DiagnoseUpload');
const DiagnoseEventAPI=require('./DiagnoseApi/DiagnoseEvent');
const AdminAPI=require('./AdminApi/admin');
const CommonAPI=require('./CommonApi');

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

app.use('/PE_Auth', jwt({secret:CONFIG.PE_ACCESS_KEY}));   //6 hours


app.get('/PE_Auth/username', function (req, res) {
        //console.log(req.user);
        res.send({username: req.user.username});
})

app.get('/PE_Auth/PE_profile', PE_UserAPI.getProfile);

app.post('/PE_Auth/UpdatePE_Profile', PE_UserAPI.updateProfile);

app.post('/PE_Auth/updatePE_password', PE_UserAPI.updatePassword);

app.post('/PE_SignIn', PE_UserAPI.signIn);

app.post('/PE_SignUp', PE_UserAPI.signUp);

app.post('/PE_Auth/PE_Dicom', function (req, res) {
        PE_UploadAPI.uploadDicom(req, res, upload);
})



app.post('/PE_Auth/PE_uploadForm', PE_UploadAPI.uploadForm);

app.post('/PE_Auth/PE_uploadBatch', function (req, res) {
        PE_UploadAPI.uploadBatch(req, res, upload);
})

app.post('/PE_Auth/PE_uploadBatchForm', PE_UploadAPI.uploadBatchForm);

app.get('/PE_Auth/PE_getEvent', PE_EventAPI.getEvent);

app.get('/PE_Auth/PE_getReport', PE_EventAPI.getReport);

//diagnose
app.use('/DiagnoseAuth', jwt({secret: CONFIG.DIAGNOSE_ACCESS_KEY}));

app.get('/DiagnoseAuth/username', function (req, res) {
        res.send({username: req.user.username});
})

app.get('/DiagnoseAuth/DiagnoseProfile', DiagnoseUserAPI.getProfile);

app.post('/DiagnoseAuth/UpdateDiagnoseProfile', DiagnoseUserAPI.updateProfile);

app.post('/DiagnoseAuth/updateDiagnosePassword', DiagnoseUserAPI.updatePassword);

app.post('/DiagnoseSignIn', DiagnoseUserAPI.signIn);

app.post('/DiagnoseSignUp', DiagnoseUserAPI.signUp);

app.post('/DiagnoseAuth/T1W', function (req, res) {
        DiagnoseUploadAPI.uploadT1W(req, res, upload);
});

app.post('/DiagnoseAuth/2DT2', function (req, res) {
        DiagnoseUploadAPI.upload2DT2(req, res, upload);
});

app.post('/DiagnoseAuth/3DT2', function (req, res) {
        DiagnoseUploadAPI.upload3DT2(req, res, upload);
});

app.post('/DiagnoseAuth/DWI', function (req, res) {
        DiagnoseUploadAPI.uploadDWI(req, res, upload);
});

app.post('/DiagnoseAuth/SWI', function (req, res) {
        DiagnoseUploadAPI.uploadSWI(req, res, upload);
});

app.post('/DiagnoseAuth/DiagnoseEvent', DiagnoseUploadAPI.uploadForm);

app.get('/DiagnoseAuth/DiagnoseEvents', DiagnoseEventAPI.getEvent);

app.get('/DiagnoseAuth/DiagnoseReport', DiagnoseEventAPI.getReport);

//research
app.use('/ResearchAuth', jwt({secret:CONFIG.RESEARCH_ACCESS_KEY}));   //6 hours

app.get('/ResearchAuth/username', function (req, res) {
        res.send({username: req.user.username});
})

app.get('/ResearchAuth/ResearchProfile', ResearchUserAPI.getProfile);

app.post('/ResearchAuth/UpdateResearchProfile', ResearchUserAPI.updateProfile);

app.post('/ResearchAuth/updateResearchPassword', ResearchUserAPI.updatePassword);

app.post('/ResearchSignIn', ResearchUserAPI.signIn);

app.post('/ResearchSignUp', ResearchUserAPI.signUp);

app.post('/ResearchAuth/ResearchT1', function (req, res) {
        ResearchUploadAPI.uploadDicom(req, res, upload);
})

app.post('/ResearchAuth/ResearchT2', function (req, res) {
        ResearchUploadAPI.uploadT2(req, res, upload);
})

app.post('/ResearchAuth/ResearchBatchFile', function (req, res) {
        ResearchUploadAPI.uploadBatchFile(req, res, upload);
})

app.post('/ResearchAuth/ResearchSingleEvent',ResearchUploadAPI.uploadSingleEvent);

app.post('/ResearchAuth/ResearchBatchEvent', ResearchUploadAPI.uploadBatchEvent);

app.get('/ResearchAuth/ResearchEvents', ResearchEventAPI.getEvent);

app.get('/ResearchAuth/ResearchReport', ResearchEventAPI.getReport);

//admin
app.use('/AdminAuth', jwt({secret:CONFIG.ADMIN_ACCESS_KEY}));   //6 hours
app.post('/AdminSignIn', AdminAPI.signIn);

app.get('/AdminAuth/username', function (req, res) {
        //console.log(req.user);
        res.send({username: req.user.username});
})

app.post('/AdminAuth/updateAdminpassword', AdminAPI.updatePassword)

app.get('/AdminAuth/getAdminProfile', AdminAPI.getProfile);

app.post('/AdminAuth/updateAdminProfile', AdminAPI.updateProfile);

app.get('/AdminAuth/getUserList', AdminAPI.getUserList);

app.post('/AdminAuth/certificate', AdminAPI.certificate);


//common
app.post('/ForgetPassword', CommonAPI.forgetPassword);

app.post('/ConfirmResetAuth', CommonAPI.confirmResetAuth);

app.post('/ResetPassword', CommonAPI.resetPassword);

const server=app.listen(8080,  function () {
        let host = server.address().address;
        let port = server.address().port;
        console.log("应用实例，访问地址为 http://%s:%s", host, port)
})


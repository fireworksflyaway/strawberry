/**
 * Created by Mason Jackson in Office on 1/19/18.
 */
const nodemailer = require('nodemailer');

module.exports={
        constructor(){
                this.transporter=nodemailer.createTransport({
                        host: 'smtp.ym.163.com',
                        port: 25, // SMTP 端口
                        secure: false,
                        auth: {
                                user: 'admin@brainnow.cn',
                                pass: 'droidCUHK'
                        }
                });
                this.sender='admin@brainnow.cn';
        },

        // var mailOptions = {
        //         to: '572050291@qq.com', // 发件地址
        //         from: 'admin@brainnow.cn', // 收件列表
        //         subject: 'Hello sir', // 标题
        //         //text和html两者只支持一种
        //         text: 'Hello world ?', // 标题
        //         html: '<b>Hello world ?</b>' // html 内容
        // };

        sendEmail(mailOption, callback){
                mailOption.from=this.sender;
                this.transporter.sendMail(mailOption, function(error, info){
                        callback(error, info);
                        // if(error){
                        //         return console.log(error);
                        // }
                        // console.log('Message sent: ' + info.response);

                });
        },
}

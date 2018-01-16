/**
 * Created by Mason Jackson in Office on 1/16/18.
 */
export default  function provideConfig() {
        return {
                '0':{
                        'zh':'未知错误'
                },
                //user
                '10000':{
                        'zh':'身份验证失败或登录超时，请重新登录'
                },
                '10001':{
                        'zh':'用户名不存在或密码错误'
                },
                '10002':{
                        'zh':'用户名已被注册'
                },
                '10003':{
                        'zh':'电子邮箱已被注册'
                },
                '10004':{
                        'zh':'当前密码错误'
                },

                //file
                '20001':{
                        'zh':'文件授权失败'
                },

                //Redis
                '30001':{
                        'zh':'Redis连接失败'
                },
        }
}
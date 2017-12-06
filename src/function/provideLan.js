/**
 * Created by Mason Jackson in Office on 2017/12/6.
 */
const lanObject={
        LogoutHeader: {
                zh:{
                        homepage:'首页',
                        about:'关于我们',
                        service:'服务介绍',
                        contact:'联系我们',
                        signup:'注册新用户',
                        signin:'登录'
                }
        }
}


export default function (file) {
        return lanObject[file];
}
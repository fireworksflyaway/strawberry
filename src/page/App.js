import React, { Component } from 'react';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';
import '../style/App.scss';

import HeaderInfo from "./Common/HeaderInfo";
import HomeContent from './Common/HomeContent';
import SignUpContent from './Common/SignUpContent';
import SignInContent from './Common/SignInContent';
import BasicProfile from './Basic/BasicProfile';
import BasicUpload from './Basic/BasicUpload';
import BasicEvent from './Basic/BasicEvent';
import BasicReport from "./Basic/BasicReport";
import AdminUserList from './Admin/AdminUserList';
import AdminSignIn from './Admin/AdminSignIn';
import AdminProfile from './Admin/AdminProfile';

import withLoginFunc from '../function/withLoginFunc';
//import withLogoutFunc from '../function/withLogoutFunc';
// import withLoginInfo from '../function/withLoginInfo';
import provideConfig from '../function/provideConfig';
import handleResponse from '../function/handleResponse';



const config=provideConfig();
const {Header, Content,  Footer} = Layout;



class App extends Component {
        constructor(props){
                super(props);
                this.state={
                        username:'unknown',
                        lan: 'zh',
                        loginType:'logout'
                }
        }

        componentWillMount(){
                const token=sessionStorage.getItem('StrawberryToken');
                const loginType=sessionStorage.getItem('StrawberryLoginType');
                if(loginType===undefined||loginType==='logout'||token===undefined)
                {
                        sessionStorage.removeItem('StrawberryToken');
                        this.setState({loginType:'logout'});
                        return;
                }
                let type='';
                switch (loginType){
                        case 'basic':
                        case 'admin': type=loginType;break;
                        default: {
                                sessionStorage.removeItem('StrawberryLoginType');
                                sessionStorage.removeItem('StrawberryToken');
                                this.setState({loginType:'logout'});
                                return;
                        }
                }


                fetch(`${config.server}/${type}Auth/username`, {
                        method:'get',
                        headers: {
                                'Authorization': 'Bearer ' + token
                        }
                })
                        .then(handleResponse)
                        .then((res)=>{
                                this.setState({
                                        loginType:type,
                                        username:res.username
                                })
                        })
                        .catch((err)=>{
                                console.error(err);
                                sessionStorage.removeItem('StrawberryLoginType');
                                sessionStorage.removeItem('StrawberryToken');
                                this.setState({loginType:'logout'});
                        });

        }

        handleLogin(user, type){
                console.log(type);
                this.setState({
                        loginType:type,
                        username:user
                })
        }

        handleLogout(){
                sessionStorage.removeItem('StrawberryToken');
                this.setState({
                        loginType:'logout',
                        username:'unknown'
                })
        }

        render(){
                //console.log(this.state.loginType);
                return(
                        <div>
                                <BrowserRouter>
                                        <Layout>
                                                <Header className='appHeader'>
                                                        <HeaderInfo loginType={this.state.loginType} username={this.state.username} handleLogout={this.handleLogout.bind(this)}/>
                                                </Header>
                                                <Content className='appContent' >
                                                        <Switch>
                                                                <Route path='/adminsignin' component={AdminSignIn}/>
                                                                <Route path='/adminprofile' component={AdminProfile}/>
                                                                <Route path='/adminuserlist' component={AdminUserList}/>
                                                                <Route path='/basicreport' component={BasicReport}/>
                                                                <Route path='/basicprofile' component={BasicProfile}/>
                                                                <Route path='/basicupload' component={BasicUpload} />
                                                                <Route path='/basicevent' component={BasicEvent} />
                                                                <Route path='/signup' component={withLoginFunc(SignUpContent, this.handleLogin.bind(this))}/>
                                                                <Route path='/signin' component={withLoginFunc(SignInContent, this.handleLogin.bind(this))}/>
                                                                <Route component={HomeContent} />
                                                        </Switch>
                                                </Content>
                                                <Footer className='appFooter'>Copyright © Brainnow {new Date().getFullYear()} Version 0.0.4 All rights reserved.</Footer>
                                        </Layout>
                                </BrowserRouter>
                        </div>
                );
        }
}

export default App;

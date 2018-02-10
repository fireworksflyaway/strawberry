import React, { Component } from 'react';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';
import '../style/App.scss';

import HeaderInfo from "./Common/HeaderInfo";
import HomeContent from './Common/HomeContent';
import SignUpContent from './Common/SignUpContent';
import SignInContent from './Common/SignInContent';
import BasicProfile from './PE/PE_Profile';
import PE_Upload from './PE/PE_Upload';
import BasicEvent from './PE/PE_Event';
import BasicReport from "./PE/PE_Report";
import DiagnoseUpload from './Diagnose/DiagnoseUpload';
import DiagnoseReport from './Diagnose/DiagnoseReport';
import DiagnoseEvent from './Diagnose/DiagnoseEvent';
import AdminUserList from './Admin/AdminUserList';
import AdminSignIn from './Admin/AdminSignIn';
import AdminProfile from './Admin/AdminProfile';

//import withLoginFunc from '../function/withLoginFunc';
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
                        case 'Diagnose':
                        case 'PE_':
                        case 'Admin': type=loginType;break;
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
                                                                <Route path='/PE_Report' component={BasicReport}/>
                                                                <Route path='/PE_Profile' component={BasicProfile}/>
                                                                <Route path='/PE_Upload' component={PE_Upload} />
                                                                <Route path='/PE_Event' component={BasicEvent} />
                                                                <Route path='/diagnoseupload' component={DiagnoseUpload} />
                                                                <Route path='/diagnoseevent' component={DiagnoseEvent} />
                                                                <Route path='/diagnosereport' component={DiagnoseReport} />
                                                                <Route path='/signup' component={SignUpContent}/>
                                                                <Route path='/signin' component={SignInContent}/>
                                                                <Route component={HomeContent} />
                                                        </Switch>
                                                </Content>
                                                <Footer className='appFooter'>Copyright © Brainnow {new Date().getFullYear()} Version 0.1.0 All rights reserved.</Footer>
                                        </Layout>
                                </BrowserRouter>
                        </div>
                );
        }
}

export default App;

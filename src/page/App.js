import React, { Component } from 'react';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';
import '../style/App.scss';

import HeaderInfo from "./Common/HeaderInfo";
import HomeContent from './Common/HomeContent';
import SignUpContent from './Common/SignUpContent';
import SignInContent from './Common/SignInContent';
import Profile from './Common/Profile';
import PE_Upload from './PE/PE_Upload';
import PE_Event from './PE/PE_Event';
import PE_Report from "./PE/PE_Report";
import DiagnoseUpload from './Diagnose/DiagnoseUpload';
import DiagnoseReport from './Diagnose/DiagnoseReport';
import DiagnoseEvent from './Diagnose/DiagnoseEvent';
import ResearchUpload from './Research/ResearchUpload';
import ResearchEvent from './Research/ResearchEvent';
import ResearchReport from './Research/ResearchReport';
import AdminUserList from './Admin/AdminUserList';
import AdminSignIn from './Admin/AdminSignIn';
import AdminProfile from './Admin/AdminProfile';
import ResetPassword from "./Common/ResetPassword";
import config from '../config';
import withLoginType from '../function/withLoginType';
import handleResponse from '../function/handleResponse';




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
                        case 'Research':
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
                                        <Layout className='appLayout'>
                                                <Header className='appHeader'>
                                                        <HeaderInfo loginType={this.state.loginType} username={this.state.username} handleLogout={this.handleLogout.bind(this)}/>
                                                </Header>
                                                <Content className='appContent' >
                                                        <Switch>
                                                                <Route path='/AdminSignIn' component={AdminSignIn}/>
                                                                <Route path='/AdminProfile' component={AdminProfile}/>
                                                                <Route path='/AdminUserList' component={AdminUserList}/>
                                                                <Route path='/PE_Report' component={PE_Report}/>
                                                                <Route path='/PE_Upload' component={PE_Upload} />
                                                                <Route path='/PE_Event' component={PE_Event} />
                                                                <Route path='/DiagnoseUpload' component={DiagnoseUpload} />
                                                                <Route path='/DiagnoseEvent' component={DiagnoseEvent} />
                                                                <Route path='/DiagnoseReport' component={DiagnoseReport} />
                                                                <Route path='/ResearchUpload' component={ResearchUpload} />
                                                                <Route path='/ResearchEvent' component={ResearchEvent} />
                                                                <Route path='/ResearchReport' component={ResearchReport} />
                                                                <Route path='/SignUp' component={SignUpContent}/>
                                                                <Route path='/SignIn' component={SignInContent}/>
                                                                <Route path='/Profile' component={withLoginType(Profile, this.state.loginType)} />
                                                                <Route path='/ResetPassword' component={ResetPassword} />
                                                                <Route component={HomeContent} />
                                                        </Switch>
                                                </Content>
                                                <Footer className='appFooter'>Copyright © Brainnow {new Date().getFullYear()} Version 0.1.3 dev 2. All rights reserved.</Footer>
                                        </Layout>
                                </BrowserRouter>
                        </div>
                );
        }
}

export default App;

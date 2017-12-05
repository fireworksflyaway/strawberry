import React, { Component } from 'react';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';
import '../style/App.scss';
import HeaderInfo from "./HeaderInfo";
import HomeContent from './HomeContent';
import SignUpContent from './SignUpContent';
import SignInContent from './SignInContent';
import withLogin from '../function/withLogin';
const {Header, Content,  Footer} = Layout;

class App extends Component {
        constructor(props){
                super(props);
                this.state={
                        isLogin:false,
                        username:'unknown'
                }
        }

        componentWillMount(){
                const token=sessionStorage.getItem('StrawberryToken');
                if(token){
                        fetch('http://localhost:8090/auth/username', {
                                method:'get',
                                headers: {
                                        'Authorization': 'Bearer ' + token
                                }
                        })
                                .then(res=>res.json())
                                .then((res)=>{
                                        this.setState({
                                                isLogin:true,
                                                username:res.username
                                        })
                                })
                                .catch((err)=>console.error(err));
                }
        }

        handleLogin(user){
                this.setState({
                        isLogin:true,
                        username:user
                })
        }

        handleLogout(){
                sessionStorage.removeItem('StrawberryToken');
                this.setState({
                        isLogin:false,
                        username:'unknown'
                })
        }

        render(){
                return(
                        <div>
                                <BrowserRouter>
                                        <Layout>
                                                <Header className='appHeader'>
                                                        <HeaderInfo isLogin={this.state.isLogin} username={this.state.username} handleLogout={this.handleLogout.bind(this)}/>
                                                </Header>
                                                <Content className='appContent' >
                                                        <Switch>
                                                                <Route path='/signup' component={withLogin(SignUpContent, this.handleLogin.bind(this))}/>
                                                                <Route path='/signin' component={withLogin(SignInContent, this.handleLogin.bind(this))}/>
                                                                <Route component={HomeContent} />
                                                        </Switch>
                                                </Content>
                                                <Footer className='appFooter'>Copyright © Brainnow {new Date().getFullYear()} All right reserved.</Footer>
                                        </Layout>
                                </BrowserRouter>
                        </div>
                );
        }
}

export default App;

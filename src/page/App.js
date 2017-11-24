import React, { Component } from 'react';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';
import '../style/App.scss';
import HeaderInfo from "./HeaderInfo";
import HomeContent from './HomeContent';
import SignUpContent from './SignUpContent';
const {Header, Content,  Footer} = Layout;

class App extends Component {
        render(){
                return(
                        <div>
                                <BrowserRouter>
                                        <Layout>
                                                <Header className='appHeader'>
                                                        <HeaderInfo/>
                                                </Header>
                                                <Content className='appContent' >
                                                        <Switch>
                                                                <Route path='/signup' component={SignUpContent}/>
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

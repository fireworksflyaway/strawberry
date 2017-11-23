import React, { Component } from 'react';

import {BrowserRouter, Link} from 'react-router-dom';
import {Layout} from 'antd';
import '../style/App.scss';
import HeaderInfo from "./HeaderInfo";

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
                                                        Content
                                                </Content>
                                                <Footer>Footer</Footer>
                                        </Layout>
                                </BrowserRouter>
                        </div>
                );
        }
}

export default App;

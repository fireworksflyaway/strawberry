import React, { Component } from 'react';
import logo from '../image/logo.svg';
import {BrowserRouter, Link} from 'react-router-dom';
import {Layout} from 'antd';
import '../style/App.scss';


const {Header, Content,  Footer} = Layout;

class App extends Component {
        render(){
                return(
                        <div>
                                <BrowserRouter>
                                        <Layout>
                                                <Header className='appHeader'>
                                                        <Link to='/'><img src={logo} alt="Brainnow"  className='logoImg'/></Link>
                                                </Header>
                                                <Content>
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

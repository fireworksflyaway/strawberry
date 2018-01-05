/**
 * Created by Mason Jackson in Office on 2017/12/5.
 */
import React from 'react';
import { Menu,  Button } from 'antd';
import {Link} from 'react-router-dom';
export default class LogoutHeader extends React.Component{
        constructor(props){
                super(props);
                this.state={
                        headerKeys:['1']
                }
        }



        componentWillMount(){
                const path=window.location.href.split('//')[1].split('/')[1];
                let selectedKey;
                switch (path)
                {
                        case 'signup': selectedKey='5'; break;
                        case 'signin': selectedKey='6';break;
                        default: selectedKey='1';
                }
                if(selectedKey)
                        this.setState({headerKeys: [selectedKey]});
        }

        render(){
                return (
                        <Menu
                                className='headerMenu'
                                mode="horizontal"
                                defaultSelectedKeys={this.state.headerKeys}
                        >
                                <Menu.Item key="1"><Link to='/'>首页</Link></Menu.Item>
                                <Menu.Item key="2"><Link to='/'>关于我们</Link></Menu.Item>
                                <Menu.Item key="3"><Link to='/'>服务介绍</Link></Menu.Item>
                                <Menu.Item key="4"><Link to='/'>联系我们</Link></Menu.Item>
                                <Menu.Item key="5"><Link to='/signup'>注册新用户</Link></Menu.Item>
                                <Menu.Item key="6"><Link to='/signin'>登录</Link></Menu.Item>
                                <Button style={{marginLeft:'40px'}}>EN</Button>
                        </Menu>
                )
        }
}
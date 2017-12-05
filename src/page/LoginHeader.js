/**
 * Created by Mason Jackson in Office on 2017/12/5.
 */
import React from 'react';
import { Menu,  Button } from 'antd';
import {Link} from 'react-router-dom';
export default class LoginHeader extends React.Component{
        render(){
                return (
                        <Menu
                                className='headerMenu'
                                mode="horizontal"
                                defaultSelectedKeys={['1']}
                        >
                                <Menu.Item key="1"><Link to='/'>首页</Link></Menu.Item>
                                <Menu.Item key="2"><Link to='/'>上传数据</Link></Menu.Item>
                                <Menu.Item key="3"><Link to='/'>查看任务进度</Link></Menu.Item>
                                <Menu.Item key="4"><Link to='/'>查看报告</Link></Menu.Item>
                                <Menu.Item key="5"><Link to='/'>{this.props.username}</Link></Menu.Item>
                                <Menu.Item key="6"><Link to='/'>注销</Link></Menu.Item>
                                <Button style={{marginLeft:'40px'}}>EN</Button>
                        </Menu>
                )
        }
}
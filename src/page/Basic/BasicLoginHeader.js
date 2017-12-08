/**
 * Created by Mason Jackson in Office on 2017/12/5.
 */
import React from 'react';
import { Menu,  Button , Icon} from 'antd';
import {Link} from 'react-router-dom';
export default class BasicLoginHeader extends React.Component{
        render(){
                return (
                        <Menu
                                className='headerMenu'
                                mode="horizontal"
                                defaultSelectedKeys={['1']}
                        >
                                <Menu.Item key="1"><Link to='/'>首页</Link></Menu.Item>
                                <Menu.Item key="2"><Link to='/basicupload'>上传数据</Link></Menu.Item>
                                <Menu.Item key="3"><Link to='/basicevent'>查看任务进度</Link></Menu.Item>
                                <Menu.Item key="4"><Link to='/'>查看报告</Link></Menu.Item>
                                <Menu.SubMenu title={<strong><Icon type="user" />{this.props.username}</strong>}>
                                        <Menu.Item key="user:1"><Link to='/basicprofile'>编辑个人信息</Link></Menu.Item>
                                        <Menu.Item key="user:2"><Link to='/' onClick={this.props.handleLogout}>注销</Link></Menu.Item>
                                </Menu.SubMenu>
                                <Button style={{marginLeft:'40px'}}>EN</Button>
                        </Menu>
                )
        }
}
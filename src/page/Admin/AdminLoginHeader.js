/**
 * Created by Mason Jackson in Office on 1/16/18.
 */
import React from 'react';
import { Menu,  Button , Icon} from 'antd';
import {Link} from 'react-router-dom';
export default class AdminLoginHeader extends React.Component{


        render(){
                return (
                    <Menu
                        className='headerMenu'
                        mode="horizontal"
                        defaultSelectedKeys={[this.props.selectKey]}
                    >
                            <Menu.Item key="/"><Link to='/' >首页</Link></Menu.Item>
                            <Menu.Item key="/adminuserlist"><Link to='/adminuserlist'>用户列表</Link></Menu.Item>
                            <Menu.Item key="/admincontrolpanel"><Link to='/admincontrolpanel'>任务控制台</Link></Menu.Item>
                            <Menu.SubMenu title={<strong><Icon type="team" />{this.props.username}</strong>}>
                                    <Menu.Item key="/adminprofile"><Link to='/adminprofile' ><Icon type="edit" />编辑个人信息</Link></Menu.Item>
                                    <Menu.Item key="user:2"><Link to='/' onClick={this.props.handleLogout}><Icon type="logout"/>注销</Link></Menu.Item>
                            </Menu.SubMenu>
                            <Button style={{marginLeft:'40px'}}>EN</Button>
                    </Menu>
                )
        }
}
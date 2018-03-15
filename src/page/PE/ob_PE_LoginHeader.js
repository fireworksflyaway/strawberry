/**
 * Created by Mason Jackson in Office on 2017/12/5.
 */
import React from 'react';
import { Menu,  Button , Icon} from 'antd';
import {Link} from 'react-router-dom';
export default class PE_LoginHeader extends React.Component{


        render(){
                return (
                        <Menu
                                className='headerMenu'
                                mode="horizontal"
                                defaultSelectedKeys={[this.props.selectKey]}
                        >
                                <Menu.Item key="/"><Link to='/' >首页</Link></Menu.Item>
                                <Menu.Item key="/PE_Upload"><Link to='/PE_Upload'>上传数据</Link></Menu.Item>
                                <Menu.Item key="/PE_Event"><Link to='/PE_Event'>查看任务进度</Link></Menu.Item>
                                <Menu.Item key="/PE_Report"><Link to='/PE_Report' >查看报告</Link></Menu.Item>
                                <Menu.SubMenu title={<strong><Icon type="user" />{this.props.username}</strong>}>
                                        <Menu.Item key="/PE_Profile"><Link to='/PE_Profile' ><Icon type="edit" />编辑个人信息</Link></Menu.Item>
                                        <Menu.Item key="user:2"><Link to='/' onClick={this.props.handleLogout}><Icon type="logout"/>注销</Link></Menu.Item>
                                </Menu.SubMenu>
                                <Button style={{marginLeft:'40px'}}>EN</Button>
                        </Menu>
                )
        }
}
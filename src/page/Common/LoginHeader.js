/**
 * Created by Mason Jackson in Office on 1/31/18.
 */
import React from 'react';
import { Menu,  Button , Icon} from 'antd';
import {Link} from 'react-router-dom';
export default class LoginHeader extends React.Component{
        render(){
                console.log(this.props.selectKey);
                return (
                    <Menu
                        className='headerMenu'
                        mode="horizontal"
                        defaultSelectedKeys={[this.props.selectKey]}
                    >
                            <Menu.Item key="/"><Link to='/' >首页</Link></Menu.Item>
                            <Menu.Item key={`/${this.props.type}Upload`}><Link to={`/${this.props.type}Upload`}>上传数据</Link></Menu.Item>
                            <Menu.Item key={`/${this.props.type}Event`}><Link to={`/${this.props.type}Event`}>查看任务进度</Link></Menu.Item>
                            <Menu.Item key={`/${this.props.type}Report`}><Link to={`/${this.props.type}Report`} >查看报告</Link></Menu.Item>
                            <Menu.SubMenu title={<strong><Icon type="user" />{this.props.username}</strong>}>
                                    <Menu.Item key={`${this.props.type}Profile`}><Link to={`/Profile`} ><Icon type="edit" />编辑个人信息</Link></Menu.Item>
                                    <Menu.Item key="user:2"><Link to='/' onClick={this.props.handleLogout}><Icon type="logout"/>注销</Link></Menu.Item>
                            </Menu.SubMenu>
                            <Button style={{marginLeft:'40px'}}>EN</Button>
                    </Menu>
                )
        }
}
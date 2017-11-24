/**
 * Created by Mason Jackson in Office on 2017/11/22.
 */
import React from 'react';
import {Link} from 'react-router-dom';

import logo from '../image/logo.svg';

import { Menu, Icon, Button } from 'antd';
import '../style/HeaderInfo.scss';



const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class HeaderInfo extends React.Component{
        constructor(){
                super();
        }

        render(){
                return(
                        <div className='headerInfoDiv'>
                                <div style={{height:60}}>
                                        <Link to='/'><img src={logo} alt="Brainnow"  className='logoImg'/></Link>
                                </div>

                                <Menu
                                        className='headerMenu'
                                        mode="horizontal"
                                        defaultSelectedKeys={['1']}
                                >
                                        <Menu.Item key="1"><Link to='/'>首页</Link></Menu.Item>
                                        <Menu.Item key="2"><Link to='/'>关于我们</Link></Menu.Item>
                                        <Menu.Item key="3"><Link to='/'>服务介绍</Link></Menu.Item>
                                        <Menu.Item key="4"><Link to='/'>联系我们</Link></Menu.Item>
                                        <Menu.Item key="5"><Link to='/signup'>注册新用户</Link></Menu.Item>
                                        <Menu.Item key="6"><Link to='/signin'>登录</Link></Menu.Item>
                                        <Button style={{marginLeft:'40px'}}>EN</Button>
                                </Menu>

                        </div>
                )
        }
}
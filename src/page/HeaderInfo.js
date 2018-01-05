/**
 * Created by Mason Jackson in Office on 2017/11/22.
 */
import React from 'react';
import {Link} from 'react-router-dom';

import logo from '../image/logo.svg';


import '../style/HeaderInfo.scss';
import LogoutHeader from "./LogoutHeader";
import BasicLoginHeader from './Basic/BasicLoginHeader';


export default class HeaderInfo extends React.Component{

        render(){
                let menuComponent;
                if(this.props.isLogin)
                        menuComponent=<BasicLoginHeader username={this.props.username} handleLogout={this.props.handleLogout}/>;
                else
                        menuComponent=<LogoutHeader />;
                return(
                        <div className='headerInfoDiv'>
                                <div style={{height:60}}>
                                        <Link to='/' ><img src={logo} alt="Brainnow"  className='logoImg'/></Link>
                                </div>
                                {menuComponent}
                        </div>
                )
        }
}
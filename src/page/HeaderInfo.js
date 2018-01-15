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
        constructor(props){
                super(props);
                this.state={
                        selectKey:'/'
                }
        }

        handleRedirect(e, key){
                this.setState({selectKey:key});
        }

        componentWillMount(){
                console.log(window.location.pathname);
                const path=window.location.pathname;
                this.setState({selectKey:path});
        }

        render(){
                let menuComponent;
                if(this.props.isLogin)
                        menuComponent=<BasicLoginHeader username={this.props.username} handleLogout={this.props.handleLogout} selectKey={this.state.selectKey} />;
                else
                        menuComponent=<LogoutHeader selectKey={this.state.selectKey} />;

                return(
                        <div className='headerInfoDiv'>
                                <div style={{height:60}}>
                                        <Link to='/' onClick={(e)=>{this.handleRedirect('/').bind(this);}}><img src={logo} alt="Brainnow"  className='logoImg'/></Link>
                                </div>
                                {menuComponent}
                        </div>
                )
        }
}
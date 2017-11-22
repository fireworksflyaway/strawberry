/**
 * Created by Mason Jackson in Office on 2017/11/22.
 */
import React from 'react';
import {Link} from 'react-router-dom';

import logo from '../image/logo.svg';
export default class HeaderInfo extends React.Component{
        constructor(){
                super();
        }

        render(){
                return(
                        <div>
                                <Link to='/'><img src={logo} alt="Brainnow"  className='logoImg'/></Link>
                        </div>
                )
        }
}
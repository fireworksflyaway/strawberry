/**
 * Created by Mason Jackson in Office on 1/19/18.
 */
import React from 'react';
import {Card} from 'antd';

import SignInForm from '../Common/SignInForm';
import '../../style/SignInContent.scss';
export default class AdminSignIn extends React.Component{

        render(){
                return(
                    <article>
                            <Card title="管理员登录" className='signInCard'>
                                <SignInForm type='admin' />
                            </Card>
                    </article>
                )
        }
}
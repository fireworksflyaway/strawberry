/**
 * Created by Mason Jackson in Office on 2017/11/25.
 */
import React from 'react';
import {Card, Tabs} from 'antd';

import '../../style/SignInContent.scss';

import SignInForm from './SignInForm';

const TabPane = Tabs.TabPane;
class SignInContent extends React.Component {
        render(){

                return(
                        <article>
                                <Card title="登录" className='signInCard'>
                                        <Tabs defaultActiveKey="1">
                                                <TabPane tab="体检用户" key="1"><SignInForm  type='PE_' /> </TabPane>
                                                <TabPane tab="诊断用户" key="2"><SignInForm  type='Diagnose' /></TabPane>
                                                <TabPane tab="科研用户" key="3"><SignInForm  type='Research' /></TabPane>
                                        </Tabs>
                                </Card>
                        </article>
                )
        }

}

export default SignInContent;
/**
 * Created by Mason Jackson in Office on 2017/11/24.
 */
import React from 'react';
import {Card, Tabs} from 'antd';

import '../../style/SignUpContent.scss';
import SignUpForm from '../Common/SignUpForm';
//import PE_SignUpForm from '../PE/PE_SignUpForm';

const TabPane = Tabs.TabPane;
class SignUpContent extends React.Component {
        render(){
                return(
                        <article>
                                <Card title="注册新用户" className='signUpCard'>
                                        <Tabs defaultActiveKey="1">
                                                <TabPane tab="体检用户" key="1"><SignUpForm type='PE_' /></TabPane>
                                                <TabPane tab="诊断用户" key="2"><SignUpForm type='Diagnose' /></TabPane>
                                                <TabPane tab="科研用户" key="3"><SignUpForm type='Research' /></TabPane>
                                        </Tabs>
                                </Card>
                        </article>
                )
        }
}

export default SignUpContent;
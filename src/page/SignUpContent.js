/**
 * Created by Mason Jackson in Office on 2017/11/24.
 */
import React from 'react';
import {Card, Tabs} from 'antd';

import '../style/SignUpContent.scss';

import BasicSignUpForm from './Basic/BasicSignUpForm';

const TabPane = Tabs.TabPane;
class SignUpContent extends React.Component {
        constructor(){
                super();
        }

        render(){
                return(
                        <article>
                                <Card title="注册新用户" className='signUpCard'>
                                        <Tabs defaultActiveKey="1">
                                                <TabPane tab="体检用户" key="1"> <BasicSignUpForm/></TabPane>
                                                <TabPane tab="诊断用户" key="2">敬请期待</TabPane>
                                                <TabPane tab="科研用户" key="3">敬请期待</TabPane>
                                        </Tabs>
                                </Card>
                        </article>
                )
        }
}

export default SignUpContent;
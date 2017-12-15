/**
 * Created by Mason Jackson in Office on 2017/11/25.
 */
import React from 'react';
import {Card, Tabs} from 'antd';

import '../style/SignInContent.scss';

import BasicSignInForm from './Basic/BasicSignInForm';

const TabPane = Tabs.TabPane;
class SignInContent extends React.Component {
        render(){

                return(
                        <article>
                                <Card title="登录" className='signInCard'>
                                        <Tabs defaultActiveKey="1">
                                                <TabPane tab="体检用户" key="1"><BasicSignInForm handleLogin={this.props.handleLogin}/> </TabPane>
                                                <TabPane tab="诊断用户" key="2">敬请期待</TabPane>
                                                <TabPane tab="科研用户" key="3">敬请期待</TabPane>
                                        </Tabs>
                                </Card>
                        </article>
                )
        }

}

export default SignInContent;
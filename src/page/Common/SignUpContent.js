/**
 * Created by Mason Jackson in Office on 2017/11/24.
 */
import React from 'react';
import {Card, Tabs, Modal} from 'antd';

import '../../style/SignUpContent.scss';
import SignUpForm from '../Common/SignUpForm';


const TabPane = Tabs.TabPane;
class SignUpContent extends React.Component {

        showConfirm(){
                Modal.confirm({
                        title: `博脑医疗用户注册协议和隐私政策`,
                        content: <p>something...<br />something...</p>,
                        okText: `同意并继续`,
                        cancelText: `取消`,
                        width: 800,
                        iconType: 'tags',
                        onCancel(){
                                window.location.href='/';
                        }

                })
        }


        render(){
                this.showConfirm();
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
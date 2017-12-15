/**
 * Created by Mason Jackson in Office on 2017/12/5.
 */
import React from 'react';
import {Card, Tabs} from 'antd';
import BasicProfileInfoForm from './BasicProfileInfoForm';
import BasicProfilePasswordForm from './BasicProfilePasswordForm';
import '../../style/Profile.scss'

const TabPane = Tabs.TabPane;
export default class BasicProfile extends React.Component{
        render(){
                return (
                        <article>
                                <Card title="编辑个人信息" className="profileCard">
                                        <Tabs defaultActiveKey="1">
                                                <TabPane tab="编辑基本信息" key="1"><BasicProfileInfoForm /></TabPane>
                                                <TabPane tab="修改密码" key="2"><BasicProfilePasswordForm/></TabPane>
                                        </Tabs>
                                </Card>
                        </article>
                )
        }
}
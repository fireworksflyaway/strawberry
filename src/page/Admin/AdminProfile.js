/**
 * Created by Mason Jackson in Office on 1/19/18.
 */
import React from 'react';
import {Card, Tabs} from 'antd';
import AdminProfileEmailForm from "./AdminProfileEmailForm";
import ChangePasswordForm from "../Common/ChangePasswordForm";
import '../../style/Profile.scss'


const TabPane = Tabs.TabPane;
export default class AdminProfile extends React.Component{
        componentWillMount(){
                const token=sessionStorage.getItem('StrawberryToken');
                if(!token)
                {
                        window.location.href="/";
                        return;
                }

        }
        render(){
                return (
                    <article>
                            <Card title="编辑管理员信息" className="profileCard">
                                    <Tabs defaultActiveKey="1">
                                            <TabPane tab="修改管理员邮箱" key="1"><AdminProfileEmailForm /></TabPane>
                                            <TabPane tab="修改密码" key="2"><ChangePasswordForm type='admin'/></TabPane>
                                    </Tabs>
                            </Card>
                    </article>
                )
        }
}


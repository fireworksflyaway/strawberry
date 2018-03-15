/**
 * Created by Mason Jackson in Office on 2/28/18.
 */
import React from 'react';
import {Card, Tabs} from 'antd';
import ProfileInfoForm from './ProfileInfoForm';
import ChangePasswordForm from './ChangePasswordForm';
import '../../style/Profile.scss'

const TabPane = Tabs.TabPane;
export default class Profile extends React.Component{
        componentWillMount(){
                const token=sessionStorage.getItem('StrawberryToken');
                if(!token)
                {
                        window.location.href="/";
                        return;
                }

        }
        render(){
                let zhType="";
                switch (this.props.type){
                        case 'PE_':zhType='体检版';break;
                        case 'Diagnose': zhType='诊断版';break;
                        case 'Research': zhType='科研版'; break;
                        default: zhType='';break;
                }
                return (
                    <article>
                            <Card title={`${zhType}编辑个人信息`} className="profileCard">
                                    <Tabs defaultActiveKey="1">
                                            <TabPane tab="编辑基本信息" key="1"><ProfileInfoForm type={this.props.type} /></TabPane>
                                            <TabPane tab="修改密码" key="2"><ChangePasswordForm type={this.props.type} /></TabPane>
                                    </Tabs>
                            </Card>
                    </article>
                )
        }
}
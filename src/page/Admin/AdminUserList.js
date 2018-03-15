/**
 * Created by Mason Jackson in Office on 1/16/18.
 */
import React from 'react';
import {Card, Tabs} from 'antd';
import AdminUserListTable from './AdminUserListTable';
const TabPane = Tabs.TabPane;


export default class AdminUserList extends React.Component{
        render(){
                return (
                        <article style={{minHeight:'600px'}}>
                            <Card title="查看用户列表" style={{width: '1200px', margin:'150px auto'}}>
                                    <Tabs>
                                            <TabPane tab="体检用户" key="1"><AdminUserListTable type='PE_' /></TabPane>
                                            <TabPane tab="诊断用户" key="2"><AdminUserListTable type='Diagnose' /></TabPane>
                                            <TabPane tab="科研用户" key="3"><AdminUserListTable type='Research' /></TabPane>
                                    </Tabs>
                            </Card>
                        </article>
                );
        }
}
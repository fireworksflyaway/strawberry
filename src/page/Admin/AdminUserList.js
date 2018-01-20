/**
 * Created by Mason Jackson in Office on 1/16/18.
 */
import React from 'react';
import {Card, Table,  Modal, Button} from 'antd';
import handleResponse from "../../function/handleResponse";
import provideConfig from "../../function/provideConfig";
import provideErrorInfo from '../../function/provideErrorInfo';
const errorInfo=provideErrorInfo();
const config=provideConfig();
const lan='zh';


export default class AdminUserList extends React.Component{
        constructor(props){
                super(props);
                this.state={
                        data:[]
                }
        }

        componentWillMount(){
                const token=sessionStorage.getItem('StrawberryToken');
                fetch(`${config.server}/adminAuth/getuserlist`,{
                        method: 'get',
                        headers: {
                                'Authorization': 'Bearer ' + token,
                        },
                })
                    .then(handleResponse)
                    .then((res)=>{
                            this.setState({
                                    data: res
                            })
                    })
                    .catch((err)=>{
                            console.error(err);
                            Modal.error({
                                    content:errorInfo[err][lan],
                                    onOk:()=>{
                                            if(err==='10000')
                                                    window.location.href='/adminsignin';
                                    }
                            });
                    })
        }

        handleChange = (pagination, filters, sorter) => {
                //console.log('Various parameters', pagination, filters, sorter);
                this.setState({
                        filteredInfo: filters,
                        sortedInfo: sorter,
                });
        }

        handleCertificate=(username, email)=>{
                const token=sessionStorage.getItem('StrawberryToken');
                fetch(`${config.server}/adminAuth/certificate`,{
                        method: 'post',
                        body:JSON.stringify({username, email}),
                        headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token,
                        },

                })
                    .then(handleResponse)
                    .then((res)=>{
                            Modal.success({
                                    title: '会员认证',
                                    content: '会员认证成功',
                                    onOk:()=>{
                                            let newData=this.state.data;
                                            for(let i=0; i<newData.length;i++)
                                            {
                                                    if(newData[i].username===username)
                                                    {
                                                            newData[i].certification=true;
                                                            break;
                                                    }
                                            }
                                            this.setState({data: newData});
                                    }
                            })
                    })
                    .catch((err)=>{
                            console.error(err);
                            Modal.error({
                                    content:errorInfo[err][lan],
                                    onOk:()=>{
                                            if(err==='10000')
                                                    window.location.href='/adminsignin';
                                    }
                            });
                    })
        }

        render(){

                const columns=[
                        {
                                title: "用户名",
                                dataIndex:"username",
                                key:"username",
                        },
                        {
                                title: "电话",
                                dataIndex:"phone",
                                key:"phone",
                        },
                        {
                                title: "电子邮箱",
                                dataIndex:"email",
                                key:"email",
                        },
                        {
                                title: "医院/机构",
                                dataIndex:"department",
                                key:"department",
                        },
                        {
                                title: "已完成任务数量",
                                dataIndex:"event",
                                key:"event",
                        },
                        {
                                title: "管理员认证操作",
                                dataIndex:"certification",
                                key:"certification",
                                render:(value, record)=>{
                                        if(!value)
                                                return (
                                                    <Button type='primary' onClick={this.handleCertificate.bind(this,record.username, record.email)}>认证</Button>
                                                );
                                        else
                                                return (
                                                    <Button type='default' disabled>已认证</Button>
                                                );
                                }
                        },
                ];
                return (
                        <article style={{minHeight:'600px'}}>
                            <Card title="查看用户列表" style={{width: '1200px', margin:'150px auto'}}>
                                    <Table columns={columns} dataSource={this.state.data} onChange={this.handleChange}  pagination={{pageSize:20}}/>
                            </Card>
                        </article>
                );
        }
}
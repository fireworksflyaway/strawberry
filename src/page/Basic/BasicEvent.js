/**
 * Created by Mason Jackson in Office on 2017/12/7.
 */
import React from 'react';
import {Card, Table} from 'antd';
import handleResponse from "../../function/handleResponse";
import provideConfig from "../../function/provideConfig";
const config=provideConfig();

const statusDict=[
    {"en": 'Waiting',"zh": '等待中'},
    {"en": 'Running', "zh":'运行中'},
    {"en": 'Success', "zh":"完成"},
    {"en": 'Failed', "zh":"失败"},
    {"en": 'Expired', "zh":"超时"}
];
const typeDict=[
    {"zh":"单文件任务"},
    {"zh":"批处理任务"}
];

const columns=[
    {
        title: "任务编号",
        dataIndex: "number",
        defaultSortOrder: "descend",
        sorter: true
},{
        title: "任务类型",
        dataIndex: "type",
        filters:[{
                text: "单文件任务",
                value: 0
        },{
                text: "批处理任务",
                value: 1
        }]
},{
        title: "任务状态",
        dataIndex: "status",
        filters:[{
                text: "等待中",
                value: "waiting"
        },{
                text: "计算中",
                value: "running"
        },{
                text: "完成",
                value: "finish"
        },{
                text: "失败",
                value: "failed"
        },{
                text: "超时",
                value: "expired"
        }]
},{
        title: "任务生成时间",
        dataIndex: "creationTime",
        sorter: true
},{
        title: "任务开始时间",
        dataIndex: "startTime",
        sorter: true
},{
        title: "完成时间",
        dataIndex: "endTime",
        sorter: true
}];

export default class BasicEvent extends React.Component{
        constructor(props){
                super(props);
                this.state={
                        data:[]
                }
        }
        componentWillMount(){
            const token=sessionStorage.getItem('StrawberryToken');
            fetch(`${config.server}/auth/getbasicevent`, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            })
                .then(handleResponse)
                .then((res)=>{
                    console.log(res.eventList);
                    res.eventList.forEach(function (event) {
                        event.status=statusDict[event.status].zh;
                        event.type=typeDict[event.type].zh;
                    })
                    this.setState({
                       data:res.eventList
                    });
                })
                .catch((err)=>console.error(err));

        }
        render(){
                return(
                        <article style={{minHeight:'600px'}}>
                                <Card title="查看任务数据" style={{width: '1200px', margin:'150px auto'}}>
                                        <Table columns={columns} dataSource={this.state.data}/>
                                </Card>
                        </article>
                )
        }
}
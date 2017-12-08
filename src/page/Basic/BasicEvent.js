/**
 * Created by Mason Jackson in Office on 2017/12/7.
 */
import React from 'react';
import {Card, Table} from 'antd';

const columns=[{
        title: "任务编号",
        dataIndex: "number",
        defaultSortOrder: "descend",
        sorter: true
},{
        title: "任务类型",
        dataIndex: "type",
        filters:[{
                text: "基础版",
                value: "original"
        },{
                text: "批处理",
                value: "batch"
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
}]

export default class BasicEvent extends React.Component{
        render(){
                return(
                        <article style={{minHeight:'600px'}}>
                                <Card title="查看任务数据" style={{width: '1200px', margin:'150px auto'}}>
                                        <Table columns={columns} />
                                </Card>
                        </article>
                )
        }
}
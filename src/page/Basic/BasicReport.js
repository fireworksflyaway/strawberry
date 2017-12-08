/**
 * Created by Mason Jackson in Office on 2017/12/8.
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
        title: "病人ID",
        dataIndex: "patientID"
},{
        title: "病人姓名",
        dataIndex: "patientName"
},{
        title: "性别",
        dataIndex: "gender",
        filters:[{
                text: "男",
                value: "male"
        },{
                text: "女",
                value: "female"
        }]
},{
        title: "年龄",
        dataIndex: "age",
        sorter:true
},{
        title: "扫描时间",
        dataIndex: "scanTime",
        sorter:true
},{
        title: "PDF文件名",
        dataIndex: "pdfName"
},{
        title: "报告生成时间",
        dataIndex: "creationTime",
        sorter:true
},{
        title: "报告下载",
        dataIndex: "download"
}]

export default class BasicReport extends React.Component{
        render(){
                return(
                        <article style={{minHeight:'600px'}}>
                                <Card title="查看报告" style={{width: '1400px', margin:'150px auto'}}>
                                        <Table columns={columns} />
                                </Card>
                        </article>
                )
        }
}/**
 * Created by Mason Jackson in Office on 2017/12/8.
 */

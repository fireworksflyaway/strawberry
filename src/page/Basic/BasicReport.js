/**
 * Created by Mason Jackson in Office on 2017/12/8.
 */
import React from 'react';
import {Card, Table, Modal} from 'antd';
import moment from 'moment';
import handleResponse from "../../function/handleResponse";
import provideConfig from "../../function/provideConfig";
import 'antd/es/divider/style/index.css'
import provideErrorInfo from '../../function/provideErrorInfo';
const errorInfo=provideErrorInfo();
const config=provideConfig();
const lan='zh';
const typeDict=[
        {"zh":"单文件任务"},
        {"zh":"批处理任务组"},
        {"zh":"批处理任务"}
];

const genderDict=[
        {"zh": "男"},
        {"zh": "女"},
]

const columns=[
    {
        title: "任务编号",
        dataIndex: "eventNum",
        key:"eventNum",
        sorter: (a,b)=>a.eventNum >= b.eventNum?1:-1,
        //sortOrder: sortedInfo.columnKey==='number'&&sortedInfo.order,
},{
        title: "任务类型",
        dataIndex: "eventType",
        render:(value, record)=>typeDict[value].zh,
        onFilter: (value, record)=> record.eventType.toString()===value,
        filters:[{
                text: "单文件任务",
                value: "0"
        },{
                text: "批处理任务",
                value: "2"
        }]
},{
        title: "病人ID",
        dataIndex: "pid"
},{
        title: "病人姓名",
        dataIndex: "pname"
},{
        title: "性别",
        dataIndex: "gender",
        render:(value, record)=>genderDict[value].zh,
        onFilter: (value, record)=> record.gender.toString()===value,
        filters:[{
                text: "男",
                value: "0"
        },{
                text: "女",
                value: "1"
        }]
},{
        title: "年龄",
        dataIndex: "age",
        sorter:(a,b)=>a.age-b.age,
},{
        title: "扫描时间",
        dataIndex: "scanTime",
        sorter:(a,b)=>a.scanTime>b.scanTime?1:-1,
        render:(value, record)=>moment(value).format("YYYY-MM-DD")
},{
        title: "医院",
        dataIndex: "hospital",
},{
        title: "PDF文件名",
        dataIndex: "pdfId"
},{
        title: "报告生成时间",
        dataIndex: "creationTime",
        sorter:(a,b)=>a.creationTime>b.creationTime?1:-1,
},{
        title: "报告下载",
        key:"download",
        render:(text, record)=>(
            <span>
                <a onClick={(e)=>{window.open(`${config.fileServer}/${record.pdfId}_En.pdf`);}}>英文版</a>
                <span className="ant-divider" />
                <a onClick={(e)=>{window.open(`${config.fileServer}/${record.pdfId}_Zh.pdf`);}}>中文版</a>
            </span>
        )
}]

export default class BasicReport extends React.Component{
        constructor(props){
                super(props);
                this.state={
                        data:[]
                }
        }

        componentWillMount(){
            const token=sessionStorage.getItem('StrawberryToken');
            if(!token)
            {
                    window.location.href="/";
                    return;
            }
            fetch(`${config.server}/basicAuth/getbasicreport`, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            })
                .then(handleResponse)
                .then((res)=>{
                    //console.log(res.result);
                    // res.eventList.forEach(function (event) {
                    //     event.status=statusDict[event.status].zh;
                    //     event.type=typeDict[event.type].zh;
                    // })
                res.result.reverse();
                    this.setState({
                        data:res.result
                    });
                })
                .catch((err)=>{
                        console.error(err);
                        Modal.error({
                                content:errorInfo[err][lan],
                                onOk:()=>{
                                        if(err==='10000')
                                                window.location.href='/signin';
                                }
                        });
                });
        }

        render(){
                return(
                        <article style={{minHeight:'600px'}}>
                                <Card title="查看报告" style={{width: '1600px', margin:'150px auto'}}>
                                        <Table columns={columns} dataSource={this.state.data}  pagination={{pageSize:20}}/>
                                </Card>
                        </article>
                )
        }
}/**
 * Created by Mason Jackson in Office on 2017/12/8.
 */

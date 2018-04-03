/**
 * Created by Mason Jackson in Office on 2017/12/8.
 */
import React from 'react';
import {Card, Table, Modal} from 'antd';
import moment from 'moment';
import handleResponse from "../../function/handleResponse";
import config from '../../config';
import 'antd/es/divider/style/index.css'
import errorList from '../../errorList';
const lan='zh';
const typeDict=[
        {"zh":"单文件任务"},
        {"zh":"批处理任务"}
];

// const genderDict=[
//         {"zh": "男"},
//         {"zh": "女"},
// ]

const columns=[
    {
        title: "任务编号",
        dataIndex: "Number",
        key:"Number",
        sorter: (a,b)=>a.Number >= b.Number?1:-1,
        //sortOrder: sortedInfo.columnKey==='number'&&sortedInfo.order,
},{
        title: "任务类型",
        dataIndex: "IsBatch",
        render:(value, record)=>typeDict[record.IsBatch?1:0].zh,
        onFilter:(value, record)=>value===(record.IsBatch?"1":"0"),
        filters:[{
                text: "单文件任务",
                value: "0"
        },{
                text: "批处理任务",
                value: "1"
        }]
},{
        title: "病人姓名",
        dataIndex: "P_Name"
},{
        title: "年龄",
        dataIndex: "P_Age",
        sorter:(a,b)=>a.P_Age-b.P_Age,
},{
        title: "检测时间",
        dataIndex: "TestTime",
        sorter:(a,b)=>a.scanTime>b.scanTime?1:-1,
        render:(value, record)=>moment(value).format("YYYY-MM-DD")
},{
        title: "检测机构",
        dataIndex: "Operator",
},{
        title: "报告生成时间",
        dataIndex: "CreationTime",
        sorter:(a,b)=>a.CreationTime>b.CreationTime?1:-1,
},{
        title: "报告下载",
        key:"download",
        render:(text, record)=>(
            <span>
                <a onClick={(e)=>{window.open(`${config.fileServer}/${record.Filename}.pdf`);}}>点击下载报告</a>
            </span>
        )
}]

export default class PE_Report extends React.Component{
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
            fetch(`${config.server}/PE_Auth/PE_getReport`, {
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
                                content:errorList[err][lan],
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
                                <Card title="查看报告" style={{width: '1200px', margin:'150px auto'}}>
                                        <Table columns={columns} dataSource={this.state.data}  pagination={{pageSize:20}}/>
                                </Card>
                        </article>
                )
        }
}/**
 * Created by Mason Jackson in Office on 2017/12/8.
 */

/**
 * Created by Mason Jackson in Office on 2017/12/7.
 */
import React from 'react';
import {Card, Table, Badge, Modal } from 'antd';
import handleResponse from "../../function/handleResponse";
import provideConfig from "../../function/provideConfig";
import provideErrorInfo from '../../function/provideErrorInfo';
const errorInfo=provideErrorInfo();
const config=provideConfig();
const lan='zh';
const statusDict=[
    {"en": 'Waiting',"zh": '等待中'},
    {"en": 'Running', "zh":'运行中'},
    {"en": 'Success', "zh":"完成"},
    {"en": 'Failed', "zh":"失败"},
    {"en": 'Expired', "zh":"超时"}
];


const DsType=[
        {"zh": "阿尔兹海默"},
        {"zh": "血管性痴呆"},
        {"zh": "小血管病变"},
        {"zh": "额颞叶痴呆"},
        {"zh": "多发性硬化症"},
        {"zh": "帕金森综合症"},
        {"zh": "中风后脑改变"},
]



export default class DiagnoseEvent extends React.Component{
        constructor(props){
                super(props);
                this.state={
                        data:[],
                        filteredInfo: {
                                columnKey: null
                        },
                        sortedInfo: {
                                order: null
                        }
                }
        }
        componentWillMount(){
                const token=sessionStorage.getItem('StrawberryToken');
                if(!token)
                {
                        window.location.href="/";
                        return;
                }
                if(this.timer)
                        clearInterval(this.timer);
                this.getData();
                this.timer=setInterval(()=>{
                        this.getData();
                },10000);

        }

        componentWillUnmount(){
                if(this.timer)
                {
                        console.log('clear timer');
                        clearInterval(this.timer);
                }
        }

        getData=()=>{
                console.log('timer');
                const token=sessionStorage.getItem('StrawberryToken');
                fetch(`${config.server}/DiagnoseAuth/DiagnoseEvents`, {
                        method: 'get',
                        headers: {
                                'Authorization': 'Bearer ' + token,
                        }
                })
                        .then(handleResponse)
                        .then((res)=> {
                                const {eventList}=res;
                                eventList.reverse();
                                //console.log(eventList);

                                this.setState({
                                        data: eventList
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

        handleChange = (pagination, filters, sorter) => {
                console.log('Various parameters', pagination, filters, sorter);
                this.setState({
                        filteredInfo: filters,
                        sortedInfo: sorter,
                });
        }

        render(){
                let { sortedInfo, filteredInfo } = this.state;
                sortedInfo = sortedInfo || {};
                filteredInfo = filteredInfo || {};
                const dsTypeFilter=[];
                for(let i=0;i<7;i++){
                        dsTypeFilter.push({
                                text: DsType[i].zh,
                                value: i,
                        })
                }
                const columns=[
                        {
                                title: "任务编号",
                                dataIndex: "Number",
                                key: "Number",
                                sorter: (a,b)=>a.Number >= b.Number?1:-1,
                                sortOrder: sortedInfo.columnKey==='Number'&&sortedInfo.order,
                        },{
                                title: "任务类型",
                                dataIndex: "DsType",
                                key:"DsType",
                                filters:dsTypeFilter,
                                filteredValue: filteredInfo.type||null,
                                onFilter: (value, record)=> record.DsType.toString()===value,
                                render:(value, record)=>DsType[value].zh
                        },{
                                title: "任务状态",
                                dataIndex: "Status",
                                key: "Status",
                                // filters:[
                                //     {
                                //         text: "等待中",
                                //         value: "0"
                                // },{
                                //         text: "计算中",
                                //         value: "1"
                                // },{
                                //         text: "完成",
                                //         value: "2"
                                // },{
                                //         text: "失败",
                                //         value: "3"
                                // },{
                                //         text: "超时",
                                //         value: "4"
                                // }],
                                // filteredValue: filteredInfo.status||null,
                                // onFilter: (value, record)=>record.status.toString()===value,
                                render: (value, record)=>{
                                        if(record.type===1)
                                                return '';
                                        let text=record.type!==1?statusDict[value].zh:"";
                                        switch (value){
                                                case 0:return (<Badge status="warning" text={text} />);
                                                case 1:return <Badge status="processing" text={text} />;
                                                case 2:return <Badge status="success" text={text} />;
                                                case 3:return <Badge status="error" text={text} />;
                                                case 4:return <Badge status="error" text={text} />;
                                                default: return '';
                                        }
                                }
                        },{
                                title: "任务生成时间",
                                dataIndex: "CreationTime",
                                key: "CreationTime",
                                sorter: (a,b)=>a.CreationTime>b.CreationTime?1:-1,
                                sortOrder: sortedInfo.columnKey==='CreationTime'&&sortedInfo.order
                        },{
                                title: "任务开始时间",
                                dataIndex: "StartTime",
                                key: "StartTime",
                                sorter: (a,b)=>a.StartTime>b.StartTime?1:-1,
                                sortOrder: sortedInfo.columnKey==='StartTime'&&sortedInfo.order
                        },{
                                title: "完成时间",
                                dataIndex: "EndTime",
                                key: "EndTime",
                                sorter: (a,b)=>a.EndTime>b.EndTime?1:-1,
                                sortOrder: sortedInfo.columnKey==='EndTime'&&sortedInfo.order
                        }];


                return(
                        <article style={{minHeight:'600px'}}>
                                <Card title="查看任务数据" style={{width: '1200px', margin:'150px auto'}}>
                                        <Table columns={columns} dataSource={this.state.data} onChange={this.handleChange}  pagination={{pageSize:20}}/>
                                </Card>
                        </article>
                )
        }
}
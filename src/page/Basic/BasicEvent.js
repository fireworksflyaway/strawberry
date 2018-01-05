/**
 * Created by Mason Jackson in Office on 2017/12/7.
 */
import React from 'react';
import {Card, Table, Badge } from 'antd';
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
        {"zh":"批处理任务组"},
        {"zh":"批处理任务"}
];



export default class BasicEvent extends React.Component{
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
                fetch(`${config.server}/auth/getbasicevent`, {
                        method: 'get',
                        headers: {
                                'Authorization': 'Bearer ' + token,
                        }
                })
                    .then(handleResponse)
                    .then((res)=> {
                                const eventList=[];
                                const mapper={};
                                //console.log(res.eventList);
                                for(let i=0;i<res.eventList.length;i++){
                                        if(res.eventList[i].type===0)
                                                eventList.push(res.eventList[i]);
                                        if(res.eventList[i].type===1)
                                        {
                                                eventList.push(res.eventList[i]);
                                                mapper[res.eventList[i].number]=eventList.length-1;
                                        }
                                        eventList[eventList.length-1].key=eventList[eventList.length-1].number;
                                }

                                //console.log(mapper);

                                for(let i=0;i<res.eventList.length;i++){
                                        if(res.eventList[i].type===2)
                                        {
                                                let fatherNum=res.eventList[i].number.split('_')[0];
                                                //console.log(eventList[mapper[fatherNum]]);
                                                if(eventList[mapper[fatherNum]]["children"]===undefined)
                                                        eventList[mapper[fatherNum]]["children"]=[];
                                                eventList[mapper[fatherNum]]["children"].push(res.eventList[i]);

                                        }
                                }

                                eventList.reverse();
                                //console.log(eventList);

                                this.setState({
                                        data: eventList
                                });
                        }
                    )
                    .catch((err)=>console.error(err));
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

                const columns=[
                        {
                                title: "任务编号",
                                dataIndex: "number",
                                key: "number",
                                sorter: (a,b)=>a.number >= b.number?1:-1,
                                sortOrder: sortedInfo.columnKey==='number'&&sortedInfo.order,
                                // render:(value,record)=>{
                                //         if(record.type===1)
                                //                 return <Badge dot >{value}</Badge>;
                                //         else
                                //                 return value;
                                // }
                        },{
                                title: "任务类型",
                                dataIndex: "type",
                                key:"type",
                                filters:[{
                                        text: "单文件任务",
                                        value: "0"
                                },{
                                        text: "批处理任务",
                                        value: "1"
                                }],
                                filteredValue: filteredInfo.type||null,
                                onFilter: (value, record)=> record.type.toString()===value,
                                render:(value, record)=>typeDict[value].zh,
                        },{
                                title: "任务状态",
                                dataIndex: "status",
                                key: "status",
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
                                dataIndex: "creationTime",
                                key: "creationTime",
                                sorter: (a,b)=>a.creationTime>b.creationTime?1:-1,
                                sortOrder: sortedInfo.columnKey==='creationTime'&&sortedInfo.order
                        },{
                                title: "任务开始时间",
                                dataIndex: "startTime",
                                key: "startTime",
                                sorter: (a,b)=>a.startTime>b.startTime?1:-1,
                                sortOrder: sortedInfo.columnKey==='startTime'&&sortedInfo.order
                        },{
                                title: "完成时间",
                                dataIndex: "endTime",
                                key: "endTime",
                                sorter: (a,b)=>a.endTime>b.endTime?1:-1,
                                sortOrder: sortedInfo.columnKey==='endTime'&&sortedInfo.order
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
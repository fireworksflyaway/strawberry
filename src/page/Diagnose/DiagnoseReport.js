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

const DsType=[
        {"zh": "阿尔兹海默"},
        {"zh": "血管性痴呆"},
        {"zh": "小血管病变"},
        {"zh": "额颞叶痴呆"},
        {"zh": "多发性硬化症"},
        {"zh": "帕金森综合症"},
        {"zh": "中风后脑改变"},
]
const genderDict=[
        {"zh": "男"},
        {"zh": "女"},
]

const columns=[
    {
        title: "任务编号",
        dataIndex: "Number",
        key:"Number",
        sorter: (a,b)=>a.Number >= b.Number?1:-1,
        //sortOrder: sortedInfo.columnKey==='number'&&sortedInfo.order,
},{
        title: "诊断疾病",
        dataIndex: "DsType",
        key:"DsType",
        render:(value, record)=>DsType[value].zh,
        onFilter: (value, record)=> record.DsType.toString()===value,
        filters:[{
                text: "阿尔兹海默（Alzheimer’s Disease）",
                value: "0"
        },{
                text: "血管性痴呆（Vascular Dementia）",
                value: "1"
        },{
                text: "小血管病变（Small Vessel Disease）",
                value: "2"
        },{
                text: "额颞叶痴呆 （Frontotemporal Dementia）",
                value: "3"
        },{
                text: "多发性硬化症（Multiple Scelosis）",
                value: "4"
        },{
                text: "帕金森综合症（Parkinsonism）",
                value: "5"
        },{
                text: "中风后脑改变（Post-Stroke Brain Changes）",
                value: "6"
        },

        ]
},{
        title: "病人ID",
        dataIndex: "P_Id"
},{
        title: "病人姓名",
        dataIndex: "P_Name"
},{
        title: "性别",
        dataIndex: "P_Gender",
        //render:(value, record)=>genderDict[value].zh,
        onFilter: (value, record)=> record.P_Gender.toString()===value,
        filters:[{
                text: "男",
                value: "0"
        },{
                text: "女",
                value: "1"
        }]
},{
        title: "年龄",
        dataIndex: "P_Age",
        sorter:(a,b)=>a.P_Age-b.P_Age,
},{
        title: "扫描时间",
        dataIndex: "TestTime",
        sorter:(a,b)=>a.TestTime>b.TestTime?1:-1,
        render:(value, record)=>moment(value).format("YYYY-MM-DD")
},{
        title: "医院",
        dataIndex: "Operator",
},{
        title: "报告生成时间",
        dataIndex: "CreationTime",
        sorter:(a,b)=>a.CreationTime>b.CreationTime?1:-1,
},{
        title: "报告下载",
        key:"Download",
        render:(text, record)=>(
            <span>
                <a onClick={(e)=>{window.open(`${config.fileServer}/${record.Filename}_En.pdf`);}}>英文版</a>
                <span className="ant-divider" />
                <a onClick={(e)=>{window.open(`${config.fileServer}/${record.Filename}_Zh.pdf`);}}>中文版</a>
            </span>
        )
}]

export default class DiagnoseReport extends React.Component{
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
            fetch(`${config.server}/DiagnoseAuth/DiagnoseReport`, {
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
                        console.log(res.result);
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
                                <Card title="诊断版查看报告" style={{width: '1600px', margin:'150px auto'}}>
                                        <Table columns={columns} dataSource={this.state.data}  pagination={{pageSize:20}}/>
                                </Card>
                        </article>
                )
        }
}/**
 * Created by Mason Jackson in Office on 2017/12/8.
 */

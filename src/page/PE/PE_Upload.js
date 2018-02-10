/**
 * Created by Mason Jackson in Office on 2017/12/7.
 */
import React from 'react';
import {Card, Tabs} from 'antd';
import PE_UploadSingleForm from './PE_UploadSingleForm';
import PE_UploadBatchForm from './PE_UploadBatchForm';
const TabPane = Tabs.TabPane;
export default class PE_Upload extends React.Component{
        componentWillMount(){
                const token=sessionStorage.getItem('StrawberryToken');
                if(!token)
                {
                        window.location.href="/";
                        return;
                }

        }
        render(){
                return(
                        <article style={{minHeight:'600px'}}>
                                <Card title="上传数据" style={{width: '700px', margin:'150px auto'}}>
                                        <Tabs defaultActiveKey="1">
                                                <TabPane tab="单任务上传" key="1"><PE_UploadSingleForm /></TabPane>
                                                <TabPane tab="批量上传" key="2"><PE_UploadBatchForm /></TabPane>
                                        </Tabs>
                                </Card>
                        </article>
                )
        }
}

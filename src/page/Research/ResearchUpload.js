/**
 * Created by Mason Jackson in Office on 2/27/18.
 */
import React from 'react';
import {Card, Tabs} from 'antd';
import ResearchUploadSingleForm from './ResearchUploadSingleForm';
import ResearchUploadBatchForm from './ResearchUploadBatchForm';
const TabPane = Tabs.TabPane;
export default class ResearchUpload extends React.Component{
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
                            <Card title="科研版上传数据" style={{width: '700px', margin:'150px auto'}}>
                                    <Tabs defaultActiveKey="1">
                                            <TabPane tab="单任务上传" key="1"><ResearchUploadSingleForm /></TabPane>
                                            <TabPane tab="批量上传" key="2"><ResearchUploadBatchForm /></TabPane>
                                    </Tabs>
                            </Card>
                    </article>
                )
        }
}
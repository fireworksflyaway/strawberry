/**
 * Created by Mason Jackson in Office on 2017/12/7.
 */
import React from 'react';
import {Card, Tabs} from 'antd';
import BasicUploadSingleForm from './BasicUploadSingleForm';
import BasicUploadBatchForm from './BasicUploadBatchForm';
const TabPane = Tabs.TabPane;
export default class BasicUpload extends React.Component{
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
                                                <TabPane tab="单任务上传" key="1"><BasicUploadSingleForm/></TabPane>
                                                <TabPane tab="批量上传" key="2"><BasicUploadBatchForm/></TabPane>
                                        </Tabs>
                                </Card>
                        </article>
                )
        }
}

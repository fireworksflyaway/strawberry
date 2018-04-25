/**
 * Created by Mason Jackson in Office on 2017/12/7.
 */
import React from 'react';
import {Card} from 'antd';

import DiagnoseUploadSingleForm from './DiagnoseUploadForm';


export default class DiagnoseUpload extends React.Component{
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
                                <Card title="诊断版上传数据" style={{width: '700px', margin:'150px auto'}}>
                                        <DiagnoseUploadSingleForm />
                                </Card>
                        </article>
                )
        }
}

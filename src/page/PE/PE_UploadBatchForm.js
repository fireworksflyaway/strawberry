/**
 * Created by Mason Jackson in Office on 2017/12/7.
 */
import React from 'react';
import {Form, Upload, Button} from 'antd';
import {withRouter} from "react-router-dom";
import config from '../../config';
import {message} from "antd/lib/index";
import handleResponse from "../../function/handleResponse";
const FormItem=Form.Item;

class PE_UploadBatchForm extends React.Component{
        constructor(props){
                super(props);
                this.state={
                        isUpdating: false
                }
        }


        handleSubmit=(e)=>{
                e.preventDefault();
                this.setState({isUpdating: true});
                this.props.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        if(values.batchFile[0].status!=="done")
                        {
                            message.error("请重新上传批处理文件");
                            this.setState({isUpdating: false});
                            return;
                        }

                        const data={
                            filename: values.batchFile[0].name,
                        }
                        const token=sessionStorage.getItem('StrawberryToken');
                        fetch(`${config.server}/PE_Auth/PE_uploadBatchForm`,{
                            method: 'post',
                            body:JSON.stringify(data),
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token,
                            }
                        })
                            .then(handleResponse)
                            .then((res)=>{
                                message.success('任务提交成功');
                                    window.location.href='/PE_Event';
                            })
                            .catch((err)=>{
                                console.error(err);
                                this.setState({isUpdating: false});
                                message.error('上传失败');
                            })
                    }
                })
        }

        normFile = (e) => {
                //console.log('Upload event:', e);
                if (Array.isArray(e)) {
                    return e;
                }
                return e && e.fileList;
        }

        handleChange=(info)=>{
                if(info.fileList.length>1)
                    info.fileList=info.fileList.slice(-1);
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }
        }

        render(){
                const {getFieldDecorator} = this.props.form;
                const formItemLayout = {
                        labelCol: { span: 8 },
                        wrapperCol: { span: 14 },
                };
                const tailFormItemLayout = {
                        wrapperCol: {
                                xs: {
                                        span: 24,
                                        offset: 0,
                                },
                                sm: {
                                        span: 14,
                                        offset: 8,
                                },
                        },
                };

                const batchProps={
                        onChange: this.handleChange,
                        action: `${config.server}/PE_Auth/PE_uploadBatch`,
                        accept: '.zip',
                        headers: {
                                'Authorization': 'Bearer ' + sessionStorage.getItem('StrawberryToken')
                        },
                }

                return (
                        <Form onSubmit={this.handleSubmit}>
                                <br />
                                <FormItem {...formItemLayout} label="上传批处理文件（.zip格式)">
                                        {getFieldDecorator('batchFile', {
                                                valuePropName: 'fileList',
                                                getValueFromEvent: this.normFile,
                                                rules: [{required: true, message:'请先上传文件'}]
                                                })(
                                                <Upload {...batchProps}>
                                                    <Button icon="upload">点击上传文件</Button>
                                                </Upload>
                                        )}
                                </FormItem>
                                <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" icon="rocket" htmlType="submit"  loading={this.state.isUpdating}>提交任务</Button>
                                </FormItem>
                        </Form>
                )
        }
}

export default withRouter(Form.create()(PE_UploadBatchForm));
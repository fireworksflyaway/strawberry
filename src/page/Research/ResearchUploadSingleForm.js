/**
 * Created by Mason Jackson in Office on 2/27/18.
 */
import React from 'react';
import {Form,  Button, Icon, Input, message, Upload} from 'antd';
import config from '../../config';
import handleResponse from '../../function/handleResponse';
import {withRouter} from "react-router-dom";
const FormItem=Form.Item;

const {TextArea}=Input;

class ResearchUploadSingleForm extends React.Component{
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
                                if(values.fileT1[0].status!=="done")
                                {
                                        message.error("请重新上传T1文件");
                                        this.setState({isUpdating: false});
                                        return;
                                }
                                if(values.fileT2!==undefined&&values.fileT2[0].status!=="done")
                                {
                                        message.error("请重新上传T2文件");
                                        this.setState({isUpdating: false});
                                        return;
                                }
                                const data={
                                        t1: values.fileT1[0].name,
                                        t2: values.fileT2?values.fileT2[0].name:"",
                                        comment: values.comment
                                }
                                const token=sessionStorage.getItem('StrawberryToken');

                                fetch(`${config.server}/ResearchAuth/ResearchSingleEvent`,{
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
                                            //this.props.history.push('/basicevent');
                                            window.location.href='/ResearchEvent';
                                    })
                                    .catch((err)=>{
                                            console.error(err);
                                            message.error('上传失败');
                                            this.setState({isUpdating: false});
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
                        labelCol: { span: 6 },
                        wrapperCol: { span: 16 },
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

                const T1Props = {
                        onChange: this.handleChange,
                        action: `${config.server}/ResearchAuth/ResearchT1`,
                        accept: '.zip',
                        headers: {
                                'Authorization': 'Bearer ' + sessionStorage.getItem('StrawberryToken')
                        },
                };

                const T2Props = {
                        onChange: this.handleChange,
                        action: `${config.server}/ResearchAuth/ResearchT2`,
                        accept: '.zip',
                        headers: {
                                'Authorization': 'Bearer ' + sessionStorage.getItem('StrawberryToken')
                        },
                };




                return (
                    <Form onSubmit={this.handleSubmit}>
                            <br />
                            <FormItem {...formItemLayout} label="上传T1W文件">
                                    {getFieldDecorator('fileT1', {
                                            valuePropName: 'fileList',
                                            getValueFromEvent: this.normFile,
                                            rules: [{required: true, message:'请先上传文件'}]
                                    })(
                                        <Upload {...T1Props}>
                                                <Button>
                                                        <Icon type="upload" />点击上传文件（.zip格式)
                                                </Button>
                                        </Upload>
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="上传FLAIR/T2W文件">
                                    {getFieldDecorator('fileT2', {
                                            valuePropName: 'fileList',
                                            getValueFromEvent: this.normFile
                                    })(
                                        <Upload {...T2Props}>
                                                <Button>
                                                        <Icon type="upload" />点击上传文件（.zip格式)
                                                </Button>
                                        </Upload>
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="医师备注">
                                    {
                                            getFieldDecorator('comment', {
                                                    // rules: [{
                                                    //         required: true, message: '请输入医师备注'
                                                    // }]
                                            })(
                                                <TextArea style={{minHeight:'100px'}}/>
                                            )
                                    }
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                    <Button type="primary" icon="rocket" htmlType="submit" loading={this.state.isUpdating}>提交任务</Button>
                            </FormItem>
                    </Form>
                )
        }
}

export default withRouter(Form.create()(ResearchUploadSingleForm));
/**
 * Created by Mason Jackson in Office on 2017/12/7.
 */
import React from 'react';
import {Form, Upload, Button, Icon, Input} from 'antd';

const FormItem=Form.Item;
const {TextArea}=Input;
class BasicUploadSingleForm extends React.Component{
        render(){
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
                return (
                        <Form>
                                <br />
                                <FormItem {...formItemLayout} label="上传T1W文件（.zip格式)">
                                        <Upload>
                                                <Button>
                                                        <Icon type="upload" />点击上传文件
                                                </Button>
                                        </Upload>
                                </FormItem>
                                <FormItem {...formItemLayout} label="上传FLAIR/T2W文件（.zip格式)">
                                        <Upload>
                                                <Button>
                                                        <Icon type="upload" />点击上传文件
                                                </Button>
                                        </Upload>
                                </FormItem>
                                <FormItem {...formItemLayout} label="医师备注">
                                        <TextArea style={{minHeight:'100px'}}/>
                                </FormItem>
                                <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" icon="rocket" >提交任务</Button>
                                </FormItem>
                        </Form>
                )
        }
}

export default Form.create()(BasicUploadSingleForm);
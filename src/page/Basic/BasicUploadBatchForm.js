/**
 * Created by Mason Jackson in Office on 2017/12/7.
 */
import React from 'react';
import {Form, Upload, Button, Icon, Input} from 'antd';
import provideConfig from "../../function/provideConfig";

const config=provideConfig();
const FormItem=Form.Item;
const {TextArea}=Input;
class BasicUploadBatchForm extends React.Component{
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
                                <FormItem {...formItemLayout} label="上传批处理文件（.zip格式)">
                                        <Upload>
                                                <Button>
                                                        <Icon type="upload" />点击上传文件
                                                </Button>
                                        </Upload>
                                </FormItem>
                                <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" icon="rocket" >提交任务</Button>
                                </FormItem>
                        </Form>
                )
        }
}

export default Form.create()(BasicUploadBatchForm);
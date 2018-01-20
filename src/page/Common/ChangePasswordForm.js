/**
 * Created by Mason Jackson in Office on 2017/12/5.
 */
import React from 'react';
import {Form, Input, Button, message, Modal} from 'antd';
import handleResponse from '../../function/handleResponse';
import provideConfig from '../../function/provideConfig';
import {sha256} from 'js-sha256';
import provideErrorInfo from '../../function/provideErrorInfo';
const errorInfo=provideErrorInfo();
const config=provideConfig();
const FormItem=Form.Item;

const lan='zh';
class ChangePasswordForm extends React.Component{
        checkPassword = (rule, value, callback) => {
                const form = this.props.form;
                if (value && value !== form.getFieldValue('newPassword')) {
                        callback('两次输入的密码不一致!');
                } else {
                        callback();
                }
        }

        handleSubmit=(e)=>{
                e.preventDefault();
                this.props.form.validateFieldsAndScroll((err, values) => {
                        if(!err){
                                values.newPassword=sha256(values.newPassword);
                                values.currentPassword=sha256(values.currentPassword);
                                values.checkPassword='';
                                const token=sessionStorage.getItem('StrawberryToken');
                                fetch(`${config.server}/${this.props.type}Auth/update${this.props.type}password`,{
                                        method: 'post',
                                        body:JSON.stringify(values),
                                        headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': 'Bearer ' + token,
                                        }
                                })
                                    .then(handleResponse)
                                    .then((res)=>{
                                            message.success('更新成功');

                                    })
                                    .catch((err)=>{
                                            console.error(err);
                                            Modal.error({
                                                    content:errorInfo[err][lan]
                                            })
                                    })
                        }

                });
        }


        render(){
                const formItemLayout={
                        labelCol:{span:6},
                        wrapperCol:{span:14}
                };
                const tailFormItemLayout = {
                        wrapperCol: {
                                xs: {
                                        span: 24,
                                        offset: 0,
                                },
                                sm: {
                                        span: 14,
                                        offset: 6,
                                },
                        },
                };
                const { getFieldDecorator } = this.props.form;
                return (
                    <Form onSubmit={this.handleSubmit}>
                            <br />
                            <FormItem {...formItemLayout} label='当前密码' hasFeedback>
                                    {
                                            getFieldDecorator('currentPassword',{
                                                    rules:[{
                                                            required: true,
                                                            message:'请输入当前密码'
                                                    }]
                                            })(<Input type="password"/>)
                                    }
                            </FormItem>
                            <FormItem {...formItemLayout} label='新密码' hasFeedback>
                                    {
                                            getFieldDecorator('newPassword', {
                                                    rules:[{
                                                            required: true,
                                                            message:'请输入新密码'
                                                    },{
                                                            min:6, message: '密码长度不得少于6位',
                                                    }]
                                            })(<Input type="password" />)
                                    }
                            </FormItem>
                            <FormItem {...formItemLayout} label='重复新密码' hasFeedback>
                                    {
                                            getFieldDecorator('checkPassword', {
                                                    rules:[{
                                                            required: true,
                                                            message:'请再次输入新密码'
                                                    },{
                                                            validator: this.checkPassword,
                                                    }]
                                            })(<Input type="password" />)
                                    }
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                    <Button type='primary' htmlType='submit'>提交修改</Button>
                            </FormItem>
                    </Form>
                )
        }
}

export default Form.create()(ChangePasswordForm);
/**
 * Created by Mason Jackson in Office on 2/28/18.
 */

import React from 'react';
import {Form, Input, Button, message, Modal} from 'antd';
import handleResponse from '../../function/handleResponse';
import config from '../../config';

import provideErrorInfo from '../../function/provideErrorInfo';
const errorInfo=provideErrorInfo();
const FormItem=Form.Item;

const lan='zh';
class ProfileInfoForm extends React.Component{
        constructor(props){
                super(props);
                this.state={
                        username: '',
                        email: '',
                        phone: '',
                        department:''
                }
        }

        componentWillMount(){
                const token=sessionStorage.getItem('StrawberryToken');
                fetch(`${config.server}/${this.props.type}Auth/${this.props.type}Profile`, {
                        method: 'get',
                        headers: {
                                'Authorization': 'Bearer ' + token,
                        }
                })
                    .then(handleResponse)
                    .then((res)=>{
                            this.setState({
                                    username: res.Username,
                                    email: res.Email,
                                    phone: res.Phone,
                                    department: res.Department
                            })
                    })
                    .catch((err)=>{
                            console.error(err);
                            Modal.error({
                                    content:errorInfo[err][lan]
                            })
                    });
        }

        handleSubmit=(e)=>{
                e.preventDefault();
                this.props.form.validateFieldsAndScroll((err, values) => {
                        if(!err){
                                const token=sessionStorage.getItem('StrawberryToken');
                                fetch(`${config.server}/${this.props.type}Auth/Update${this.props.type}Profile`,{
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
                            <FormItem {...formItemLayout} label='用户名'>
                                    <span className="ant-form-text">{this.state.username}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label='电子邮箱' hasFeedback>
                                    {
                                            getFieldDecorator('email',{
                                                    rules:[{
                                                            type:'email',
                                                            message:'请输入有效电子邮箱地址',
                                                    },{
                                                            required: true,
                                                            message:'请输入电子邮箱地址'
                                                    }],
                                                    initialValue: this.state.email
                                            })(<Input />)
                                    }
                            </FormItem>
                            <FormItem {...formItemLayout} label='电话' hasFeedback>
                                    {
                                            getFieldDecorator('phone', {
                                                    rules:[{
                                                            message:'请输入电话'
                                                    }],
                                                    initialValue: this.state.phone
                                            })(<Input />)
                                    }
                            </FormItem>
                            <FormItem {...formItemLayout} label='医院/机构' hasFeedback>
                                    {
                                            getFieldDecorator('department', {
                                                    rules:[{
                                                            message:'请输入所属医院/机构'
                                                    }],
                                                    initialValue: this.state.department
                                            })(<Input />)
                                    }
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                    <Button type='primary' htmlType='submit'>提交修改</Button>
                            </FormItem>
                    </Form>
                )
        }
}

export default Form.create()(ProfileInfoForm);
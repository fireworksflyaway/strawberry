/**
 * Created by Mason Jackson in Office on 2/26/18.
 */

import React from 'react';
import { Form, Input,  Icon,   Checkbox, Button, Modal} from 'antd';
import {sha256} from 'js-sha256';
import {withRouter} from "react-router-dom";
import handleResponse from '../../function/handleResponse';
import config from '../../config';
import errorList from '../../errorList';

const FormItem=Form.Item;
const lan='zh';


class SignUpForm extends React.Component{

        constructor(props){
                super(props);
                this.state={
                        IsSubmiting: false
                }
        }


        checkPassword = (rule, value, callback) => {
                const form = this.props.form;
                if (value && value !== form.getFieldValue('Password')) {
                        callback('两次输入的密码不一致!');
                } else {
                        callback();
                }
        }

        checkAgreement=(rule,value,callback)=>{
                if(value)
                        callback();
                else
                        callback('请先阅读使用协议');
        }


        handleSubmit = (e) => {
                e.preventDefault();
                this.setState({IsSubmiting: true});
                this.props.form.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                                values.Password=sha256(values.Password);
                                fetch(`${config.server}/${this.props.type}SignUp`,{
                                        method:'post',
                                        body:JSON.stringify(values),
                                        headers:{'Content-Type': 'application/json'}
                                })
                                    .then(handleResponse)
                                    .then((res)=>{
                                            // sessionStorage.setItem('StrawberryToken', res.token);
                                            // sessionStorage.setItem('StrawberryLoginType', 'basic');
                                            //this.props.history.push('/');

                                            Modal.success({
                                                    title: '注册成功',
                                                    content: '注册申请已提交,请等待管理员审核,审核通过后我们会邮件通知您,届时您将可以使用我们提供的服务,谢谢',
                                                    onOk: ()=>{
                                                            window.location.href='/';
                                                    }
                                            })
                                    })
                                    .catch((err)=>{
                                            console.error(err);
                                            Modal.error({
                                                    content:errorList[err][lan],
                                                    onOk:()=>{
                                                            this.setState({IsSubmiting: false});
                                                    }
                                            })

                                    });
                        }
                        else
                                this.setState({IsSubmiting: false});
                });
        }

        handleReset=()=>{
                this.props.form.resetFields();
        }

        render(){
                const {getFieldDecorator} = this.props.form;
                return (
                    <Form onSubmit={this.handleSubmit}>
                            <FormItem hasFeedback>
                                    {getFieldDecorator('Username', {
                                            rules: [{
                                                    required: true, message: '请输入用户名',
                                            },{
                                                    min:4, message: '用户名长度不得少于4位',
                                            }],
                                    })(
                                        <Input  prefix={<Icon type="user"  />} placeholder="用户名" />
                                    )}
                            </FormItem>
                            <FormItem>
                                    {getFieldDecorator('Password', {
                                            rules: [{
                                                    required: true, message: '请输入密码!'
                                            },{
                                                    min:6, message: '密码长度不得少于6位',
                                            }],
                                    })(
                                        <Input prefix={<Icon type="lock"  />} type="password" placeholder="密码" />
                                    )}
                            </FormItem>
                            <FormItem>
                                    {getFieldDecorator('PasswordCheck', {
                                            rules: [{
                                                    required: true, message: '请再次输入密码!'
                                            },{
                                                    validator: this.checkPassword,
                                            }],
                                    })(
                                        <Input prefix={<Icon type="lock"  />} type="password" placeholder="确认密码" />
                                    )}
                            </FormItem>
                            <FormItem hasFeedback>
                                    {getFieldDecorator('Email', {
                                            rules: [{
                                                    type: 'email', message: '输入不符合电子邮箱格式',
                                            },{
                                                    required: true, message: '请输入电子邮箱地址',
                                            },]
                                    })(
                                        <Input  prefix={<Icon type="mail"  />}  type='email' placeholder="电子邮箱" />
                                    )}
                            </FormItem>
                            <FormItem hasFeedback>
                                    {getFieldDecorator('Phone', {
                                            rules: [{
                                                    required: true, message: '请输入电话',
                                            },]
                                    })(
                                        <Input  prefix={<Icon type="phone"  />}  type='tel' placeholder="电话" />
                                    )}
                            </FormItem>
                            <FormItem hasFeedback>
                                    {getFieldDecorator('Department', {

                                    })(
                                        <Input  prefix={<Icon type="home"  />}  type='text' placeholder="医院/机构" />
                                    )}
                            </FormItem>
                            <FormItem style={{ marginBottom: 8 }}>
                                    {getFieldDecorator('Agreement', {
                                            valuePropName: 'checked',
                                            initialValue:false,
                                            rules:[
                                                    {validator: this.checkAgreement}
                                            ]

                                    })(
                                        <Checkbox>我已阅读 <a href="">使用协议</a></Checkbox>
                                    )}
                            </FormItem>
                            <FormItem>
                                    <Button type="primary" htmlType="submit" icon="user" loading={this.state.IsSubmiting}>注册</Button>&emsp;
                                    <Button htmlType="reset" onClick={this.handleReset} icon="reload">重置</Button>
                            </FormItem>
                    </Form>
                )
        }
}

export default withRouter(Form.create()(SignUpForm)) ;
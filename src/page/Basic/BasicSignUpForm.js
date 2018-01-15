/**
 * Created by Mason Jackson in Office on 2017/11/25.
 */
import React from 'react';
import { Form, Input,  Icon,   Checkbox, Button} from 'antd';
import {sha256} from 'js-sha256';
import {withRouter} from "react-router-dom";
import handleResponse from '../../function/handleResponse';
import provideConfig from '../../function/provideConfig';

const config=provideConfig();
const FormItem=Form.Item;



class BasicSignUpForm extends React.Component{

        checkPassword = (rule, value, callback) => {
                const form = this.props.form;
                if (value && value !== form.getFieldValue('password')) {
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
                this.props.form.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                                //console.log(values);
                                values.password=sha256(values.password);
                                values.lan='zh';
                                fetch(`${config.server}/signup`,{
                                        method:'post',
                                        body:JSON.stringify(values),
                                        headers:{'Content-Type': 'application/json'}
                                })
                                        .then(handleResponse)
                                        .then((res)=>{
                                                sessionStorage.setItem('StrawberryToken', res.token);
                                                //this.props.history.push('/');
                                                window.location.href='/';
                                        })
                                        .catch((err)=>{
                                                console.error(err);
                                                alert(err.error);
                                        });
                        }
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
                                        {getFieldDecorator('username', {
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
                                        {getFieldDecorator('password', {
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
                                        {getFieldDecorator('passwordCheck', {
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
                                        {getFieldDecorator('email', {
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
                                        {getFieldDecorator('phone', {
                                                rules: [{
                                                        required: true, message: '请输入电话',
                                                },]
                                        })(
                                                <Input  prefix={<Icon type="phone"  />}  type='tel' placeholder="电话" />
                                        )}
                                </FormItem>
                                <FormItem style={{ marginBottom: 8 }}>
                                        {getFieldDecorator('agreement', {
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
                                        <Button type="primary" htmlType="submit" icon="user">注册</Button>&emsp;
                                        <Button htmlType="reset" onClick={this.handleReset} icon="reload">重置</Button>
                                </FormItem>
                        </Form>
                )
        }
}

export default withRouter(Form.create()(BasicSignUpForm)) ;
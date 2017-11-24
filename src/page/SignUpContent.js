/**
 * Created by Mason Jackson in Office on 2017/11/24.
 */
import React from 'react';
import {Card, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete} from 'antd';

import '../style/SignUpContent.scss';

const FormItem=Form.Item;
const Option=Select.Option;
const AutoCompleteOption= AutoComplete.Option;

class SignUpContent extends React.Component {
        constructor(){
                super();
        }

        checkPassword = (rule, value, callback) => {
                const form = this.props.form;
                if (value && value !== form.getFieldValue('password')) {
                        callback('两次输入的密码不一致!');
                } else {
                        callback();
                }
        }

        handleSubmit = (e) => {
                e.preventDefault();
                this.props.form.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                                console.log('Received values of form: ', values);
                        }
                });
        }

        handleReset=()=>{
                this.props.form.resetFields();
        }

        render(){
                const {getFieldDecorator} = this.props.form;
                return(
                        <article>
                                <Card title="注册新用户" className='signUpCard'>
                                        <Form onSubmit={this.handleSubmit}>
                                                <FormItem hasFeedback>
                                                        {getFieldDecorator('username', {
                                                                rules: [{
                                                                        required: true, message: '请输入用户名',
                                                                },{
                                                                        min:4, message: '用户名长度不得少于4位',
                                                                }],
                                                        })(
                                                                <Input  prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
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
                                                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
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
                                                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="确认密码" />
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
                                                                <Input  prefix={<Icon type="mail" style={{ fontSize: 13 }} />}  type='email' placeholder="电子邮箱" />
                                                        )}
                                                </FormItem>
                                                <FormItem hasFeedback>
                                                        {getFieldDecorator('phone', {
                                                                rules: [{
                                                                        required: true, message: '请输入电话',
                                                                },]
                                                        })(
                                                                <Input  prefix={<Icon type="phone" style={{ fontSize: 13 }} />}  type='tel' placeholder="电话" />
                                                        )}
                                                </FormItem>
                                                <FormItem style={{ marginBottom: 8 }}>
                                                        {getFieldDecorator('agreement', {
                                                                valuePropName: 'checked',
                                                        })(
                                                                <Checkbox>我已阅读 <a href="">使用协议</a></Checkbox>
                                                        )}
                                                </FormItem>
                                                <FormItem>
                                                        <Button type="primary" htmlType="submit">注册</Button>&emsp;
                                                        <Button htmlType="reset" onClick={this.handleReset}>重置</Button>
                                                </FormItem>
                                        </Form>
                                </Card>
                        </article>
                )
        }

}

export default Form.create()(SignUpContent);
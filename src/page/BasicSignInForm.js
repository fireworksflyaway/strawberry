/**
 * Created by Mason Jackson in Office on 2017/11/25.
 */
import React from 'react';
import {Form, Input, Button, Icon} from 'antd';

const FormItem=Form.Item;

class BasicSignInForm extends React.Component{
        constructor(){
                super();
        }

        getData(token){
                fetch('http://localhost:8090/auth/ppt',{
                        method:'get',
                        headers: {
                                'Authorization': 'Bearer ' + token
                        }
                })
                        .then(res=>res.text())
                        .then((res)=>{
                                console.log(res);
                        })
                        .catch((err)=>console.error(err));
        }

        handleSubmit=(e)=>{
                e.preventDefault();
                this.props.form.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                                console.log('Received values of form: ', values);
                                fetch('http://localhost:8090/login',{
                                        method:'post',
                                        body:JSON.stringify(values),
                                        headers:{'Content-Type': 'application/json'}
                                })
                                .then((res)=>res.json())
                                .then((res)=>{
                                        console.log(res);
                                        this.getData(res.token);
                                })
                                .catch((err)=>console.error(err));
                        }
                });
        }

        handleReset(){
                this.props.form.resetFields();
        }

        render(){
                const {getFieldDecorator} = this.props.form;
                return(
                        <Form onSubmit={this.handleSubmit}>
                                <FormItem hasFeedback>
                                        {getFieldDecorator('username', {
                                                rules: [{
                                                        required: true, message: '请输入用户名',
                                                }],
                                        })(
                                                <Input  prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
                                        )}
                                </FormItem>
                                <FormItem>
                                        {getFieldDecorator('password', {
                                                rules: [{
                                                        required: true, message: '请输入密码!'
                                                }],
                                        })(
                                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                                        )}
                                </FormItem>
                                <FormItem>
                                        <Button type="primary" htmlType="submit">登录</Button>&emsp;
                                        <Button htmlType="reset" onClick={this.handleReset}>重置</Button>
                                </FormItem>
                        </Form>
                )
        }
}

export default Form.create()(BasicSignInForm);
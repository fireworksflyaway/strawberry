/**
 * Created by Mason Jackson in Office on 2017/11/25.
 */
import React from 'react';
import {Form, Input, Button, Icon} from 'antd';
import {withRouter} from "react-router-dom";
import {sha256} from 'js-sha256';
import handleResponse from '../../function/handleResponse';
import provideConfig from '../../function/provideConfig';

const config=provideConfig();
const FormItem=Form.Item;

class BasicSignInForm extends React.Component{
        constructor(){
                super();
        }


        handleSubmit=(e)=>{
                e.preventDefault();
                this.props.form.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                                values.lan='zh';
                                values.password=sha256(values.password);
                                fetch(`${config.server}/login`,{
                                        method:'post',
                                        body:JSON.stringify(values),
                                        headers:{'Content-Type': 'application/json'}
                                })
                                .then(handleResponse)
                                .then((res)=>{
                                        sessionStorage.setItem('StrawberryToken', res.token);
                                        this.props.handleLogin(values.username);
                                        this.props.history.push('/');
                                })
                                .catch((err)=>{
                                        console.error(err);
                                        alert(err.error);
                                });
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
                                                <Input  prefix={<Icon type="user"  />} placeholder="用户名" />
                                        )}
                                </FormItem>
                                <FormItem>
                                        {getFieldDecorator('password', {
                                                rules: [{
                                                        required: true, message: '请输入密码!'
                                                }],
                                        })(
                                                <Input prefix={<Icon type="lock"  />} type="password" placeholder="密码" />
                                        )}
                                </FormItem>
                                <FormItem>
                                        <Button type="primary" htmlType="submit" icon="login">登录</Button>&emsp;
                                        <Button htmlType="reset" onClick={this.handleReset.bind(this)} icon="reload">重置</Button>
                                </FormItem>
                        </Form>
                )
        }
}

export default withRouter(Form.create()(BasicSignInForm));
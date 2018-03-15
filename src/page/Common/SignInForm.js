/**
 * Created by Mason Jackson in Office on 2017/11/25.
 */
import React from 'react';
import {Form, Input, Button, Icon, Modal} from 'antd';
import {withRouter} from "react-router-dom";
import {sha256} from 'js-sha256';
import handleResponse from '../../function/handleResponse';
import provideConfig from '../../function/provideConfig';
import provideErrorInfo from '../../function/provideErrorInfo';
import ForgetPasswordModal from './ForgetPasswordModal';

const config=provideConfig();
const errorInfo=provideErrorInfo();
const FormItem=Form.Item;
const lan='zh';

class SignInForm extends React.Component{
        constructor(){
                super();
                this.state={visible: false};
        }

        handleSubmit=(e)=>{
            e.preventDefault();
                this.props.form.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                                values.Password=sha256(values.Password);
                                console.log(this.props.type);
                                fetch(`${config.server}/${this.props.type}signin`,{
                                        method:'post',
                                        body:JSON.stringify(values),
                                        headers:{'Content-Type': 'application/json'}
                                })
                                .then(handleResponse)
                                .then((res)=>{
                                        sessionStorage.setItem('StrawberryToken', res.token);
                                        sessionStorage.setItem('StrawberryLoginType', this.props.type);
                                        //this.props.handleLogin(values.username, 'basic');
                                        //this.props.history.push('/');
                                        window.location.href='/';
                                })
                                .catch((err)=>{
                                        console.error(err);
                                        Modal.error({
                                                content:errorInfo[err][lan]
                                        })
                                });
                        }
                });
        }

        handleReset(){
                this.props.form.resetFields();
        }

        handleForgetPasswordLinkClick(e){
                e.preventDefault();
                this.setState({visible:true});
        }

        handleCloseForgetPasswordModal(){
                this.setState({visible: false});
        }

        render(){
                const {getFieldDecorator} = this.props.form;
                return(
                        <Form onSubmit={this.handleSubmit}>
                                <FormItem hasFeedback>
                                        {getFieldDecorator('Username', {
                                                rules: [{
                                                        required: true, message: '请输入用户名',
                                                }],
                                        })(
                                                <Input  prefix={<Icon type="user"  />} placeholder="用户名" />
                                        )}
                                </FormItem>
                                <FormItem>
                                        {getFieldDecorator('Password', {
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
                                        <a style={{float: 'right'}} onClick={this.handleForgetPasswordLinkClick.bind(this)}>忘记密码?</a>
                                        <ForgetPasswordModal visible={this.state.visible} onClose={this.handleCloseForgetPasswordModal.bind(this)} type={this.props.type} />
                                </FormItem>
                        </Form>
                )
        }
}

export default withRouter(Form.create()(SignInForm));
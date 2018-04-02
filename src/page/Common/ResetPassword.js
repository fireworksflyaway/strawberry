/**
 * Created by Mason Jackson in Office on 3/6/18.
 */
import React from 'react';
import {Form, Input, Button, Modal, Card} from 'antd';
import handleResponse from '../../function/handleResponse';
import config from '../../config';
import provideErrorInfo from '../../function/provideErrorInfo';
import '../../style/Common.scss';
import {sha256} from "js-sha256";
const errorInfo=provideErrorInfo();
const lan='zh';
class ResetPassword extends React.Component{
        constructor(){
                super();
                this.state={
                        username:'',
                        type:'',
                        resetAuth:''
                }
        }

        componentWillMount(){
                const searchUrl=decodeURI(window.location.search).substr(1);
                const type=searchUrl.split('&')[0].split('=')[1];
                const email=searchUrl.split('&')[1].split('=')[1];
                const resetAuth=searchUrl.split('&')[2].split('=')[1];

                const values={type, email, resetAuth};
                fetch(`${config.server}/ConfirmResetAuth`, {
                        method: 'post',
                        body: JSON.stringify(values),
                        headers:{'Content-Type': 'application/json'}
                })
                    .then(handleResponse)
                    .then((res)=>{
                            this.setState({username: res.username, type, resetAuth});
                    })
                    .catch((err)=>{
                            console.error(err);
                            Modal.error({
                                    content:errorInfo[err][lan],
                                    onOk:()=>{
                                            window.location.href='/';
                                    }
                            })
                    })
        }

        checkConfirm = (rule, value, callback) => {
                const form = this.props.form;
                if (value && value !== form.getFieldValue('password')) {
                        callback('两次输入的密码不一致!');
                } else {
                        callback();
                }
        }


        handleResetPassword(e){
                e.preventDefault();
                this.props.form.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                                values.username=this.state.username;
                                values.password=sha256(values.password);
                                values.type=this.state.type;
                                values.resetAuth=this.state.resetAuth;
                                delete values.confirm;
                                fetch(`${config.server}/ResetPassword`,{
                                        method:'post',
                                        body:JSON.stringify(values),
                                        headers:{'Content-Type': 'application/json'}
                                })
                                    .then(handleResponse)
                                    .then((res)=>{
                                            Modal.success({
                                                    content:'重置密码成功',
                                                    onOk:()=>{
                                                            window.location.href='/';
                                                    }
                                            })
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


        render(){
                let showType;
                switch (this.state.type){
                        case 'PE_': showType='体检版';break;
                        case 'Diagnose': showType='诊断版';break;
                        case 'Research': showType='科研版';break;
                        default: showType='异常';break;
                }
                const {getFieldDecorator} = this.props.form;
                const formItemLayout = {
                        labelCol: {
                                span: 8
                        },
                        wrapperCol: {
                                span: 14
                        },
                };
                return (
                        <article>
                                <Card title="重置密码" className='resetPasswordCard'>
                                        <Form onSubmit={this.handleResetPassword.bind(this)}>
                                                <Form.Item label='用户名:' {...formItemLayout}>
                                                        {`${this.state.username}`}
                                                </Form.Item>
                                                <Form.Item label='用户类型' {...formItemLayout}>
                                                        {`${showType}`}
                                                </Form.Item>
                                                <Form.Item label='新密码' {...formItemLayout}>
                                                        {getFieldDecorator('password', {
                                                                rules: [{
                                                                        required: true, message: '请输入密码!',
                                                                }, {
                                                                        min:6, message: '密码长度不得少于6位',
                                                                }],
                                                        })(
                                                            <Input type="password" />
                                                        )}
                                                </Form.Item>
                                                <Form.Item label='再次输入新密码' {...formItemLayout}>
                                                        {getFieldDecorator('confirm', {
                                                                rules: [{
                                                                        required: true, message: '请确认密码!',
                                                                }, {
                                                                        validator: this.checkConfirm,
                                                                }],
                                                        })(
                                                            <Input type="password"  />
                                                        )}
                                                </Form.Item>
                                                <Form.Item  wrapperCol={{ span: 8, offset: 8 }}>
                                                        <Button type="primary" htmlType="submit" icon='unlock'>重置密码</Button>
                                                </Form.Item>
                                        </Form>
                                </Card>
                        </article>
                )
        }

}

export default Form.create()(ResetPassword);
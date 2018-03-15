/**
 * Created by Mason Jackson in Office on 3/5/18.
 */
import React from 'react';
import {Modal} from 'antd';
import handleResponse from "../../function/handleResponse";
import provideErrorInfo from "../../function/provideErrorInfo";
import provideConfig from '../../function/provideConfig';
const config=provideConfig();
const errorInfo=provideErrorInfo();
const lan='zh';
export default class ForgetPasswordModal extends React.Component{
        constructor(){
                super();
                this.state={
                        email:''
                }
        }

        handleSubmit(){
                fetch(`${config.server}/ForgetPassword`, {
                        method:'post',
                        body: JSON.stringify({email:this.state.email, type:this.props.type}),
                        headers:{'Content-Type': 'application/json'}
                })
                    .then(handleResponse)
                    .then((res)=>{
                            Modal.success({
                                    content:'邮件已发送',
                                    onOk:()=>{
                                            this.handleClose();
                                    }
                            })
                    })
                    .catch((err)=>{
                            console.error(err);
                            Modal.error({
                                    content: errorInfo[err][lan],
                                    onOk:()=>{
                                            this.setState({email:''});
                                    }
                            })
                    })

        }

        handleClose(){
                this.setState({email:''});
                this.props.onClose();
        }

        handleEmailChange(e){
                this.setState({email: e.target.value});
        }

        render(){
                return (
                    <Modal title={'忘记密码?'} visible={this.props.visible} onOk={this.handleSubmit.bind(this)} onCancel={this.handleClose.bind(this)}>
                            <p>请输入注册用户的电子邮箱地址,我们将发送一封邮件帮助您重置密码</p>
                            <input placeholder='电子邮箱' value={this.state.email} onChange={this.handleEmailChange.bind(this)} style={{width: '100%'}} type='email'  />
                    </Modal>
                )
        }
}
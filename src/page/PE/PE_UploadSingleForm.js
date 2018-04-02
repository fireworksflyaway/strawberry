/**
 * Created by Mason Jackson in Office on 2017/12/7.
 */
import React from 'react';
import {Form,  Button, Icon, Input, message, Upload, InputNumber, DatePicker, Checkbox, Radio} from 'antd';
import config from '../../config';
import handleResponse from '../../function/handleResponse';
import {withRouter} from "react-router-dom";
import moment from 'moment';
const FormItem=Form.Item;
const RadioButton=Radio.Button;
const RadioGroup=Radio.Group;
const {TextArea}=Input;

class PE_UploadSingleForm extends React.Component{
        constructor(props){
                super(props);
                this.state={
                        isUpdating: false
                }
        }


        handleSubmit=(e)=>{
                e.preventDefault();
                this.setState({isUpdating: true});
                this.props.form.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                                console.log(values);

                                if(values.fileT1[0].status!=="done")
                                {
                                        message.error("请重新上传T1文件");
                                        this.setState({isUpdating: false});
                                        return;
                                }
                                if(values.fileT2!==undefined&&values.fileT2[0].status!=="done")
                                {
                                        message.error("请重新上传T2文件");
                                        this.setState({isUpdating: false});
                                        return;
                                }
                                let diseases='00';
                                if(values.diseases!==undefined)
                                {
                                        if(values.diseases.length===2)
                                                diseases='11';
                                        if(values.diseases.length===1)
                                        {
                                                if(values.diseases[0]==='高血压')
                                                        diseases='10';
                                                else
                                                        diseases='01';
                                        }
                                }


                                const data={
                                        p_name: values.p_name,
                                        p_age: values.p_age,
                                        p_gender: values.p_gender,
                                        testTime: values.testTime.format('YYYY-MM-DD'),
                                        operator: values.operator,
                                        device: values.device,
                                        diseases,
                                        t1: values.fileT1[0].name,
                                        t2: values.fileT2?values.fileT2[0].name:"",
                                        comment: values.comment
                                }
                                const token=sessionStorage.getItem('StrawberryToken');
                                console.log(data);

                                fetch(`${config.server}/PE_Auth/PE_uploadForm`,{
                                        method: 'post',
                                        body:JSON.stringify(data),
                                        headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': 'Bearer ' + token,
                                        }
                                })
                                        .then(handleResponse)
                                        .then((res)=>{
                                                message.success('任务提交成功');
                                            //this.props.history.push('/basicevent');
                                                window.location.href='/PE_Event';
                                        })
                                        .catch((err)=>{
                                                console.error(err);
                                                message.error('上传失败');
                                                this.setState({isUpdating: false});
                                        })
                        }
                        else
                                this.setState({isUpdating: false});
                })
        }

        normFile = (e) => {
                //console.log('Upload event:', e);
                if (Array.isArray(e)) {
                        return e;
                }
                return e && e.fileList;
        }

        handleChange=(info)=>{
                if(info.fileList.length>1)
                        info.fileList=info.fileList.slice(-1);
                if (info.file.status !== 'uploading') {
                        console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                        message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                        message.error(`${info.file.name} 上传失败`);
                }
        }

        render(){
                const {getFieldDecorator} = this.props.form;

                const formItemLayout = {
                        labelCol: { span: 8 },
                        wrapperCol: { span: 12 },
                };
                const tailFormItemLayout = {
                        wrapperCol: {
                                xs: {
                                        span: 24,
                                        offset: 0,
                                },
                                sm: {
                                        span: 14,
                                        offset: 8,
                                },
                        },
                };

                const T1Props = {
                        onChange: this.handleChange,
                        action: `${config.server}/PE_Auth/PE_uploadt1`,
                        accept: '.zip',
                        headers: {
                                //authorization: 'authorization-text',
                                'Authorization': 'Bearer ' + sessionStorage.getItem('StrawberryToken')
                        },
                };

                const T2Props = {
                        onChange: this.handleChange,
                        action: `${config.server}/PE_Auth/PE_uploadt2`,
                        accept: '.zip',
                        headers: {
                                'Authorization': 'Bearer ' + sessionStorage.getItem('StrawberryToken')
                        },
                };




                return (
                        <Form onSubmit={this.handleSubmit}>
                                <br />
                                <FormItem {...formItemLayout} label="姓名" hasFeedback>
                                        {getFieldDecorator('p_name', {
                                                rules: [{
                                                        required: true, message: '请输入患者姓名',
                                                }],
                                        })(
                                            <Input />
                                        )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="年龄" hasFeedback>
                                        {getFieldDecorator('p_age', {
                                                rules: [{
                                                        required: true, message: '请输入患者年龄',
                                                }],
                                        })(
                                            <InputNumber min={0} max={120} />
                                        )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="性别" hasFeedback>
                                        {getFieldDecorator('p_gender', {
                                                initialValue:"男"
                                        })(
                                            <RadioGroup>
                                                    <RadioButton value="男">男</RadioButton>
                                                    <RadioButton value="女">女</RadioButton>
                                            </RadioGroup>
                                        )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="检测时间" hasFeedback>
                                        {getFieldDecorator('testTime', {
                                                // rules: [{
                                                //         required: true, message: '请输入患者姓名',
                                                // }],
                                                initialValue: moment()
                                        })(
                                            <DatePicker  />
                                        )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="成像机构" hasFeedback>
                                        {getFieldDecorator('operator', {
                                                // rules: [{
                                                //         required: true, message: '请输入成像机构',
                                                // }],
                                        })(
                                            <Input />
                                        )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="扫描设备" hasFeedback>
                                        {getFieldDecorator('device', {
                                                // rules: [{
                                                //         required: true, message: '请输入扫描设备',
                                                // }],
                                        })(
                                            <Input />
                                        )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="疾病史" hasFeedback>
                                        {getFieldDecorator('diseases', {

                                        })(
                                            <Checkbox.Group options={['高血压','糖尿病']} />
                                        )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="上传T1W文件">
                                        {getFieldDecorator('fileT1', {
                                                valuePropName: 'fileList',
                                                getValueFromEvent: this.normFile,
                                                rules: [{required: true, message:'请先上传文件'}]
                                        })(
                                                <Upload {...T1Props}>
                                                        <Button>
                                                                <Icon type="upload" />点击上传文件（.zip格式)
                                                        </Button>
                                                </Upload>
                                        )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="上传FLAIR/T2W文件">
                                        {getFieldDecorator('fileT2', {
                                                valuePropName: 'fileList',
                                                getValueFromEvent: this.normFile
                                        })(
                                                <Upload {...T2Props}>
                                                        <Button>
                                                                <Icon type="upload" />点击上传文件（.zip格式)
                                                        </Button>
                                                </Upload>
                                        )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="医师备注">
                                        {
                                                getFieldDecorator('comment', {
                                                        // rules: [{
                                                        //         required: true, message: '请输入医师备注'
                                                        // }]
                                                })(
                                                        <TextArea style={{minHeight:'100px'}}/>
                                                )
                                        }
                                </FormItem>
                                <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" icon="rocket" htmlType="submit" loading={this.state.isUpdating}>提交任务</Button>
                                </FormItem>
                        </Form>
                )
        }
}

export default withRouter(Form.create()(PE_UploadSingleForm));
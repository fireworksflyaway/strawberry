/**
 * Created by Mason Jackson in Office on 2017/12/7.
 */
import React from 'react';
import {Form,  Button, Icon, Input, message, Upload, Select} from 'antd';
import config from '../../config';
import handleResponse from '../../function/handleResponse';
import {checkZipFormat, normFile, handleChange} from '../../function/fileFunctions';
import {withRouter} from "react-router-dom";
const FormItem=Form.Item;
const Option=Select.Option;
const {TextArea}=Input;

class DiagnoseUploadForm extends React.Component{
        constructor(props){
                super(props);
                this.state={
                        isUpdating: false,
                        disease: 'AD'
                }
        }


        handleSubmit=(e)=>{
                e.preventDefault();
                this.setState({isUpdating: true});
                this.props.form.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                                const {disease}=this.state;
                                if(values.fileT1W[0].status!=="done")
                                {
                                        message.error("请重新上传T1W文件");
                                        this.setState({isUpdating: false});
                                        return;
                                }
                                if(values.file2DT2!==undefined&&values.file2DT2[0].status!=="done")
                                {
                                        message.error("请重新上传2D T2文件");
                                        this.setState({isUpdating: false});
                                        return;
                                }
                                if(values.file3DT2!==undefined&&values.file3DT2[0].status!=="done")
                                {
                                        message.error("请重新上传3D T2文件");
                                        this.setState({isUpdating: false});
                                        return;
                                }
                                if(values.fileDWI!==undefined&&values.fileDWI[0].status!=="done")
                                {
                                        message.error("请重新上传2D T2文件");
                                        this.setState({isUpdating: false});
                                        return;
                                }
                                if(values.fileSWI!==undefined&&values.fileSWI[0].status!=="done")
                                {
                                        message.error("请重新上传2D T2文件");
                                        this.setState({isUpdating: false});
                                        return;
                                }
                                const data={
                                        T1W: values.fileT1W[0].name,
                                        disease,
                                        comment: values.comment,
                                        _2DT2: '',
                                        _3DT2: '',
                                        DWI: '',
                                        SWI: ''
                                }
                                switch (disease){
                                        case 'AD':{
                                                data._2DT2=values.file2DT2?values.file2DT2[0].name:"";
                                                break;
                                        }
                                        case 'VD':{
                                                data._2DT2=values.file2DT2?values.file2DT2[0].name:"";
                                                data._DWI=values.fileDWI?values.fileDWI[0].name:"";
                                                data._SWI=values.fileSWI?values.fileSWI[0].name:"";
                                                break;
                                        }
                                        case 'SVD':{
                                                data._2DT2=values.file2DT2?values.file2DT2[0].name:"";
                                                data._DWI=values.fileDWI?values.fileDWI[0].name:"";
                                                data._SWI=values.fileSWI?values.fileSWI[0].name:"";
                                                break;
                                        }
                                        case 'FD':{
                                                break;
                                        }
                                        case 'MS':{
                                                data._3DT2=values.file3DT2?values.file3DT2[0].name:"";
                                                break;
                                        }
                                        case 'PK':{
                                                break;
                                        }
                                        case 'PSBC':{
                                                data._2DT2=values.file2DT2?values.file2DT2[0].name:"";
                                                data._DWI=values.fileDWI?values.fileDWI[0].name:"";
                                                data._SWI=values.fileSWI?values.fileSWI[0].name:"";
                                                break;
                                        }
                                }



                                const token=sessionStorage.getItem('StrawberryToken');

                                fetch(`${config.server}/DiagnoseAuth/DiagnoseEvent`,{
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
                                                window.location.href='/DiagnoseEvent';
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

        handleSelectChange=(value)=>{
                this.setState({disease: value})
        }

        render(){
                const {getFieldDecorator} = this.props.form;
                const formItemLayout = {
                        labelCol: { span: 6 },
                        wrapperCol: { span: 14 },
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

                const propsT1W = {
                        onChange: handleChange,
                        action: `${config.server}/DiagnoseAuth/T1W`,
                        accept: '.zip',
                        beforeUpload: checkZipFormat,
                        headers: {
                                //authorization: 'authorization-text',
                                'Authorization': 'Bearer ' + sessionStorage.getItem('StrawberryToken')
                        },
                };

                const props2DT2 = {
                        onChange: handleChange,
                        action: `${config.server}/DiagnoseAuth/2DT2`,
                        accept: '.zip',
                        beforeUpload: checkZipFormat,
                        headers: {
                                'Authorization': 'Bearer ' + sessionStorage.getItem('StrawberryToken')
                        },
                };

                const props3DT2 = {
                        onChange: handleChange,
                        action: `${config.server}/DiagnoseAuth/3DT2`,
                        accept: '.zip',
                        beforeUpload: checkZipFormat,
                        headers: {
                                'Authorization': 'Bearer ' + sessionStorage.getItem('StrawberryToken')
                        },
                };

                const propsDWI = {
                        onChange: handleChange,
                        action: `${config.server}/DiagnoseAuth/DWI`,
                        accept: '.zip',
                        beforeUpload: checkZipFormat,
                        headers: {
                                'Authorization': 'Bearer ' + sessionStorage.getItem('StrawberryToken')
                        },
                };

                const propsSWI = {
                        onChange: handleChange,
                        action: `${config.server}/DiagnoseAuth/SWI`,
                        accept: '.zip',
                        beforeUpload: checkZipFormat,
                        headers: {
                                'Authorization': 'Bearer ' + sessionStorage.getItem('StrawberryToken')
                        },
                };

                const diseaseTable={
                        AD: [0,1],
                        VD:[0,1,3,4],
                        SVD:[0,1,3,4],
                        FD:[0],
                        MS:[0,2],
                        PK:[0],
                        PSBC:[0,1,3,4],
                };

                const renderUploadButtons=[
                        <FormItem {...formItemLayout} label="上传3D T1W文件">
                                {getFieldDecorator('fileT1W', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: normFile,
                                        rules: [{required: true, message:'请先上传文件'}]
                                })(
                                    <Upload {...propsT1W}>
                                            <Button>
                                                    <Icon type="upload" />点击上传文件（.zip格式)
                                            </Button>
                                    </Upload>
                                )}
                        </FormItem>,
                        <FormItem {...formItemLayout} label="上传2D T2 FLAIR文件">
                                {getFieldDecorator('file2DT2', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: normFile
                                })(
                                    <Upload {...props2DT2}>
                                            <Button>
                                                    <Icon type="upload" />点击上传文件（.zip格式)
                                            </Button>
                                    </Upload>
                                )}
                        </FormItem>,
                        <FormItem {...formItemLayout} label="上传3D T2 FLAIR文件">
                                {getFieldDecorator('file3DT2', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: normFile
                                })(
                                    <Upload {...props3DT2}>
                                            <Button>
                                                    <Icon type="upload" />点击上传文件（.zip格式)
                                            </Button>
                                    </Upload>
                                )}
                        </FormItem>,
                        <FormItem {...formItemLayout} label="上传DWI文件">
                                {getFieldDecorator('fileDWI', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: normFile
                                })(
                                    <Upload {...propsDWI}>
                                            <Button>
                                                    <Icon type="upload" />点击上传文件（.zip格式)
                                            </Button>
                                    </Upload>
                                )}
                        </FormItem>,
                        <FormItem {...formItemLayout} label="上传SWI文件">
                                {getFieldDecorator('fileSWI', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: normFile
                                })(
                                    <Upload {...propsSWI}>
                                            <Button>
                                                    <Icon type="upload" />点击上传文件（.zip格式)
                                            </Button>
                                    </Upload>
                                )}
                        </FormItem>
                ]

                const realRenderItems=[];
                diseaseTable[this.state.disease].forEach(v=>{realRenderItems.push(renderUploadButtons[v])});

                return (
                        <Form onSubmit={this.handleSubmit}>
                                <br />
                                <FormItem{...formItemLayout} label="请选择诊断疾病">
                                        {getFieldDecorator('disease', {
                                                rules: [{
                                                        required: true, message: '请先选择诊断疾病'
                                                }],
                                                initialValue: this.state.disease
                                        })(
                                                <Select onChange={this.handleSelectChange}>
                                                        <Option value="AD">阿尔兹海默（Alzheimer's Disease）</Option>
                                                        <Option value="VD">血管性痴呆（Vascular Dementia）</Option>
                                                        <Option value="SVD" >小血管病变（Small Vessel Disease）</Option>
                                                        <Option value="FD">额颞叶痴呆 （Frontotemporal Dementia）</Option>
                                                        <Option value="MS">多发性硬化症（Multiple Scelosis）</Option>
                                                        <Option value="PK" >帕金森综合症（Parkinsonism）</Option>
                                                        <Option value="PSBC">中风后脑改变（Post-Stroke Brain Changes）</Option>
                                                </Select>
                                        )}
                                </FormItem>
                                {realRenderItems}
                                <FormItem {...formItemLayout} label="医师备注">
                                        {
                                                getFieldDecorator('comment', {
                                                        rules: [{
                                                                // required: true, message: '请输入医师备注'
                                                        }]
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

export default withRouter(Form.create()(DiagnoseUploadForm));
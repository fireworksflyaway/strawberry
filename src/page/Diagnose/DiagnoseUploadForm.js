/**
 * Created by Mason Jackson in Office on 2017/12/7.
 */
import React from 'react';
import {Form,  Button, Icon, Input, message, Upload, Select} from 'antd';
import provideConfig from '../../function/provideConfig';
import handleResponse from '../../function/handleResponse';
import {withRouter} from "react-router-dom";
const FormItem=Form.Item;
const Option=Select.Option;
const {TextArea}=Input;

const config=provideConfig();
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
                                const data={
                                        t1: values.fileT1[0].name,
                                        t2: values.fileT2?values.fileT2[0].name:"",
                                        comment: values.comment
                                }
                                const token=sessionStorage.getItem('StrawberryToken');

                                fetch(`${config.server}/basicAuth/basicuploadform`,{
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
                                                window.location.href='/basicevent';
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

                const T1Props = {
                        onChange: this.handleChange,
                        action: `${config.server}/basicAuth/basicuploadt1`,
                        accept: '.zip',
                        headers: {
                                //authorization: 'authorization-text',
                                'Authorization': 'Bearer ' + sessionStorage.getItem('StrawberryToken')
                        },
                };

                const T2Props = {
                        onChange: this.handleChange,
                        action: `${config.server}/basicAuth/basicuploadt2`,
                        accept: '.zip',
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
                        </FormItem>,
                        <FormItem {...formItemLayout} label="上传2D T2 FLAIR文件">
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
                        </FormItem>,
                        <FormItem {...formItemLayout} label="上传3D T2 FLAIR文件">
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
                        </FormItem>,
                        <FormItem {...formItemLayout} label="上传DWI文件">
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
                        </FormItem>,
                        <FormItem {...formItemLayout} label="上传SWI文件">
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
                                                                required: true, message: '请输入医师备注'
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
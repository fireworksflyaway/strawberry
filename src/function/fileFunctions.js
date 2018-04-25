import {message} from "antd/lib/index";

/**
 * Created by Mason Jackson in Office on 18-4-25.
 */
export function checkZipFormat(file, fileList){
        if(!(file.type===`application/zip`||file.type===`application/x-zip-compressed`)){
                message.error(`请上传zip格式文件`);
                fileList.splice(0,fileList.length);
                return false;
        }
        return true;
}

export function normFile(e) {
        if (Array.isArray(e)) {
                return e;
        }
        return e && e.fileList;
}

export function handleChange(info){
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
import React, { useState } from 'react';
import { Button, ConfigProvider, DatePicker, Form, Input, message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from 'antd';

import locale from 'antd/locale/ru_RU';
import dayjs from 'dayjs';

import 'dayjs/locale/ru';

locale = dayjs.locale('ru_RU') 


const { Text } = Typography;

const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    console.log(e.fileList.name)
    return e?.fileList;
  };
const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const UploadExcel = ({}) => {
  const { id } = useParams();

  const [form] = Form.useForm();
  let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
  const navigate = useNavigate();

function generateRandomKey() {
  var r='', l=0;
  do {
       r += Math.random().toString(16).replace(/[01]\./g, '');
  } while (r.length < 32 && l++ < 32);
  return r.substr(-32, 32);
};
  let saveImage = (info) => {
    
    setFileName(info.file.name);
    console.log(fileName)
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} сохранен`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} не удалось сохранить.`);
    }
  }
  const [fileName, setFileName] = useState('')
  const [randomKey, setRandomKey] = useState('')

  return <div style={{margin: 10}}>
    <Text strong>Загрузить данные из Excel</Text>
    <Form
    form={form}
    
    name="basic"
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item label=".xlsx файл" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload beforeUpload={()=> {setRandomKey(generateRandomKey)}} name={'file'} data={{'uid': randomKey}} headers={{
                'Authorization': 'Bearer ' + authTokens.access
            }} onChange={saveImage} action={process.env.REACT_APP_API_URL + "uploadExcel"} listType="picture-card" maxCount={1}>
            <button
              style={{
                border: 0,
                background: 'none',
              }}
              type="button"
            >
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Загрузить с устройства
              </div>
            </button>
          </Upload>
        </Form.Item>
  </Form>
  </div>
};
export default UploadExcel;

import React, { useState } from 'react';
import { Button, Form, Input, message, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RetweetOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Text } = Typography;
const onFinishFailed = (errorInfo) => {
  console.log('Ошибка:', errorInfo);
};

const AddUser = () => {
  const [form] = Form.useForm();
  let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
  const navigate = useNavigate();

  let createUser = async ()=> {
    try {
        let response = await fetch(process.env.REACT_APP_API_URL + "addUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access
            },
            body:JSON.stringify({'login': form.getFieldValue("log"), 'password': form.getFieldValue("pass"), 'is_staff': form.getFieldValue("is_staff")})
        })
        const jsonData = await response.json();
        if(jsonData === "Error"){
            console.log('Error create user')
        }else{
          console.log(jsonData)
          navigate('/settings')
          message.open({
            type: 'success',
            content: 'Пользователь создан',
          });
        }
        
    } catch (e) {
        console.log(e);
    }
}
    const generatePassword = () => {
        const password = Math.random().toString(36).slice(-8);
        navigator.clipboard.writeText(password)
        form.setFieldValue('pass', password)
        form.validateFields(['pass'])
        message.open({
            type: 'info',
            content: 'Пароль скопирован в буфер обмена',
          });
    }
  return <div style={{margin: 10}}>
  <Text strong>Создать новую учетную запись</Text>
  <Form
    form={form}
    style={{margin: 10}}
    name="basic"
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
        hasFeedback
        label="Логин"
        name="log"
        rules={[
            {
            min: 3,
            message: 'Минимальная длина логина - 3 символа',
            },
            {
            required: true,
            message: 'Укажите логин для пользователя',
            },
        ]}
    >
        <Input />
    </Form.Item>

    <Form.Item
        hasFeedback
        label={<div>Пароль <Button onClick={generatePassword} type="dashed" icon={<RetweetOutlined/>}/></div>}
        name="pass"
        validateDebounce={1000}
        rules={[
            {
            min: 8,
            message: 'Пароль должен содержать не менее 8 символов',
            },
            {
                required: true,
            },
        ]}
    >
        <Input.Password />
    </Form.Item>
    <Form.Item label="Администратор" name='is_staff' valuePropName="checked">
      <Switch />
    </Form.Item>
    <Form.Item label={null}>
      <Button onClick={createUser} type="primary" htmlType="submit">
        Создать
      </Button>
    </Form.Item>
  </Form>
  </div>
};
export default AddUser;

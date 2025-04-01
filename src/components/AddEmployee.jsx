import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';

const { Text } = Typography;
const onFinishFailed = (errorInfo) => {
  console.log('Ошибка:', errorInfo);
};

const AddEmployee = () => {
  const [form] = Form.useForm();
  let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
  const navigate = useNavigate();

  let createEmployee = async ()=> {
    try {
        let response = await fetch(process.env.REACT_APP_API_URL + "addEmployee", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access
            },
            body:JSON.stringify({'name': form.getFieldValue("name")})
        })
        const jsonData = await response.json();
        if(jsonData === "Error"){
            console.log('Error create employee')
        }else{
          console.log(jsonData)
          navigate('/employees')
        }
        
    } catch (e) {
        console.log(e);
    }
}
  return <div style={{margin: 10}}>
        <Text strong>Добавить сотрудника</Text>
        <Form
    form={form}
    style={{margin: 10}}
    name="basic"
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="ФИО"
      name="name"
      rules={[
        {
          required: true,
          message: 'Укажите ФИО!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item label={null}>
      <Button onClick={createEmployee} type="primary" htmlType="submit">
        Сохранить
      </Button>
    </Form.Item>
  </Form>
  </div>
};
export default AddEmployee;
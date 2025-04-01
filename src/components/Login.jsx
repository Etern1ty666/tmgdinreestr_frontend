import React from 'react';
import { Button, Checkbox, Form, Input, Space } from 'antd';
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import AuthContext from '../context/AuthProvider'
import { jwtDecode } from "jwt-decode";
import ThemeSwitch from '../components/ThemeSwitch';

const Login = () => {

    let {loginUser} = useContext(AuthContext)

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)

    const redirect_numbers = event => {
        navigate('/employees');
        event.preventDefault();
    }
    let login_user = async (e )=> {
        console.log(123, e);
        console.log(login);
        let response = await fetch(process.env.REACT_APP_API_URL + 'api/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':e.username, 'password':e.password})
        })
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
	    window.location.reload()
        }else{
            alert('Проверьте имя пользователя или пароль.')
        }
    }
    const onFinish = (values) => {
        console.log('Success:', values);
      };
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
    return(
        <div >
        <Form
        name="basic"
        labelCol={{
            span: 8,
        }}
        wrapperCol={{
            span: 16,
        }}
        style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 600,
        }}
        onFinish={login_user}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
        <Form.Item
            label="Логин"
            name="username"
            rules={[
                {
                    message: 'Введите имя пользователя',
                },
            ]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="Пароль"
            name="password"
            rules={[
                {
                    message: 'Введите пароль',
                },
            ]}
        >
            <Input.Password />
        </Form.Item>

        <Form.Item
            wrapperCol={{
                offset: 8,
                span: 16,
            }}
        >
            <Button type="primary" htmlType="submit">
                Войти
            </Button>
        </Form.Item>
    </Form>
    </div>
    )
};

export default Login;

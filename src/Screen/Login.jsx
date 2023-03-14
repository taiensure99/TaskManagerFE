import React, { Component } from 'react'
import 'antd/dist/antd.css';
import './index.css';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '../api/axios';
import Task from './Task';
import TableData from '../components/TableData';
import { message } from 'antd';


export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { isLogin: false };
      } 

    componentDidMount =()=>{
        // api.get('/User/GetAll').then((res)=>{
        //     debugger;
        // })
    }



    onFinish = values => {
        api.post('/User/Login', values).then((res)=>{
            localStorage.setItem('user', JSON.stringify(res.user));
            localStorage.setItem('token', res.data.accessToken);
            this.setState({isLogin:true})
        })
      };

      loginApp =()=>{
        this.setState({isLogin:false})
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    
    

  render() {
    return (
        this.state.isLogin?(<Task login={this.loginApp}/>):(<>
            <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="userName"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập UserName!',
                },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Password!',
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
             
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
            </Form.Item>
          </Form></>)
        
    )
  }
}

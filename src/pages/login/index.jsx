import { Button, Checkbox, Form, Input, message, Radio } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.less';
import request from '../../utils/request';
import { useSelector, useDispatch } from 'react-redux';
import { handleLogin, setType, setName } from '../../app/globalSlice';
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState('login');
  const onFinish = async (data) => {
    const { username, password } = data;
    const params = { username, password };
    axios
      .post('api/user/login', params)
      .then(({ data }) => {
        console.log(data);
        localStorage.setItem('type', data.data.type);
        localStorage.setItem('name', data.data.username);
        localStorage.setItem('userid', data.data.id);
        if (data.success) {
          message.success('登录成功');
          dispatch(handleLogin());
          dispatch(setName(params.username));
          dispatch(setType(data.data.type));
          navigate('/');
        } else {
          message.error(data.message);
        }
      })
      .catch((err) => {
        message.error(err.response.data.msg);
      });
  };
  const onRegisterFinish = async (data) => {
    const { username, password, type } = data;
    console.log('注册data', data);
    axios
      .post('api/user/registry', data)
      .then(({ data }) => {
        if (data.success) {
          message.success('注册成功，请登录');
        } else {
          message.error(data.message);
        }
      })
      .catch((err) => {
        message.error(err.response.data.msg);
      });
  };
  const onFinishFailed = (data) => {
    console.log(data);
  };
  const handleRegister = () => {};
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <div className="login-content">
      <Radio.Group
        defaultValue={value}
        value={value}
        onChange={handleChange}
        size="large"
        className="changeType"
      >
        <Radio.Button value="login">登录</Radio.Button>
        <Radio.Button value="register">注册</Radio.Button>
      </Radio.Group>
      {value === 'login' ? (
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
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
              登录
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onRegisterFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="选择角色"
            name="type"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Radio.Group>
              <Radio value="2"> 进攻者 </Radio>
              <Radio value="3"> 防御者 </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              注册
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { 
  UserOutlined, 
  LockOutlined, 
  KeyOutlined,
  MailOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography,
  message,
  Checkbox
} from 'antd';
import type { FormProps } from 'antd';

const { Title } = Typography;

type FieldType = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  invitationCode?: string;
};

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Received values:', values);
    setLoading(true);
    
    // 模拟注册请求
    setTimeout(() => {
      setLoading(false);
      message.success('注册成功！');
      // 这里应该跳转到登录页面
    }, 1000);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400, borderRadius: 8 }} bordered={false}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ 
            width: 64, 
            height: 64, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <UserAddOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
          <Title level={3}>实时聊天平台</Title>
          <p>创建您的账户</p>
        </div>
        
        <Form
          name="register_form"
          onFinish={onFinish}
        >
          <Form.Item<FieldType>
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符!' },
              { max: 20, message: '用户名最多20个字符!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item<FieldType>
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址!' },
              { type: 'email', message: '请输入有效的邮箱地址!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱地址"
              size="large"
            />
          </Form.Item>
          
          <Form.Item<FieldType>
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符!' }
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          
          <Form.Item<FieldType>
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: '请确认密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
              size="large"
            />
          </Form.Item>
          
          {showInvitation && (
            <Form.Item<FieldType>
              name="invitationCode"
              rules={[{ required: true, message: '请输入邀请码!' }]}
            >
              <Input
                prefix={<KeyOutlined />}
                placeholder="邀请码"
                size="large"
              />
            </Form.Item>
          )}
          
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { 
                validator: (_, value) => 
                  value ? Promise.resolve() : Promise.reject(new Error('请同意用户协议和隐私政策!')) 
              }
            ]}
          >
            <Checkbox>
              我已阅读并同意 <a href="#">用户协议</a> 和 <a href="#">隐私政策</a>
            </Checkbox>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              loading={loading}
              block
              icon={<UserAddOutlined />}
            >
              注册
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <a href="/login">已有账户？立即登录</a>
            <span> | </span>
            <a 
              onClick={() => setShowInvitation(!showInvitation)}
            >
              {showInvitation ? '隐藏邀请码' : '需要邀请码?'}
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
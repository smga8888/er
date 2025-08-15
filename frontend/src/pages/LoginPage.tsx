import React, { useState } from 'react';
import { 
  LockOutlined, 
  UserOutlined, 
  KeyOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { 
  Form, 
  Input, 
  Button, 
  Checkbox, 
  Card, 
  Typography,
  message
} from 'antd';
import type { FormProps } from 'antd';

const { Title } = Typography;

type FieldType = {
  username?: string;
  password?: string;
  invitationCode?: string;
  remember?: boolean;
};

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Received values:', values);
    setLoading(true);
    
    // 模拟登录请求
    setTimeout(() => {
      setLoading(false);
      message.success('登录成功！');
      // 这里应该跳转到主页面
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
            <LockOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
          <Title level={3}>实时聊天平台</Title>
          <p>登录您的账户</p>
        </div>
        
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
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
          
          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>记住我</Checkbox>
            <a 
              style={{ float: 'right' }} 
              onClick={() => setShowInvitation(!showInvitation)}
            >
              {showInvitation ? '隐藏邀请码' : '需要邀请码?'}
            </a>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              loading={loading}
              block
              icon={<LoginOutlined />}
            >
              登录
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <a href="/register">还没有账户？立即注册</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
import React, { useState } from 'react';
import { 
  UserOutlined, 
  CameraOutlined, 
  EditOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { 
  Card, 
  Avatar, 
  Button, 
  Form, 
  Input, 
  Upload,
  message,
  Space,
  Typography
} from 'antd';
import type { UploadProps } from 'antd';

const { Title, Text } = Typography;

interface ProfileData {
  username: string;
  email: string;
  bio: string;
  avatarUrl?: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    username: 'admin',
    email: 'admin@example.com',
    bio: '这是一个默认的个人简介',
    avatarUrl: undefined
  });
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = (values: ProfileData) => {
    setLoading(true);
    // 模拟保存操作
    setTimeout(() => {
      setProfile(values);
      setEditing(false);
      setLoading(false);
      message.success('个人信息已更新');
    }, 1000);
  };

  const uploadProps: UploadProps = {
    name: 'avatar',
    action: '/api/upload/avatar',
    headers: {
      authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
        // 更新头像URL
        setProfile({
          ...profile,
          avatarUrl: info.file.response.url
        });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      padding: '24px',
      minHeight: '100vh'
    }}>
      <Card style={{ width: '100%', maxWidth: 800 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              size={128}
              icon={<UserOutlined />}
              src={profile.avatarUrl}
              style={{ 
                border: '4px solid #f0f0f0',
                backgroundColor: '#f0f0f0'
              }}
            />
            <Upload {...uploadProps}>
              <Button 
                type="primary" 
                icon={<CameraOutlined />} 
                size="small"
                style={{ 
                  position: 'absolute', 
                  bottom: 8, 
                  right: 8,
                  borderRadius: '50%'
                }}
              />
            </Upload>
          </div>
          <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>
            {profile.username}
          </Title>
          <Text type="secondary">{profile.email}</Text>
        </div>

        <Card title="个人信息" extra={
          <Button 
            icon={editing ? <SaveOutlined /> : <EditOutlined />}
            onClick={() => editing ? null : setEditing(true)}
            type={editing ? 'primary' : 'default'}
          >
            {editing ? '保存' : '编辑'}
          </Button>
        }>
          <Form
            layout="vertical"
            initialValues={profile}
            onFinish={handleSave}
            disabled={!editing}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input placeholder="用户名" />
            </Form.Item>
            
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱!' },
                { type: 'email', message: '请输入有效的邮箱地址!' }
              ]}
            >
              <Input placeholder="邮箱地址" />
            </Form.Item>
            
            <Form.Item
              label="个人简介"
              name="bio"
            >
              <Input.TextArea 
                placeholder="个人简介" 
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
            
            {editing && (
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    保存更改
                  </Button>
                  <Button 
                    onClick={() => setEditing(false)}
                  >
                    取消
                  </Button>
                </Space>
              </Form.Item>
            )}
          </Form>
        </Card>

        <Card title="账户安全" style={{ marginTop: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button block>修改密码</Button>
            <Button block>绑定手机</Button>
            <Button block>绑定邮箱</Button>
          </Space>
        </Card>
      </Card>
    </div>
  );
};

export default ProfilePage;
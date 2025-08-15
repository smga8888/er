import React, { useState } from 'react';
import { 
  UserOutlined, 
  MessageOutlined, 
  TeamOutlined, 
  KeyOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import { 
  Layout, 
  Menu, 
  Table, 
  Button, 
  Card, 
  Typography, 
  Tabs,
  Tag,
  Space,
  Avatar
} from 'antd';
import type { TableProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

// 用户数据类型
interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isVIP: boolean;
  status: 'online' | 'offline';
  joinDate: string;
}

// 消息数据类型
interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: string;
  status: 'normal' | 'deleted';
}

// 群组数据类型
interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
}

// 邀请码数据类型
interface InvitationCode {
  id: string;
  code: string;
  createdBy: string;
  createdAt: string;
  used: boolean;
  usedBy?: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      isAdmin: true,
      isVIP: true,
      status: 'online',
      joinDate: '2023-01-01'
    },
    {
      id: '2',
      username: 'user1',
      email: 'user1@example.com',
      isAdmin: false,
      isVIP: false,
      status: 'offline',
      joinDate: '2023-02-15'
    }
  ]);
  
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'user1',
      content: 'Hello everyone!',
      timestamp: '2023-03-01 10:30:00',
      type: 'text',
      status: 'normal'
    }
  ]);
  
  const [groups] = useState<Group[]>([
    {
      id: '1',
      name: '公共群聊',
      description: '默认公共群聊',
      memberCount: 12,
      createdAt: '2023-01-01'
    }
  ]);
  
  const [invitationCodes] = useState<InvitationCode[]>([
    {
      id: '1',
      code: 'INVITE123',
      createdBy: 'admin',
      createdAt: '2023-03-01',
      used: false
    }
  ]);

  // 用户表格列定义
  const userColumns: TableProps<User>['columns'] = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'online' | 'offline') => (
        <Tag color={status === 'online' ? 'green' : 'gray'}>
          {status === 'online' ? '在线' : '离线'}
        </Tag>
      )
    },
    {
      title: '加入时间',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button icon={<EditOutlined />} size="small">编辑</Button>
          <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
        </Space>
      ),
    },
  ];

  // 消息表格列定义
  const messageColumns: TableProps<Message>['columns'] = [
    {
      title: '发送者',
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'normal' | 'deleted') => (
        <Tag color={status === 'normal' ? 'blue' : 'red'}>
          {status === 'normal' ? '正常' : '已删除'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button icon={<EditOutlined />} size="small">编辑</Button>
          <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
        </Space>
      ),
    },
  ];

  // 群组表格列定义
  const groupColumns: TableProps<Group>['columns'] = [
    {
      title: '群组名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '成员数',
      dataIndex: 'memberCount',
      key: 'memberCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button icon={<EditOutlined />} size="small">编辑</Button>
          <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
        </Space>
      ),
    },
  ];

  // 邀请码表格列定义
  const invitationColumns: TableProps<InvitationCode>['columns'] = [
    {
      title: '邀请码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '状态',
      dataIndex: 'used',
      key: 'used',
      render: (used: boolean) => (
        <>
          <Tag color={used ? 'red' : 'green'}>
            {used ? '已使用' : '未使用'}
          </Tag>
        </>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <Menu
          mode="inline"
          defaultSelectedKeys={['users']}
          selectedKeys={[activeTab]}
          items={[
            {
              key: 'users',
              icon: <UserOutlined />,
              label: '用户管理',
            },
            {
              key: 'messages',
              icon: <MessageOutlined />,
              label: '消息管理',
            },
            {
              key: 'groups',
              icon: <TeamOutlined />,
              label: '群组管理',
            },
            {
              key: 'invitations',
              icon: <KeyOutlined />,
              label: '邀请码管理',
            },
          ]}
          onClick={({ key }) => setActiveTab(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px' }}>
          <Title level={3} style={{ lineHeight: '64px', margin: 0 }}>
            管理面板
          </Title>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="用户管理" key="users">
              <Card 
                title="用户列表" 
                extra={
                  <Button type="primary" icon={<PlusOutlined />}>
                    添加用户
                  </Button>
                }
              >
                <Table 
                  dataSource={users} 
                  columns={userColumns} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </TabPane>
            
            <TabPane tab="消息管理" key="messages">
              <Card 
                title="消息列表" 
                extra={
                  <Button type="primary" icon={<PlusOutlined />}>
                    发送系统消息
                  </Button>
                }
              >
                <Table 
                  dataSource={messages} 
                  columns={messageColumns} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </TabPane>
            
            <TabPane tab="群组管理" key="groups">
              <Card 
                title="群组列表" 
                extra={
                  <Button type="primary" icon={<PlusOutlined />}>
                    创建群组
                  </Button>
                }
              >
                <Table 
                  dataSource={groups} 
                  columns={groupColumns} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </TabPane>
            
            <TabPane tab="邀请码管理" key="invitations">
              <Card 
                title="邀请码列表" 
                extra={
                  <Button type="primary" icon={<PlusOutlined />}>
                    生成邀请码
                  </Button>
                }
              >
                <Table 
                  dataSource={invitationCodes} 
                  columns={invitationColumns} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
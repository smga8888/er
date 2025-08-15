import React, { useState } from 'react';
import { Menu, Button, Avatar, Badge } from 'antd';
import {
  UserOutlined,
  MessageOutlined,
  TeamOutlined,
  SettingOutlined,
  SearchOutlined,
  PlusOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      icon: <MessageOutlined />,
      label: '公共群聊',
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: '好友列表',
      children: [
        {
          key: '2-1',
          label: '在线好友 (2)',
          children: [
            { key: '2-1-1', label: '张三' },
            { key: '2-1-2', label: '李四' },
          ],
        },
        {
          key: '2-2',
          label: '离线好友 (1)',
          children: [
            { key: '2-2-1', label: '王五' },
          ],
        },
      ],
    },
    {
      key: '3',
      icon: <TeamOutlined />,
      label: '群组列表',
      children: [
        { key: '3-1', label: '项目讨论组' },
        { key: '3-2', label: '技术交流群' },
      ],
    },
    {
      key: '4',
      icon: <SettingOutlined />,
      label: '个人设置',
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部用户信息 */}
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge dot>
              <Avatar size="large" icon={<UserOutlined />} />
            </Badge>
            <div style={{ marginLeft: 12 }}>
              <div style={{ fontWeight: 'bold' }}>用户名</div>
              <div style={{ fontSize: '12px', color: '#888' }}>在线</div>
            </div>
          </div>
          <Button 
            type="text" 
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
            onClick={toggleCollapse}
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      {/* 搜索框 */}
      <div style={{ padding: '8px 16px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#f0f0f0', 
          borderRadius: '16px',
          padding: '4px 12px'
        }}>
          <SearchOutlined />
          <input 
            placeholder="搜索好友/群组" 
            style={{ 
              border: 'none', 
              background: 'transparent', 
              marginLeft: '8px',
              width: '100%',
              outline: 'none'
            }} 
          />
        </div>
      </div>

      {/* 菜单 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Menu 
          mode="inline" 
          defaultSelectedKeys={['1']} 
          defaultOpenKeys={['2', '3']}
          items={items}
          inlineCollapsed={collapsed}
        />
      </div>

      {/* 底部按钮 */}
      <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          block
          style={{ marginBottom: '8px' }}
        >
          添加好友
        </Button>
        <Button 
          icon={<SettingOutlined />} 
          block
        >
          系统设置
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
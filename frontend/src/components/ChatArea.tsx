import React, { useState, useRef } from 'react';
import { 
  SendOutlined, 
  PaperClipOutlined, 
  SmileOutlined, 
  MoreOutlined,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Input, Button, Avatar, Badge, Dropdown } from 'antd';
import type { InputRef } from 'antd';
import type { MenuProps } from 'antd';

const { TextArea } = Input;

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'video' | 'file';
  isOwn: boolean;
}

const ChatArea: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: '张三',
      content: '大家好，欢迎来到公共聊天室！',
      timestamp: '10:30',
      type: 'text',
      isOwn: false
    },
    {
      id: '2',
      sender: '我',
      content: '你好，很高兴加入这个聊天室！',
      timestamp: '10:32',
      type: 'text',
      isOwn: true
    },
    {
      id: '3',
      sender: '李四',
      content: '这是一个图片消息示例',
      timestamp: '10:35',
      type: 'image',
      isOwn: false
    }
  ]);
  
  const textareaRef = useRef<InputRef>(null);

  const handleSend = () => {
    if (message.trim() === '') return;
    
    const newMessage: Message = {
      id: `${messages.length + 1}`,
      sender: '我',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      isOwn: true
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '聊天记录',
    },
    {
      key: '2',
      label: '清空聊天',
    },
    {
      key: '3',
      label: '消息搜索',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 聊天头部 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge dot>
            <Avatar size="large" icon={<UserOutlined />} />
          </Badge>
          <div style={{ marginLeft: 12 }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>公共群聊</div>
            <div style={{ fontSize: '12px', color: '#888' }}>在线 12人</div>
          </div>
        </div>
        <div>
          <Button icon={<SearchOutlined />} style={{ marginRight: 8 }} />
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* 消息区域 */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '16px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.map(msg => (
          <div 
            key={msg.id} 
            style={{ 
              display: 'flex', 
              justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
              marginBottom: '16px'
            }}
          >
            {!msg.isOwn && (
              <div style={{ marginRight: '8px' }}>
                <Avatar size="small" icon={<UserOutlined />} />
              </div>
            )}
            <div>
              {!msg.isOwn && (
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                  {msg.sender}
                </div>
              )}
              <div
                style={{
                  backgroundColor: msg.isOwn ? '#1890ff' : '#f0f0f0',
                  color: msg.isOwn ? '#fff' : '#000',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  maxWidth: '400px',
                  wordWrap: 'break-word'
                }}
              >
                {msg.content}
                {msg.type === 'image' && (
                  <div style={{ marginTop: '8px' }}>
                    <img 
                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" 
                      alt="示例图片" 
                      style={{ maxWidth: '100%', borderRadius: '4px' }}
                    />
                  </div>
                )}
              </div>
              <div 
                style={{ 
                  fontSize: '12px', 
                  color: '#888', 
                  textAlign: msg.isOwn ? 'right' : 'left',
                  marginTop: '4px'
                }}
              >
                {msg.timestamp}
              </div>
            </div>
            {msg.isOwn && (
              <div style={{ marginLeft: '8px' }}>
                <Avatar size="small" icon={<UserOutlined />} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 输入区域 */}
      <div style={{ 
        padding: '12px 16px',
        borderTop: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <Button icon={<SmileOutlined />} type="text" size="small" style={{ marginRight: '8px' }} />
          <Button icon={<PaperClipOutlined />} type="text" size="small" />
        </div>
        <div style={{ display: 'flex' }}>
          <TextArea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ 
              borderRadius: '16px',
              marginRight: '8px',
              resize: 'none'
            }}
          />
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={handleSend}
            disabled={message.trim() === ''}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
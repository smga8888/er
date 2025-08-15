import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

// 消息类型定义
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'video' | 'file' | 'emoji';
  toUserId?: string; // 用于私聊
  groupId?: string;  // 用于群聊
}

// Socket事件类型定义
// interface SocketEvents {
//   'connect': () => void;
//   'disconnect': () => void;
//   'message': (message: Message) => void;
//   'private_message': (message: Message) => void;
//   'group_message': (message: Message) => void;
//   'user_online': (userId: string) => void;
//   'user_offline': (userId: string) => void;
//   'file_uploaded': (data: { url: string; type: string }) => void;
// }

const SOCKET_URL = 'http://sandbox-session16224f768a5b4069ba-3000.preview.iflow.cn';

export const useSocket = () => {
  const { token } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!token) return;

    // 创建Socket连接
    const socket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    // 监听连接事件
    socket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    // 监听断开连接事件
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    // 监听公共消息
    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    // 监听私聊消息
    socket.on('private_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    // 监听群聊消息
    socket.on('group_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    // 监听文件上传完成事件
    socket.on('file_uploaded', (data) => {
      console.log('File uploaded:', data);
      // 可以在这里处理文件上传完成后的逻辑
    });

    // 清理函数
    return () => {
      socket.disconnect();
    };
  }, [token]);

  // 发送消息
  const sendMessage = (content: string, type: 'text' | 'image' | 'video' | 'file' | 'emoji' = 'text', toUserId?: string, groupId?: string) => {
    if (!socketRef.current) return;

    const message: Partial<Message> = {
      content,
      type,
      toUserId,
      groupId
    };

    // 根据消息类型发送到不同的事件
    if (toUserId) {
      socketRef.current.emit('private_message', message);
    } else if (groupId) {
      socketRef.current.emit('group_message', message);
    } else {
      socketRef.current.emit('message', message);
    }
  };

  // 发送文件
  const sendFile = (file: File, toUserId?: string, groupId?: string) => {
    if (!socketRef.current) return;

    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);

    // 发送文件上传请求
    fetch(`${SOCKET_URL}/api/messages/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      // 文件上传成功后，发送消息通知
      if (data.url) {
        sendMessage(data.url, data.type as any, toUserId, groupId);
      }
    })
    .catch(error => {
      console.error('File upload error:', error);
    });
  };

  return {
    connected,
    messages,
    sendMessage,
    sendFile
  };
};
import axios from 'axios';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: 'http://sandbox-session16224f768a5b4069ba-3000.preview.iflow.cn/api',
  timeout: 10000,
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // token 过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关 API
export const authAPI = {
  // 用户登录
  login: (username: string, password: string) => {
    return apiClient.post('/auth/login', { username, password });
  },
  
  // 用户注册
  register: (username: string, password: string, email: string, invitationCode?: string) => {
    return apiClient.post('/auth/register', { username, password, email, invitationCode });
  },
  
  // 获取当前用户信息
  getCurrentUser: () => {
    return apiClient.get('/auth/me');
  }
};

// 用户相关 API
export const userAPI = {
  // 获取所有用户（管理员）
  getAllUsers: () => {
    return apiClient.get('/admin/users');
  },
  
  // 更新用户信息（管理员）
  updateUser: (userId: string, data: any) => {
    return apiClient.put(`/admin/users/${userId}`, data);
  },
  
  // 删除用户（管理员）
  deleteUser: (userId: string) => {
    return apiClient.delete(`/admin/users/${userId}`);
  },
  
  // 获取在线用户
  getOnlineUsers: () => {
    return apiClient.get('/users/online');
  },
  
  // 获取离线用户
  getOfflineUsers: () => {
    return apiClient.get('/users/offline');
  }
};

// 消息相关 API
export const messageAPI = {
  // 获取公共群聊消息
  getPublicMessages: (page: number = 1, limit: number = 50) => {
    return apiClient.get(`/messages/public?page=${page}&limit=${limit}`);
  },
  
  // 获取私聊消息
  getPrivateMessages: (userId: string, page: number = 1, limit: number = 50) => {
    return apiClient.get(`/messages/private/${userId}?page=${page}&limit=${limit}`);
  },
  
  // 发送消息
  sendMessage: (content: string, type: string = 'text', toUserId?: string) => {
    return apiClient.post('/messages', { content, type, toUserId });
  },
  
  // 搜索消息
  searchMessages: (query: string, filters?: any) => {
    return apiClient.post('/messages/search', { query, filters });
  },
  
  // 删除消息（管理员）
  deleteMessage: (messageId: string) => {
    return apiClient.delete(`/admin/messages/${messageId}`);
  }
};

// 群组相关 API
export const groupAPI = {
  // 获取所有群组
  getAllGroups: () => {
    return apiClient.get('/groups');
  },
  
  // 创建群组（管理员）
  createGroup: (name: string, description: string) => {
    return apiClient.post('/admin/groups', { name, description });
  },
  
  // 邀请用户加入群组（管理员）
  inviteUserToGroup: (groupId: string, userId: string) => {
    return apiClient.post(`/admin/groups/${groupId}/invite`, { userId });
  }
};

// 邀请码相关 API
export const invitationAPI = {
  // 生成邀请码（管理员）
  generateInvitationCode: () => {
    return apiClient.post('/admin/invitations');
  },
  
  // 获取所有邀请码（管理员）
  getAllInvitationCodes: () => {
    return apiClient.get('/admin/invitations');
  },
  
  // 删除邀请码（管理员）
  deleteInvitationCode: (codeId: string) => {
    return apiClient.delete(`/admin/invitations/${codeId}`);
  }
};

export default apiClient;
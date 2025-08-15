import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import './App.css';

const { Header, Content, Sider } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={300} theme="light">
        <Sidebar />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <ChatArea />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
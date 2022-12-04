import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BarChartOutlined } from '@ant-design/icons';
import { Layout, Menu, MenuProps } from 'antd';
import CustomBreadcrumb from "./CustomBreadcrumb";
import React from "react";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;


function LayoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: MenuProps['items'] = [
    {
      key: '/',
      icon: React.createElement(BarChartOutlined),
      label: `Tileset Metrics`,
      children: [{
        key: '/tile-count',
        label: 'Tile Count',
        onClick: () => navigate('/tile-count')
      },
      {
        key: '/tile-size',
        label: 'Tile Size',
        onClick: () => navigate('/tile-size')
      }]
    }
  ];
  
  return (
    <>
      <Layout>
        <Header className="header">
          <div className="logo" />
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              defaultOpenKeys={['/']}
              style={{ height: '100%', borderRight: 0 }}
              items={navItems}
            />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <CustomBreadcrumb/>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 'calc(100vh - 145px)',
              }}
            >
              <Outlet />

            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
}

export default LayoutPage;
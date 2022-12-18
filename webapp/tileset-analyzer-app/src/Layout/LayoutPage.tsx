import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BarChartOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Layout, Menu, MenuProps } from 'antd';
import CustomBreadcrumb from "./CustomBreadcrumb";
import React, { FC } from "react";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;


const LayoutPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: MenuProps['items'] = [
    {
      key: '/info',
      icon: React.createElement(InfoCircleOutlined),
      label: `Infomation`,
      children: [{
        key: '/tileset-info',
        label: 'Tileset Info',
        onClick: () => navigate('/tileset-info')
      }]
    },
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
          <img className="logo" src="/logo.png" />
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              defaultOpenKeys={['/', '/info']}
              style={{ height: '100%', borderRight: 0 }}
              items={navItems}
            />
          </Sider>
          <Layout style={{ padding: '0 24px 24px', height:"calc(100vh - 70px)" }}>
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
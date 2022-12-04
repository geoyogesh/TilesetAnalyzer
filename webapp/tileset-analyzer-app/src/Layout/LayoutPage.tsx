import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import React from 'react';
import Icon, { BarChartOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import { useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;


function LayoutPage() {

  const navigate = useNavigate();
  const location = useLocation();

  const navItems: MenuProps['items'] = [
    {
      key: `Tileset Metrics`,
      icon: React.createElement(BarChartOutlined),
      label: `Tileset Metrics`,
      children: [{
        key: 'Tile Count',
        label: 'Tile Count',
        onClick: () => { navigate('/tilecount') }
      },
      {
        key: 'Tile Size',
        label: 'Tile Size',
        onClick: () => { navigate('/tilesize') }
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
            >
              <SubMenu key="/" title={<span><BarChartOutlined /><span>Tileset Metrics</span></span>}>
                <Menu.Item key="/tilecount">
                  <NavLink to="/tilecount" className="nav-text">Tile Count</NavLink>
                </Menu.Item>
                <Menu.Item key="/tilesize">
                  <NavLink to="/tilesize" className="nav-text">Tile Size</NavLink>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
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
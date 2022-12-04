import { NavLink, Outlet, useLocation } from "react-router-dom";
import { BarChartOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import CustomBreadcrumb from "./CustomBreadcrumb";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;


function LayoutPage() {
  const location = useLocation();


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
                <Menu.Item key="/tile-count">
                  <NavLink to="/tile-count" className="nav-text">Tile Count</NavLink>
                </Menu.Item>
                <Menu.Item key="/tile-size">
                  <NavLink to="/tile-size" className="nav-text">Tile Size</NavLink>
                </Menu.Item>
              </SubMenu>
            </Menu>
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
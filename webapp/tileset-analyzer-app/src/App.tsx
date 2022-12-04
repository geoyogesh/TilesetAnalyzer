import React, { useEffect, useState } from 'react';
import { BarChartOutlined } from '@ant-design/icons';
import { Card, MenuProps, Select, Skeleton, Space } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import 'antd/dist/reset.css';
import './App.css';
import ReactEcharts from "echarts-for-react"
import { AnalysisResult, TilesSizeAggByZ } from './AnalysisResult';

const { Header, Content, Sider } = Layout;


const navItems: MenuProps['items'] = [
  {
    key: `Tileset Metrics`,
    icon: React.createElement(BarChartOutlined),
    label: `Tileset Metrics`,
    children: [{
      key: 'Tile Count',
      label: 'Tile Count',
    },
    {
      key: 'Tile Size',
      label: 'Tile Size',
    }]
  }
];


function App() {


  const [, setData] = useState<AnalysisResult | null>(null);
  const [countTilesbyZ, setCountTilesbyZ] = useState<any>(null);
  const [tilesSizeAggbyZ, setTilesSizeAggbyZ] = useState<{ [agg_type: string]: any } | null>(null);
  const [aggSelection, setAggSelection] = useState<string>('AVG');

  const aggOptions = [
    {
      value: 'SUM',
      label: 'Sum',
    },
    {
      value: 'MIN',
      label: 'Minimum',
    },
    {
      value: 'MAX',
      label: 'Maximum',
    },
    {
      value: 'AVG',
      label: 'Average',
    },
  ];

  useEffect(() => {

    const bytesConversion = (bytes: number, si = false, dp = 1) => {
      const thresh = si ? 1000 : 1024;

      if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
      }

      const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
      let u = -1;
      const r = 10 ** dp;

      do {
        bytes /= thresh;
        ++u;
      } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


      return bytes.toFixed(dp) + ' ' + units[u];
    }


    fetch('http://0.0.0.0:8080/api/analysis_result.json')
      .then((res) => res.json())
      .then((res: AnalysisResult) => {
        setData(res);
        console.log(res);


        const options = {
          grid: { top: 10, right: 10, bottom: 10, left: 10, containLabel: true },
          xAxis: {
            type: "category",
            data: res.count_tiles_by_z.map(item => item.z)
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              data: res.count_tiles_by_z.map(item => item.count),
              type: "bar",
              smooth: true
            }
          ],
          tooltip: {
            trigger: "axis"
          }
        }
        setCountTilesbyZ(options);


        const aggTypes = [
          ['MIN', 'tiles_size_agg_min_by_z'],
          ['MAX', 'tiles_size_agg_max_by_z'],
          ['AVG', 'tiles_size_agg_avg_by_z'],
          ['SUM', 'tiles_size_agg_sum_by_z']
        ]

        const tileSizeAggOptions: { [agg_type: string]: any } = {}

        for (const [aggType, agg_metric] of aggTypes) {
          const options = {
            grid: { top: 10, right: 10, bottom: 10, left: 10, containLabel: true },
            xAxis: {
              type: "category",
              data: (res as any)[agg_metric].map((item: TilesSizeAggByZ) => item.z),
            },
            yAxis: {
              type: "value",
              name: 'Tile Size',
              axisLabel: {
                formatter: (value: number) => {
                  var val = bytesConversion(value, true);
                  return val;
                }
              },
            },
            formatter: (params: any) => {
              var val = bytesConversion(params[0].value, true, 0);
              return val;
            },
            series: [
              {
                data: (res as any)[agg_metric].map((item: TilesSizeAggByZ) => item.size),
                type: "bar",
                smooth: true
              }
            ],
            tooltip: {
              trigger: "axis"
            }
          }
          tileSizeAggOptions[aggType] = options;
        }
        setTilesSizeAggbyZ(tileSizeAggOptions);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);


  const chartStyle = {
    height: "300px"
  };


  const handleChange = (value: string) => {
    setAggSelection(value);
  };


  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['Tile Size']}
            defaultOpenKeys={['Tileset Metrics']}
            style={{ height: '100%', borderRight: 0 }}
            items={navItems}
          />
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
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <Card size="small" title="Tiles Count by Zoom Level">
                {countTilesbyZ !== null ? <ReactEcharts option={countTilesbyZ} style={chartStyle}></ReactEcharts> : <Skeleton />}
              </Card>


              <Card size="small" title={`Tile Size ${aggOptions.filter(item => item.value === aggSelection)[0].label} by Zoom level`} extra={<Select
                defaultValue={aggSelection}
                style={{ width: 120 }}
                onChange={handleChange}
                options={aggOptions}
              />}>
                {tilesSizeAggbyZ !== null ? <ReactEcharts option={tilesSizeAggbyZ[aggSelection]} style={chartStyle}></ReactEcharts> : <Skeleton />}
              </Card>

            </Space>

          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;

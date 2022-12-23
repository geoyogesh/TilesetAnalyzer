import { Card, Select, Skeleton, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { AnalysisResult, TilesSizeAggSumByZLayer } from "../AnalysisResult";
import ReactEcharts, { EChartsOption } from "echarts-for-react"
import { BASE_CHART_CONFIG, CHART_STYLE } from "./ChartProps";
import { bytesConverted, bytesToString, bytesUnit } from "./SizeConversions";


const LayerSizeTree: FC = () => {
    const [tilesSizeAggbyZLayer, setTilesSizeAggbyZLayer] = useState<{ [agg_type: string]: any } | null>(null);
    const [aggSelection, setAggSelection] = useState<string>('SUM');

    const aggOptions = [
        {
            value: 'SUM',
            label: 'Sum',
        },
    ];

    useEffect(() => {
        fetch('http://0.0.0.0:8080/api/analysis_result.json')
            .then((res) => res.json())
            .then((res: AnalysisResult) => {

                const aggTypes = [
                    ['SUM', 'tiles_size_agg_sum_by_z_layer'],
                ]

                const tileSizeAggOptions: { [agg_type: string]: any } = {}

                for (const [aggType, agg_metric] of aggTypes) {


                    const currentSeries: any = {
                        name: 'Tileset',
                        type: 'treemap',
                        label: {
                            show: true,
                            formatter: '{b}'
                        },
                        itemStyle: {
                            borderColor: '#fff'
                        },
                        levels: [
                            {
                                itemStyle: {
                                  borderWidth: 0,
                                  gapWidth: 5
                                }
                              },
                              {
                                itemStyle: {
                                  gapWidth: 1
                                }
                              },
                              {
                                colorSaturation: [0.35, 0.5],
                                itemStyle: {
                                  gapWidth: 1,
                                  borderColorSaturation: 0.6
                                }
                              }
                        ],
                        data: []
                    };
                    const metrics: TilesSizeAggSumByZLayer[] = (res as any)[agg_metric];
                    for (const { layers, z, size } of metrics) {
                        const series = {
                            value: size,
                            name: `Zoom ${z}`,
                            path: `Zoom ${z}`,
                            children: Object.entries(layers).map(([k, v]) => ({
                                value: v,
                                name: k,
                                path: `Zoom ${z}/${k}`
                            }))
                        }
                        currentSeries.data.push(series);
                    }
                    // console.log(currentSeries);
                    const options: EChartsOption = {
                        ...BASE_CHART_CONFIG,
                        ...{
                            series: currentSeries
                        },
                        tooltip: {
                            formatter: function (info: any) {
                              var value = info.value;
                              var name = info.name;
                              var treePathInfo = info.treePathInfo;
                              var treePath = [];
                              for (var i = 1; i < treePathInfo.length; i++) {
                                treePath.push(treePathInfo[i].name);
                              }
                              return [
                                '<div class="tooltip-title">' +
                                  treePath.join(' / ') +
                                  '</div>',
                                'Disk Usage: ' + bytesToString(value, true)
                              ].join('');
                            }
                          },
                          toolbox: {
                            show: true,
                            orient: 'vertical',
                            left: 'right',
                            top: 'center',
                            feature: {
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                    };
                    delete options['xAxis'];
                    delete options['yAxis'];
                    tileSizeAggOptions[aggType] = options;
                }
                setTilesSizeAggbyZLayer(tileSizeAggOptions);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);


    const handleChange = (value: string) => {
        setAggSelection(value);
    };


    return (<Space direction="vertical" size="middle" style={{ display: 'flex' }}>

        <Card size="small" title={`Tile Layer Size (TreeMap)`}>
            {tilesSizeAggbyZLayer !== null ? <ReactEcharts option={tilesSizeAggbyZLayer[aggSelection]} style={CHART_STYLE}></ReactEcharts> : <Skeleton />}
        </Card>

    </Space>);
}

export default LayerSizeTree;
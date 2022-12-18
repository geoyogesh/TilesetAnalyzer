import { Card, Select, Skeleton, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { AnalysisResult, TilesSizeAggSumByZLayer } from "../AnalysisResult";
import ReactEcharts, { EChartsOption } from "echarts-for-react"
import { BASE_CHART_CONFIG, CHART_STYLE } from "./ChartProps";
import { bytesConverted, bytesToString, bytesUnit } from "./SizeConversions";

const LayerTileSize: FC = () => {
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
                    const items: TilesSizeAggSumByZLayer[] = (res as any)[agg_metric].map((item: TilesSizeAggSumByZLayer) => item);
                    const allLayers = new Set<string>();
                    const values = []
                    for (const item of items) {
                        for (const [layer_name, size] of Object.entries(item.layers)) {
                            if (size !== null) {
                                values.push(size);
                            }
                            allLayers.add(layer_name);
                        }
                    }

                    const maxValue = Math.max(...values);
                    
                    
                    const unit = bytesUnit(maxValue, true, 0);

                    const currentSeries = [];
                    for (const layer_name of Array.from(allLayers).sort()) {
                        const seriesData = (res as any)[agg_metric].map((item: TilesSizeAggSumByZLayer) => item.layers[layer_name] ? bytesConverted(item.layers[layer_name], unit, true, 0): null);
                        //console.log(layer_name, seriesData);
                        currentSeries.push({
                            data: seriesData,
                            type: "bar",
                            smooth: true,
                            name: layer_name,
                            stack: 'Size'
                        });
                    }
                    const options: EChartsOption = {
                        ...BASE_CHART_CONFIG,
                        ...{
                            xAxis: {
                                ...BASE_CHART_CONFIG.xAxis,
                                ...{
                                    type: "category",
                                    data: (res as any)[agg_metric].map((item: TilesSizeAggSumByZLayer) => item.z),
                                    name: 'Zoom Level'
                                }
                            },
                            yAxis: {
                                ...BASE_CHART_CONFIG.yAxis,
                                ...{
                                    type: "value",
                                    name: `Tile Size (in ${unit})`,
                                    nameGap: 40,
                                },
                            },
                            legend: {
                                data: Array.from(allLayers).sort()
                            },
                            /*
                            formatter: (params: any) => {
                                var val = bytesConversion(params[0].value, true, 0);
                                return val;
                            },
                            */
                            series: currentSeries
                        }
                    }
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

        <Card size="small" title={`Tile Layer Size ${aggOptions.filter(item => item.value === aggSelection)[0].label} by Zoom level`} extra={<Select
            defaultValue={aggSelection}
            style={{ width: 160 }}
            onChange={handleChange}
            options={aggOptions}
        />}>
            {tilesSizeAggbyZLayer !== null ? <ReactEcharts option={tilesSizeAggbyZLayer[aggSelection]} style={CHART_STYLE}></ReactEcharts> : <Skeleton />}
        </Card>

    </Space>);
}

export default LayerTileSize;
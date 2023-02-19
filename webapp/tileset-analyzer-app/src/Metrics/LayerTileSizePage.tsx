import { Space } from "antd";
import { FC, useEffect, useState } from "react";
import { AnalysisResult, TilesSizeAggByZLayer } from "../AnalysisResult";
import ReactEcharts, { EChartsOption } from "echarts-for-react"
import { BASE_CHART_CONFIG, CHART_STYLE } from "./Support/ChartProps";
import { bytesConverted, bytesToString, bytesUnit } from "./Support/SizeConversions";
import { Container, Header, Spinner, Select } from "@cloudscape-design/components";
import { OptionDefinition } from "@cloudscape-design/components/internal/components/option/interfaces";

const LayerTileSize: FC = () => {
    const [tilesSizeAggbyZLayer, setTilesSizeAggbyZLayer] = useState<{ [agg_type: string]: any } | null>(null);

    const aggOptions: OptionDefinition[] = [
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
        {
            value: '50p',
            label: '50th Percentile',
        },
        {
            value: '85p',
            label: '85th Percentile',
        },
        {
            value: '90p',
            label: '90th Percentile',
        },
        {
            value: '95p',
            label: '95th Percentile',
        },
        {
            value: '99p',
            label: '99th Percentile',
        }
    ];

    const [aggSelection, setAggSelection] = useState<OptionDefinition>(aggOptions.find(item => item.value === 'SUM')!);


    useEffect(() => {
        fetch('http://0.0.0.0:8080/api/analysis_result.json')
            .then((res) => res.json())
            .then((res: AnalysisResult) => {

                const aggTypes = [
                    ['MIN', 'tiles_size_agg_min_by_z_layer'],
                    ['MAX', 'tiles_size_agg_max_by_z_layer'],
                    ['AVG', 'tiles_size_agg_avg_by_z_layer'],
                    ['SUM', 'tiles_size_agg_sum_by_z_layer'],
                    ['50p', 'tiles_size_agg_50p_by_z_layer'],
                    ['85p', 'tiles_size_agg_85p_by_z_layer'],
                    ['90p', 'tiles_size_agg_90p_by_z_layer'],
                    ['95p', 'tiles_size_agg_95p_by_z_layer'],
                    ['99p', 'tiles_size_agg_99p_by_z_layer']
                ]

                const tileSizeAggOptions: { [agg_type: string]: any } = {};


                for (const [aggType, agg_metric] of aggTypes) {
                    const totals = new Map<number, number>();
                    const items: TilesSizeAggByZLayer[] = (res as any)[agg_metric].map((item: TilesSizeAggByZLayer) => item);
                    const allLayers = new Set<string>();
                    const values = []
                    for (const item of items) {
                        totals.set(item.z, 0);
                        for (const [layer_name, size] of Object.entries(item.layers)) {
                            if (size !== null) {
                                values.push(size);
                                totals.set(item.z, (totals.get(item.z) as number) + size);
                            }
                            allLayers.add(layer_name);
                        }
                    }

                    const maxValue = Math.max(...values);


                    const unit = bytesUnit(maxValue, true, 0);

                    const currentSeries = [];
                    for (const layer_name of Array.from(allLayers).sort()) {
                        const seriesData = (res as any)[agg_metric].map((item: TilesSizeAggByZLayer) => item.layers[layer_name] ? bytesConverted(item.layers[layer_name], unit, true, 0) : null);
                        //console.log(layer_name, seriesData);
                        currentSeries.push({
                            data: seriesData,
                            type: "bar",
                            smooth: true,
                            name: layer_name,
                            stack: 'Size',
                            tooltip: {
                                valueFormatter: (value: number) => {
                                    return value ? `${value} ${unit}` : ' - ';
                                }
                            },
                            emphasis: {
                                focus: 'series',
                            }
                        });
                    }
                    const options: EChartsOption = {
                        ...BASE_CHART_CONFIG,
                        ...{
                            xAxis: {
                                ...BASE_CHART_CONFIG.xAxis,
                                ...{
                                    type: "category",
                                    data: (res as any)[agg_metric].map((item: TilesSizeAggByZLayer) => item.z),
                                    name: 'Zoom Level',
                                }
                            },
                            yAxis: {
                                ...BASE_CHART_CONFIG.yAxis,
                                ...{
                                    type: "value",
                                    name: `${aggOptions.filter(item => item.value === aggType)[0].label} Tile Layer Size (in ${unit})`,
                                    nameGap: 40,
                                },
                            },
                            legend: {
                                data: Array.from(allLayers).sort()
                            },
                            series: currentSeries,
                            tooltip: {
                                trigger: 'item',
                                show: true,
                                axisPointer: {
                                    type: 'shadow',
                                },
                                formatter: (params: any) => {
                                    // console.log(params);
                                    const layer_name = params.seriesName;
                                    const dataIndex: number = params.dataIndex;
                                    const total = Math.round(bytesConverted((totals.get(dataIndex) as number), unit, true, 1))
                                    const percent = Math.round(params.value * 100 / total);
                                    // console.log(layer_name, dataIndex, params.value, total, percent);
                                    return `${params.marker} ${layer_name}: ${params.value} ${unit} (${percent}%)`;
                                },
                            },
                        },
                    }
                    tileSizeAggOptions[aggType] = options;
                }
                setTilesSizeAggbyZLayer(tileSizeAggOptions);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);


    const handleChange = (value: OptionDefinition) => {
        setAggSelection(value);
    };


    return (<Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Container
            header={
                <Header variant="h3" actions={
                    <Select
                        selectedOption={aggSelection}
                        onChange={({ detail }) =>
                            handleChange(detail.selectedOption)
                        }
                        options={aggOptions}
                    />
                }>
                    {`Tile Layer Size ${aggOptions.filter(item => item.value === aggSelection.value)[0].label} by Zoom level`}
                </Header>
            }
        >
            {tilesSizeAggbyZLayer !== null ? <ReactEcharts option={tilesSizeAggbyZLayer[aggSelection.value!]} style={CHART_STYLE}></ReactEcharts> : <Spinner />}
        </Container>
    </Space>);
}

export default LayerTileSize;
import { Card, Select, Skeleton, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { AnalysisResult, TilesSizeAggByZ } from "../AnalysisResult";
import ReactEcharts, { EChartsOption } from "echarts-for-react"
import { BASE_CHART_CONFIG, CHART_STYLE } from "./ChartProps";
import { bytesConverted, bytesToString, bytesUnit } from "./SizeConversions";

const TileSize: FC = () => {
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

    useEffect(() => {
        fetch('http://0.0.0.0:8080/api/analysis_result.json')
            .then((res) => res.json())
            .then((res: AnalysisResult) => {

                const aggTypes = [
                    ['MIN', 'tiles_size_agg_min_by_z'],
                    ['MAX', 'tiles_size_agg_max_by_z'],
                    ['AVG', 'tiles_size_agg_avg_by_z'],
                    ['SUM', 'tiles_size_agg_sum_by_z'],
                    ['50p', 'tiles_size_agg_50p_by_z'],
                    ['85p', 'tiles_size_agg_85p_by_z'],
                    ['90p', 'tiles_size_agg_90p_by_z'],
                    ['95p', 'tiles_size_agg_95p_by_z'],
                    ['99p', 'tiles_size_agg_99p_by_z']
                ]

                const tileSizeAggOptions: { [agg_type: string]: any } = {}

                for (const [aggType, agg_metric] of aggTypes) {
                    const values = (res as any)[agg_metric].map((item: TilesSizeAggByZ) => item.size);
                    const maxValue = Math.max(...(res as any)[agg_metric]
                        .filter((item: TilesSizeAggByZ) => item.size !== null)
                        .map((item: TilesSizeAggByZ) => item.size));
                    const unit = bytesUnit(maxValue, true, 0);
                    
                    const convertedValues = (res as any)[agg_metric].map((item: TilesSizeAggByZ) => bytesConverted(item.size, unit, true, 0));
                    //console.log(aggType, maxValue, unit, values, convertedValues);
                    const options: EChartsOption = {
                        ...BASE_CHART_CONFIG,
                        ...{
                            xAxis: {
                                ...BASE_CHART_CONFIG.xAxis,
                                ...{
                                    type: "category",
                                    data: (res as any)[agg_metric].map((item: TilesSizeAggByZ) => item.z),
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
                            /*
                            formatter: (params: any) => {
                                var val = bytesConversion(params[0].value, true, 0);
                                return val;
                            },
                            */
                            series: [
                                {
                                    data: convertedValues,
                                    type: "bar",
                                    smooth: true,
                                    name: 'Tile Size',
                                    label: {
                                        show: true,
                                        position: 'top',
                                        valueAnimation: true,
                                        formatter: `{@score} ${unit}`
                                    }
                                }
                            ]
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


    const handleChange = (value: string) => {
        setAggSelection(value);
    };


    return (<Space direction="vertical" size="middle" style={{ display: 'flex' }}>

        <Card size="small" title={`Tile Size ${aggOptions.filter(item => item.value === aggSelection)[0].label} by Zoom level`} extra={<Select
            defaultValue={aggSelection}
            style={{ width: 160 }}
            onChange={handleChange}
            options={aggOptions}
        />}>
            {tilesSizeAggbyZ !== null ? <ReactEcharts option={tilesSizeAggbyZ[aggSelection]} style={CHART_STYLE}></ReactEcharts> : <Skeleton />}
        </Card>

    </Space>);
}

export default TileSize;
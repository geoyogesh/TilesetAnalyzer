import { Card, Select, Skeleton, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { AnalysisResult, TilesSizeAggByZ } from "../AnalysisResult";
import ReactEcharts, { EChartsOption } from "echarts-for-react"

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

                const aggTypes = [
                    ['MIN', 'tiles_size_agg_min_by_z'],
                    ['MAX', 'tiles_size_agg_max_by_z'],
                    ['AVG', 'tiles_size_agg_avg_by_z'],
                    ['SUM', 'tiles_size_agg_sum_by_z']
                ]

                const tileSizeAggOptions: { [agg_type: string]: any } = {}

                for (const [aggType, agg_metric] of aggTypes) {
                    const options: EChartsOption = {
                        tooltip: {
                            trigger: 'axis'
                        },
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
                                smooth: true,
                                name: 'Tile Size'
                            }
                        ]
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


    return (<Space direction="vertical" size="middle" style={{ display: 'flex' }}>

        <Card size="small" title={`Tile Size ${aggOptions.filter(item => item.value === aggSelection)[0].label} by Zoom level`} extra={<Select
            defaultValue={aggSelection}
            style={{ width: 120 }}
            onChange={handleChange}
            options={aggOptions}
        />}>
            {tilesSizeAggbyZ !== null ? <ReactEcharts option={tilesSizeAggbyZ[aggSelection]} style={chartStyle}></ReactEcharts> : <Skeleton />}
        </Card>

    </Space>);
}

export default TileSize;
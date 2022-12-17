import { Card, Skeleton, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { AnalysisResult } from "../AnalysisResult";
import ReactEcharts, { EChartsOption } from "echarts-for-react";
import { BASE_CHART_CONFIG, CHART_STYLE } from "./ChartProps";
import { abbreviateNumber } from "./NumberConverions";

const TileCount: FC = () => {
    const [countTilesbyZ, setCountTilesbyZ] = useState<any>(null);

    useEffect(() => {
        fetch('http://0.0.0.0:8080/api/analysis_result.json')
            .then((res) => res.json())
            .then((res: AnalysisResult) => {
                const options: EChartsOption = {
                    ...BASE_CHART_CONFIG,
                    ...{
                        xAxis: {
                            ...BASE_CHART_CONFIG.xAxis,
                            ...{
                                type: "category",
                                data: res.count_tiles_by_z.map(item => item.z),
                                name: 'Zoom Level',
                            }
                        },
                        yAxis: {
                            ...BASE_CHART_CONFIG.yAxis, 
                            ...{
                                type: "value",
                                name: "Tile Count",
                            }
                        },
                        series: [
                            {
                                data: res.count_tiles_by_z.map(item => item.count),
                                type: "bar",
                                smooth: true,
                                name: 'Tile Count',
                                label: {
                                    show: true,
                                    position: 'top',
                                    valueAnimation: true,
                                    formatter: (param: any) => { 
                                        console.log(param); 
                                        return `${abbreviateNumber(param.data)}`; 
                                    } 
                                }
                            }
                        ]
                    }
                };
                setCountTilesbyZ(options);

            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);


    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card size="small" title="Tiles Count by Zoom Level">
                {countTilesbyZ !== null ? <ReactEcharts option={countTilesbyZ} style={CHART_STYLE}></ReactEcharts> : <Skeleton />}
            </Card>
        </Space>);
}

export default TileCount;
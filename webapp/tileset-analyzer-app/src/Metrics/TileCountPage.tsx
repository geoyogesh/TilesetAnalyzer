import { Card, Skeleton, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { AnalysisResult } from "../AnalysisResult";
import ReactEcharts from "echarts-for-react";

const TileCount: FC = () => {
    const [countTilesbyZ, setCountTilesbyZ] = useState<any>(null);

    const chartStyle = {
        height: "300px"
    };

    useEffect(() => {
        fetch('http://0.0.0.0:8080/api/analysis_result.json')
            .then((res) => res.json())
            .then((res: AnalysisResult) => {
                const options = {
                    tooltip: {
                        trigger: 'axis'
                    },
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
                            smooth: true,
                            name: 'Tile Count'
                        }
                    ]
                }
                setCountTilesbyZ(options);

            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);


    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card size="small" title="Tiles Count by Zoom Level">
                {countTilesbyZ !== null ? <ReactEcharts option={countTilesbyZ} style={chartStyle}></ReactEcharts> : <Skeleton />}
            </Card>
        </Space>);
}

export default TileCount;
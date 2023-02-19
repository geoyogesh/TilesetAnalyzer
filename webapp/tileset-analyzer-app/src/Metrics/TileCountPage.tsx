import { FC, useEffect, useState } from "react";
import { AnalysisResult } from "../AnalysisResult";
import ReactEcharts, { EChartsOption } from "echarts-for-react";
import { BASE_CHART_CONFIG, CHART_STYLE } from "./Support/ChartProps";
import { abbreviateNumber } from "./Support/NumberConverions";
import { Container, Header, SpaceBetween, Spinner } from "@cloudscape-design/components";

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
        <SpaceBetween direction="vertical" size="m">
            <Container
                header={
                    <Header variant="h3">
                        Tiles Count by Zoom Level
                    </Header>
                }
            >
                {countTilesbyZ !== null ? <ReactEcharts option={countTilesbyZ} style={CHART_STYLE}></ReactEcharts> : <Spinner />}
            </Container>
        </SpaceBetween>);
}

export default TileCount;
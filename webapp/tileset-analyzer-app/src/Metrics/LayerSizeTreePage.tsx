import { FC, useEffect, useState } from "react";
import { AnalysisResult, TilesSizeAggByZLayer } from "../AnalysisResult";
import ReactEcharts, { EChartsOption } from "echarts-for-react"
import { BASE_CHART_CONFIG, CHART_STYLE } from "./Support/ChartProps";
import { bytesConverted, bytesToString, bytesUnit } from "./Support/SizeConversions";
import { Container, Header, Spinner, Select, SpaceBetween, ContentLayout } from "@cloudscape-design/components";
import { OptionDefinition } from "@cloudscape-design/components/internal/components/option/interfaces";


const LayerSizeTree: FC = () => {
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
                    const metrics: TilesSizeAggByZLayer[] = (res as any)[agg_metric];
                    for (const { layers, z, size } of metrics) {
                        const total = Object.values(layers).reduce((partialSum, a) => partialSum + a, 0);
                        const series = {
                            value: total,
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


    const handleChange = (value: OptionDefinition) => {
        setAggSelection(value);
    };


    return (
        <ContentLayout header={<Header
            variant="h1">Tileset Mertics</Header>}>
            <SpaceBetween direction="vertical" size="m">

                <Container
                    header={
                        <Header variant="h3" actions={
                            <div className="select-metric">
                                <Select
                                    selectedOption={aggSelection}
                                    onChange={({ detail }) =>
                                        handleChange(detail.selectedOption)
                                    }
                                    options={aggOptions}
                                />
                            </div>
                        }>
                            {`Tile Layer Size (TreeMap)`}
                        </Header>
                    }
                >
                    {tilesSizeAggbyZLayer !== null ? <ReactEcharts option={tilesSizeAggbyZLayer[aggSelection.value!]} style={CHART_STYLE}></ReactEcharts> : <Spinner />}
                </Container>
            </SpaceBetween>
        </ContentLayout>

    );
}

export default LayerSizeTree;
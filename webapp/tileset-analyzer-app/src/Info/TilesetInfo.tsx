import { FC, useEffect, useState } from "react";
import { AnalysisResult, LayerInfoItem, TilesetInfo } from "../AnalysisResult";
import { Skeleton, Space, Typography, Table, Card, Divider, Modal, Tag } from 'antd';
import { bytesToString } from "../Metrics/Support/SizeConversions";
import { ColumnsType, TableProps } from "antd/es/table";
import LayerInfo from "./LayerInfo";

const { Title, Paragraph, Text } = Typography;

interface DataType {
    key: React.Key;
    zoom: number,
    layer_name: string,
    features_count: number;
    layer_info_item: LayerInfoItem;
    geometry_type: string[];
}



const TileSetInfo: FC = () => {

    const [tilesetInfo, setTilesetInfo] = useState<TilesetInfo | null>(null);
    const [tableData, setTableData] = useState<DataType[] | null>(null);
    const [columns, setColumns] = useState<ColumnsType<DataType> | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<any>(null);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };


    useEffect(() => {
        fetch('http://0.0.0.0:8080/api/analysis_result.json')
            .then((res) => res.json())
            .then((res: AnalysisResult) => {
                setTilesetInfo(res.tileset_info);

                const zoomItems = new Set<number>();
                const nameItems = new Set<string>();
                const geometryTypeItems = new Set<string>();
                const layers = res.tileset_info.layer_info_items;
                const data: DataType[] = [];
                for (let i = 0; i < layers.length; i++) {
                    const layer = layers[i];
                    data.push({
                        key: i,
                        zoom: layer.zoom_level,
                        layer_name: layer.name,
                        features_count: layer.count,
                        layer_info_item: layer,
                        geometry_type: layer.geometry_types
                    });

                    zoomItems.add(layer.zoom_level);
                    nameItems.add(layer.name);
                    for (const geometry_type of layer.geometry_types) {
                        geometryTypeItems.add(geometry_type);
                    }

                }

                const columns: ColumnsType<DataType> = [
                    {
                        title: 'Zoom Level',
                        dataIndex: 'zoom',
                        width: 100,
                        defaultSortOrder: 'ascend',
                        filters: Array.from(zoomItems).sort((a, b) => a - b).map(item => ({ text: item, value: item })),
                        onFilter: (value: any, record) => record.zoom === value,
                        sorter: (a, b) => a.zoom - b.zoom,
                    },
                    {
                        title: 'Layer Name',
                        dataIndex: 'layer_name',
                        width: 150,
                        defaultSortOrder: 'ascend',
                        filters: Array.from(nameItems).sort((a, b) => a.localeCompare(b)).map(item => ({ text: item, value: item })),
                        onFilter: (value: any, record) => record.layer_name.indexOf(value) === 0,
                        sorter: (a, b) => a.layer_name.localeCompare(b.layer_name),
                    },
                    {
                        title: 'Geometry Types',
                        dataIndex: 'geometry_type',
                        width: 150,
                        defaultSortOrder: 'ascend',
                        filters: Array.from(geometryTypeItems).sort((a, b) => a.localeCompare(b)).map(item => ({ text: item, value: item })),
                        onFilter: (value: any, record) => record.geometry_type.indexOf(value) === 0,
                        sorter: (a: any, b: any) => {
                            const aClone = [...a.geometry_type];
                            aClone.sort();
                            const bClone = [...b.geometry_type];
                            bClone.sort();
                            return JSON.stringify(aClone).localeCompare(JSON.stringify(bClone))
                        },
                        render: (_, { geometry_type }) => (
                            <>
                                {geometry_type.map((tag) => {
                                    return (
                                        <Tag color={'green'} key={tag}>
                                            {tag.toUpperCase()}
                                        </Tag>
                                    );
                                })}
                            </>
                        ),
                    },
                    {
                        title: 'Features Count',
                        dataIndex: 'features_count',
                        width: 150,
                        defaultSortOrder: 'ascend',
                        sorter: (a, b) => a.features_count - b.features_count,
                    },
                    {
                        title: 'Action',
                        key: 'operation',
                        fixed: 'right',
                        width: 100,
                        render: (item) => <a onClick={() => { setCurrentRecord(item); setIsModalOpen(true); }}>view</a>,
                    },
                ];
                setColumns(columns);
                setTableData(data);

            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    return (
        <div style={{ 'height': '100%', 'display': 'flex', 'flexDirection': 'column', 'gap': 10 }}>
            <Title level={4}>TileSet Info</Title>
            {tilesetInfo !== null ?
                <Card>
                    <Space direction="vertical">
                        <Text>Name: {tilesetInfo.name}</Text>
                        <Text>Location: {tilesetInfo.location}</Text>
                        <Text>DataSource Type: {tilesetInfo.ds_type}</Text>
                        <Text>Scheme: {tilesetInfo.scheme}</Text>
                        <Text>Size: {bytesToString(tilesetInfo.size, true)}</Text>
                    </Space>
                </Card>

                : <Skeleton />
            }
            <Divider orientation="left">Explore Attributes</Divider>
            {tableData != null ? <Table size="small" style={{ 'flexGrow': 1 }}
                columns={columns}
                dataSource={tableData}
                pagination={{ defaultPageSize: 10, showSizeChanger: true }}
                onChange={onChange}
                scroll={{ y: 400 }} /> : <Skeleton />}
            <Modal
                title={`${currentRecord?.layer_info_item?.name} Layer Attributes`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                centered
            >
                {currentRecord != null ? <LayerInfo layer={currentRecord.layer_info_item}></LayerInfo> : <Skeleton />}
            </Modal>

        </div>

    )
}

export default TileSetInfo;
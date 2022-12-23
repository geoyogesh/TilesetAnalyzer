import { Avatar, Col, List, Row, Skeleton, Tag, Typography } from "antd";
import { CSSProperties, FC, useEffect, useState } from "react";
import { LayerInfoItem } from "../AnalysisResult";

const { Text } = Typography;

interface LayerInfoProps {
    layer: LayerInfoItem;
}

interface AttributeInfo {
    name: string;
    data_type: string[];
}



const LayerInfo: FC<LayerInfoProps> = ({ layer }) => {
    const [data, setData] = useState<AttributeInfo[] | null>(null);
    const [selectedField, setSelectedField] = useState<string | null>(null);

    const listStyle: CSSProperties = { 'height': 400, 'overflowY': 'auto' };

    useEffect(() => {
        const attributes: AttributeInfo[] = [];
        for (const attribute_name of layer.attributes) {
            const attributeInfo: AttributeInfo = {
                name: attribute_name,
                data_type: layer.attributes_types[attribute_name]
            }
            attributes.push(attributeInfo)
        }
        setData(attributes);
        if (attributes.length > 0) {
            setSelectedField(attributes[0].name);
        }
    }, [layer])

    const renderDomain = (domain: number[] | null | undefined) => {
        if (domain === null || domain === undefined) return;

        return (<>Domain: {domain[0]} - {domain[1]}</>)
    }

    const headerContent = (selectedField: string, attrValues: string[] | undefined) => {
        if (!attrValues) {
            return <Text strong>no value(s) found for {selectedField}</Text>
        }
        if (attrValues.length === 100) {
            return <Text strong>contains 100+ distinct values for {selectedField}. truncated to first 100 values.</Text>
        }
        return <Text strong>{attrValues.length} distinct value(s) for {selectedField}</Text>
    }

    return (
        <>
            {data !== null ?
                <Row gutter={16}>
                    <Col span={12}>
                        <List
                            bordered
                            dataSource={data}
                            style={listStyle}
                            renderItem={(item) => (
                                <List.Item key={item.name} onClick={() => { setSelectedField(item.name) }} style={{ 'cursor': 'pointer' }}>
                                    <List.Item.Meta
                                        title={item.name}
                                        description={<>Data type: {<>
                                            {item.data_type.map((tag) => {
                                                let color = 'green';
                                                return (
                                                    <Tag color={color} key={tag}>
                                                        {tag.toUpperCase()}
                                                    </Tag>
                                                );
                                            })}
                                        </>} 
                                        {
                                            renderDomain(layer.attributes_numeric_domain[item.name])
                                        } </>}
                                    />
                                    <div>View Values</div>

                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col span={12}>
                        {selectedField !== null ? <List size="small"
                            header={headerContent(selectedField, layer.attributes_sample_values[selectedField])}
                            bordered
                            dataSource={layer.attributes_sample_values[selectedField]}
                            style={listStyle}
                            renderItem={(item) => (
                                <List.Item key={item}>
                                    <div>{item}</div>
                                </List.Item>
                            )}
                        /> : <Skeleton />}
                    </Col>
                </Row>
                : <Skeleton />}
        </>

    )
}

export default LayerInfo;
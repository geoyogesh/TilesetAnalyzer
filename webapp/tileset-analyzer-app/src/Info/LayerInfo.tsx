import {
    Container,
    Spinner,
    Table,
    Box,
    SpaceBetween,
    Badge,
    ColumnLayout
} from "@cloudscape-design/components";
import { Typography } from "antd";
import { CSSProperties, FC, useEffect, useState } from "react";
import { LayerInfoItem } from "../AnalysisResult";

const { Text } = Typography;

interface LayerInfoProps {
    layer: LayerInfoItem;
}

interface AttributeInfo {
    name: string;
    data_type: any;
    domain: any;
}



const LayerInfo: FC<LayerInfoProps> = ({ layer }) => {
    const [data, setData] = useState<AttributeInfo[] | null>(null);
    const [selectedField, setSelectedField] = useState<string | null>(null);

    const listStyle: CSSProperties = { 'height': 400, 'overflowY': 'auto' };

    const [
        selectedItems,
        setSelectedItems
    ] = useState<any>([]);

    useEffect(() => {
        let firstAttr: any = null;
        const attributes: AttributeInfo[] = [];
        for (const attribute_name of layer.attributes) {
            if (firstAttr === null) {
                firstAttr = attribute_name;
            }
            const attributeInfo: AttributeInfo = {
                name: attribute_name,
                data_type: (<SpaceBetween direction="horizontal" size="xs"><Badge color="green">{layer.attributes_types[attribute_name].join(", ").toUpperCase()}</Badge></SpaceBetween>),
                domain: renderDomain(layer.attributes_numeric_domain[attribute_name])
            }
            attributes.push(attributeInfo)
        }
        setData(attributes);
        if (attributes.length > 0) {
            setSelectedField(attributes[0].name);
        }

        // updating the selection to first element
        if (firstAttr !== null) {
            setSelectedItems([{ name: firstAttr }] as any);
        } else {
            setSelectedItems([]);
        }

    }, [layer])

    const attrSelection = (items: any[]) => {
        setSelectedItems(items);
        if (items.length > 0) {
            setSelectedField(items[0].name);
        }
    }

    const renderDomain = (domain: number[] | null | undefined) => {
        if (domain === null || domain === undefined) return;

        return (<>{domain[0]} - {domain[1]}</>)
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
                <ColumnLayout columns={2}>
                    <Table
                        onSelectionChange={({ detail }) =>
                            attrSelection(detail.selectedItems)
                        }
                        selectedItems={selectedItems}
                        columnDefinitions={[
                            {
                                id: "name",
                                header: "Name",
                                cell: (e: AttributeInfo) => e.name,
                                sortingField: "name"
                            },
                            {
                                id: "data_type",
                                header: "Data Types",
                                cell: (e: AttributeInfo) => e.data_type,
                                sortingField: "data_type"
                            },
                            {
                                id: "domain",
                                header: "Domain",
                                cell: (e: AttributeInfo) => e.domain,
                                sortingField: "domain"
                            }
                        ]}
                        items={data}
                        selectionType="single"
                        trackBy="name"
                        visibleColumns={[
                            "name",
                            "data_type",
                            "domain"
                        ]}
                        empty={
                            <Box textAlign="center" color="inherit">
                                <b>No Attributes</b>
                                <Box
                                    padding={{ bottom: "s" }}
                                    variant="p"
                                    color="inherit"
                                >
                                    No Attributes to display.
                                </Box>
                            </Box>
                        }
                    />
                    {selectedField !== null ? <Container>
                        {headerContent(selectedField, layer.attributes_sample_values[selectedField])}
                        <ul style={{ listStyle: 'None', padding: 0, margin: 0, height: 340, overflow: 'auto' }}>
                            {layer.attributes_sample_values[selectedField] && layer.attributes_sample_values[selectedField].map((item, index) => {
                                return <li style={{ padding: '8px 0px', borderBlockEnd: '1px solid rgba(5, 5, 5, 0.06)' }} key={index}>{item}</li>;
                            })}
                        </ul>
                    </Container> : <Spinner />}
                </ColumnLayout>
                : <Spinner />}
        </>

    )
}

export default LayerInfo;
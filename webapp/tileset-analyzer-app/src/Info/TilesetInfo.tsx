import { FC, useEffect, useState } from "react";
import { AnalysisResult, LayerInfoItem, TilesetInfo } from "../AnalysisResult";
import { bytesToString } from "../Metrics/Support/SizeConversions";
import LayerInfo from "./LayerInfo";
import { Container, Header, ColumnLayout, Box, StatusIndicator, Spinner, Modal, Badge, SpaceBetween, ContentLayout, Grid, Table as CTable, Link, Pagination, TextFilter, PropertyFilter } from "@cloudscape-design/components";
import {
    useCollection
} from "@cloudscape-design/collection-hooks";
import { useLocalStorage } from "../Common/use-local-storage";
import { TableEmptyState, TableNoMatchState } from "../Common/common-components";
import { propertyFilterI18nStrings } from "../Common/property-filter";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<any>(null);



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
                setTableData(data);

            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    const CURRENT_COLUMN_DEFINITIONS = [
        {
            id: "zoom",
            header: "Zoom",
            cell: (e: DataType) => e.zoom,
            sortingField: "zoom"
        },
        {
            id: "layer_name",
            header: "Layer Name",
            cell: (e: DataType) => e.layer_name,
            sortingField: "layer_name"
        },
        {
            id: "geometry_type",
            header: "Geometry Type",
            cell: (e: DataType) => {
                return (
                    <SpaceBetween direction="horizontal" size="xs">
                        {
                            e.geometry_type.map(tag => (
                                <Badge color={'green'} key={tag}>
                                    {tag.toUpperCase()}
                                </Badge>
                            ))
                        }
                    </SpaceBetween>
                );
            },
            sortingField: "geometry_type",
        },
        {
            id: "features_count",
            header: "Features Count",
            cell: (e: DataType) => e.features_count,
            sortingField: "features_count"
        },
        {
            id: "action",
            header: "Action",
            cell: (e: DataType) => <Link onFollow={() => { setCurrentRecord(e); setIsModalOpen(true); }}>view</Link>,
        }
    ];

    const DEFAULT_PREFERENCES = {
        pageSize: 10,
        visibleContent: ['zoom', 'layer_name', 'geometry_type', 'features_count', 'action'],
        wrapLines: false,
        stripedRows: false,
    };

    const [preferences, setPreferences] = useLocalStorage('React-DistributionsTable-Preferences', DEFAULT_PREFERENCES);

    const FILTERING_PROPERTIES: any = [
        {
          propertyLabel: 'Zoom Level',
          key: 'zoom',
          groupValuesLabel: 'Zoom Level values',
          operators: [':', '!:', '=', '!=', "<", "<=", ">", ">="],
        },
        {
          propertyLabel: 'Layer Name',
          key: 'layer_name',
          groupValuesLabel: 'Layer Name Values',
          operators: [':', '!:', '=', '!='],
        },
        {
            propertyLabel: 'Geometry Type',
            key: 'geometry_type',
            groupValuesLabel: 'Geometry Type Values',
            operators: [':', '!:', '=', '!='],
          },
          {
            propertyLabel: 'Features Count',
            key: 'features_count',
            groupValuesLabel: 'Features Count Values',
            operators: [':', '!:', '=', '!=', "<", "<=", ">", ">="],
          },
      ];
    const { items, actions, filteredItemsCount, collectionProps, paginationProps, propertyFilterProps } = useCollection(
        tableData === null ? [] : tableData,
        {
            propertyFiltering: {
                filteringProperties: FILTERING_PROPERTIES,
                empty: <TableEmptyState resourceName="Layer" />,
                noMatch: <TableNoMatchState
                    onClearFilter={() => {
                        actions.setPropertyFiltering({ tokens: [], operation: 'and' });
                    }}
                />,
            },
            pagination: { pageSize: preferences.pageSize },
            sorting: { defaultState: { sortingColumn: CURRENT_COLUMN_DEFINITIONS[0] } },
            selection: {},
        }
    );
    const [query, setQuery] = useState({
        tokens: [],
        operation: "and"
    });
    const getTextFilterCounterText = (count: number) => `${count} ${count === 1 ? 'match' : 'matches'}`;

    return (
        <ContentLayout header={<Header
            variant="h1">Tileset Info</Header>}>
            <SpaceBetween size="m">
                <Container>
                    {tilesetInfo !== null ? <ColumnLayout columns={2} variant="text-grid">
                        <div>
                            <Box variant="awsui-key-label">Name</Box>
                            <div>{tilesetInfo.name}</div>
                            <Box variant="awsui-key-label">Location</Box>
                            <div>{tilesetInfo.location}</div>
                            <Box variant="awsui-key-label">DataSource Type</Box>
                            <div>{tilesetInfo.ds_type}</div>
                        </div>
                        <div>
                            <Box variant="awsui-key-label">Scheme</Box>
                            <div>{tilesetInfo.scheme}</div>
                            <Box variant="awsui-key-label">Size</Box>
                            <div>{bytesToString(tilesetInfo.size, true)}</div>
                            <Box variant="awsui-key-label">Compression</Box>
                            <div>{tilesetInfo.compressed ? tilesetInfo.compression_type : 'False'}</div>
                        </div>
                    </ColumnLayout> : <Spinner />}
                </Container>

                <Container header={<Header variant="h2">Explore Attributes</Header>}>
                    {tableData != null ? <CTable
                        {...collectionProps}
                        pagination={<Pagination {...paginationProps} />}
                        filter={
                            <PropertyFilter
                                {...propertyFilterProps}
                                i18nStrings={propertyFilterI18nStrings}
                                countText={getTextFilterCounterText(filteredItemsCount!)}
                                expandToViewport={true}
                            />
                        }
                        items={items} variant="embedded" columnDefinitions={CURRENT_COLUMN_DEFINITIONS} /> : <Spinner />}
                    <Modal
                        header={`${currentRecord?.layer_info_item?.name} Layer Attributes`}
                        visible={isModalOpen}
                        onDismiss={() => setIsModalOpen(false)}
                        size="large"
                    >
                        {currentRecord != null ? <LayerInfo layer={currentRecord.layer_info_item}></LayerInfo> : <Spinner />}
                    </Modal>
                </Container>
            </SpaceBetween>

        </ContentLayout>

    )
}

export default TileSetInfo;
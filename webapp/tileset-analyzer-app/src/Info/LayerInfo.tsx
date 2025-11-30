import {
  Container,
  Spinner,
  Table,
  Box,
  SpaceBetween,
  Badge,
  ColumnLayout,
  Grid,
  Pagination,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { CSSProperties, FC, useEffect, useState } from 'react';
import { LayerInfoItem } from '../AnalysisResult';
import { useLocalStorage } from '../Common/use-local-storage';

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
  const DEFAULT_PREFERENCES = {
    pageSize: 5,
    visibleContent: ['name', 'data_type', 'domain'],
    wrapLines: false,
    stripedRows: false,
  };

  const [preferences, setPreferences] = useLocalStorage(
    'React-DistributionsTable-Preferences',
    DEFAULT_PREFERENCES
  );
  const CURRENT_COLUMN_DEFINITIONS = [
    {
      id: 'name',
      header: 'Name',
      cell: (e: AttributeInfo) => e.name,
      sortingField: 'name',
    },
    {
      id: 'data_type',
      header: 'Data Types',
      cell: (e: AttributeInfo) => e.data_type,
      sortingField: 'data_type',
    },
    {
      id: 'domain',
      header: 'Domain',
      cell: (e: AttributeInfo) => e.domain,
      sortingField: 'domain',
    },
  ];
  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } =
    useCollection(data === null ? [] : data, {
      filtering: {
        empty: <p>Empty</p>,
        noMatch: <p>noMatch</p>,
      },
      pagination: { pageSize: preferences.pageSize },
      sorting: { defaultState: { sortingColumn: CURRENT_COLUMN_DEFINITIONS[0] } },
      selection: {},
    });

  const [selectedItems, setSelectedItems] = useState<any>([]);

  useEffect(() => {
    let firstAttr: any = null;
    const attributes: AttributeInfo[] = [];
    for (const attribute_name of layer.attributes) {
      if (firstAttr === null) {
        firstAttr = attribute_name;
      }
      const attributeInfo: AttributeInfo = {
        name: attribute_name,
        data_type: (
          <SpaceBetween direction="horizontal" size="xs">
            <Badge color="green">
              {layer.attributes_types[attribute_name].join(', ').toUpperCase()}
            </Badge>
          </SpaceBetween>
        ),
        domain: renderDomain(layer.attributes_numeric_domain[attribute_name]),
      };
      attributes.push(attributeInfo);
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
  }, [layer]);

  const attrSelection = (items: any[]) => {
    setSelectedItems(items);
    if (items.length > 0) {
      setSelectedField(items[0].name);
    }
  };

  const renderDomain = (domain: number[] | null | undefined) => {
    if (domain === null || domain === undefined) return;

    return (
      <>
        {domain[0]} - {domain[1]}
      </>
    );
  };

  const headerContent = (selectedField: string, attrValues: string[] | undefined) => {
    if (!attrValues) {
      return (
        <p>
          <b>no value(s) found for {selectedField}</b>
        </p>
      );
    }
    if (attrValues.length === 100) {
      return (
        <p>
          <b>contains 100+ distinct values for {selectedField}. truncated to first 100 values.</b>
        </p>
      );
    }
    return (
      <p>
        <b>
          {attrValues.length} distinct value(s) for {selectedField}
        </b>
      </p>
    );
  };

  return (
    <>
      {data !== null ? (
        <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
          <Container fitHeight>
            <Table
              {...collectionProps}
              variant="embedded"
              onSelectionChange={({ detail }) => attrSelection(detail.selectedItems)}
              selectedItems={selectedItems}
              columnDefinitions={CURRENT_COLUMN_DEFINITIONS}
              items={items}
              selectionType="single"
              trackBy="name"
              visibleColumns={['name', 'data_type', 'domain']}
              pagination={<Pagination {...paginationProps} />}
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No Attributes</b>
                  <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                    No Attributes to display.
                  </Box>
                </Box>
              }
            />
          </Container>

          {selectedField !== null ? (
            <Container>
              {headerContent(selectedField, layer.attributes_sample_values[selectedField])}
              <ul
                style={{ listStyle: 'None', padding: 0, margin: 0, height: 340, overflow: 'auto' }}
              >
                {layer.attributes_sample_values[selectedField] &&
                  layer.attributes_sample_values[selectedField].map((item, index) => {
                    return (
                      <li
                        style={{
                          padding: '8px 0px',
                          borderBlockEnd: '1px solid rgba(5, 5, 5, 0.06)',
                        }}
                        key={index}
                      >
                        {item}
                      </li>
                    );
                  })}
              </ul>
            </Container>
          ) : (
            <Spinner />
          )}
        </Grid>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default LayerInfo;

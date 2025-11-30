export const renderPopup = (features: any[]): string => {
  return `<div class="mbview_popup">${renderFeatures(features)}</div>`;
};

const displayValue = (value: any, propName: any) => {
  if (typeof value === 'undefined' || value === null) return value;
  if (typeof value === 'object' || typeof value === 'number' || typeof value === 'string') {
    return value.toString();
  }
  return value;
};

const renderProperty = (propertyName: string, property: any) => {
  return `<div class="mbview_property"><div class="mbview_property-name">${propertyName}</div><div class="mbview_property-value">${displayValue(
    property,
    propertyName
  )}</div></div>`;
};

const renderLayer = (layerId: string) => {
  return `<div class="mbview_layer">${layerId}</div>`;
};

const renderProperties = (feature: any) => {
  const sourceProperty = renderLayer(feature.layer['source-layer'] || feature.layer.source);
  const idProperty = renderProperty('$id', feature.id);
  const typeProperty = renderProperty('$type', feature.geometry.type);
  const properties = Object.keys(feature.properties).map(propertyName => {
    return renderProperty(propertyName, feature.properties[propertyName]);
  });
  properties.push(
    renderProperty('Source Layer', feature.layer['source-layer'] || feature.layer.source)
  );
  properties.push(renderProperty('Layer Id', feature.layer['id'] || feature.layer.id));
  const content = (
    feature.id ? [sourceProperty, idProperty, typeProperty] : [sourceProperty, typeProperty]
  )
    .concat(properties)
    .join('');
  return content;
};

const renderFeatures = (features: any[]) => {
  return features
    .map(item => {
      const content = renderProperties(item);
      return `<div class="mbview_feature">${content}</div>`;
    })
    .join('');
};

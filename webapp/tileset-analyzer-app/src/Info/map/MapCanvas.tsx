import React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './../../map.scss';
import { Map as MapLibreGlMap } from 'maplibre-gl'
import { AnalysisResult, LayerInfoItem } from '../../AnalysisResult';


interface Location {
    lng: number;
    lat: number;
    zoom: number
}

interface IProps {
}

interface IState {
    loc: Location;
}


export default class MapCanvas extends React.PureComponent<IProps, IState> {
    mapContainer = React.createRef<HTMLDivElement>();
    map: MapLibreGlMap | null = null
    constructor(props: any) {
        super(props);
        this.state = {
            loc: {
                lng: -91.0479, lat: 36.7892, zoom: 4
            }
        };
    }

    getLayerStyle(layerInfoItem: LayerInfoItem): any[] {
        const layerStyles: any[] = [];
        const color = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`;
        //console.log(layerInfoItem);
        for (const geometry_type of layerInfoItem.geometry_types) {
            if (geometry_type === 'line_string') {
                layerStyles.push({
                    'id': `${layerInfoItem.name}_${layerInfoItem.zoom_level}_${geometry_type}`,
                    'type': 'line',
                    'source': 'vt',
                    'source-layer': layerInfoItem.name,
                    'filter': ["==", "$type", "LineString"],
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': color,
                        'line-width': 1,
                        'line-opacity': 0.75
                    },
                    'minzoom': layerInfoItem.zoom_level,
                    'maxzoom': layerInfoItem.zoom_level
                });
            }
            else if (geometry_type === 'polygon') {
                layerStyles.push({
                    'id': `${layerInfoItem.name}_${layerInfoItem.zoom_level}_${geometry_type}`,
                    'type': 'fill',
                    'source': 'vt',
                    'source-layer': layerInfoItem.name,
                    'filter': ["==", "$type", "Polygon"],
                    'layout': {
                    },
                    'paint': {
                        'fill-color': color,
                        'fill-opacity': 0.1
                    },
                    'minzoom': layerInfoItem.zoom_level,
                    'maxzoom': layerInfoItem.zoom_level
                });
            }
            else if (geometry_type === 'point') {
                layerStyles.push({
                    'id': `${layerInfoItem.name}_${layerInfoItem.zoom_level}`,
                    'type': 'circle',
                    'source': 'vt',
                    'source-layer': layerInfoItem.name,
                    'filter': ["==", "$type", "Point"],
                    'paint': {
                        'circle-color': color,
                        'circle-radius': 2.5,
                        'circle-opacity': 0.75
                    },
                    'minzoom': layerInfoItem.zoom_level,
                    'maxzoom': layerInfoItem.zoom_level
                });
            }
            else {
                console.log('unhandled geometry type');
            }
        }

        return layerStyles;
    }

    async componentDidMount() {
        const { loc } = this.state;

        const response = await fetch('http://0.0.0.0:8080/api/analysis_result.json');
        const layerInfoItems = (await response.json() as AnalysisResult).tileset_info.layer_info_items;
        //console.log(layerInfoItems);
        const zItems = new Set(layerInfoItems.map(item => item.zoom_level));
        const styleJson: any = {
            version: 8,
            sources: {
                osm: {
                    type: 'raster',
                    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                    tileSize: 256,
                    attribution: 'Map tiles by <a target="_top" rel="noopener" href="https://tile.openstreetmap.org/">OpenStreetMap tile servers</a>, under the <a target="_top" rel="noopener" href="https://operations.osmfoundation.org/policies/tiles/">tile usage policy</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>'
                },
                vt: {
                    type: 'vector',
                    tiles: ["http://0.0.0.0:8080/tileset/{z}/{x}/{y}.mvt"],
                    minzoom: Math.min(...Array.from(zItems)),
                    maxzoom: Math.max(...Array.from(zItems))
                }
            },
            layers: [{
                id: 'osm',
                type: 'raster',
                source: 'osm',
            }],
        };


        for (const layerInfoItem of layerInfoItems) {
            const layerStyles = this.getLayerStyle(layerInfoItem);
            for (const layerStyle of layerStyles) {
                styleJson['layers'].push(layerStyle);
            }
        }
        this.map = new maplibregl.Map({
            container: this.mapContainer.current!,
            style: styleJson,
            center: [loc.lng, loc.lat],
            zoom: loc.zoom
        });

        this.map.addControl(new maplibregl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true
        }), 'top-right');


        this.map.on('move', () => {
            if (!this.map) return;
            this.setState({
                ...this.state, ...{
                    loc: {
                        lng: Number(this.map.getCenter().lng.toFixed(4)),
                        lat: Number(this.map.getCenter().lat.toFixed(4)),
                        zoom: Number(this.map.getZoom().toFixed(2))
                    }
                }
            });
        });
    }


    render() {
        const { loc } = this.state;
        return (
            <div className="map-wrap">
                <div className="sidebar">
                    Longitude: {loc.lng} | Latitude: {loc.lat} | Zoom: {loc.zoom}
                </div>
                <div ref={this.mapContainer} className="map" />
            </div>
        );
    }

}
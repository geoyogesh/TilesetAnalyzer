import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import './../../map.scss';
import { FullscreenControl, Map as MapLibreGlMap, NavigationControl, PointLike, Popup } from 'maplibre-gl'
import { AnalysisResult, LayerInfoItem } from '../../AnalysisResult';
import { features } from 'process';
import { type } from 'os';
import { renderPopup } from './RenderPopup';


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
    showPopup = true;
    popup = new Popup({
        closeButton: false,
        closeOnClick: false,
        maxWidth: '300px'
    });
    map: MapLibreGlMap | null = null
    constructor(props: any) {
        super(props);
        this.state = {
            loc: {
                lng: -91.0479, lat: 36.7892, zoom: 4
            }
        };
    }

    getColor(i: number) {
        /*
        const colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];
        if (i < colors.length) {
            return colors[i]
        }
        */

        return `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`;
    }

    getLayerStyle(color: string, layer_name: string, geometry_type: string): any {
        if (geometry_type === 'line_string') {
            return {
                'id': `${layer_name}_${geometry_type}`,
                'type': 'line',
                'source': 'vt',
                'source-layer': layer_name,
                'filter': ["==", "$type", "LineString"],
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': color,
                    'line-width': 1,
                    'line-opacity': 0.75
                }
            };
        }
        else if (geometry_type === 'polygon') {
            return {
                'id': `${layer_name}_${geometry_type}`,
                'type': 'line',
                'source': 'vt',
                'source-layer': layer_name,
                'filter': ["==", "$type", "Polygon"],
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': color,
                    'line-width': 1,
                    'line-opacity': 0.75
                }
            };
            /*
            return {
                'id': `${layer_name}_${geometry_type}`,
                'type': 'fill',
                'source': 'vt',
                'source-layer': layer_name,
                'filter': ["==", "$type", "Polygon"],
                'layout': {
                },
                'paint': {
                    'fill-color': color,
                    'fill-opacity': 0.1
                }
            };
            */
        }
        else if (geometry_type === 'point') {
            return {
                'id': `${layer_name}_${geometry_type}`,
                'type': 'circle',
                'source': 'vt',
                'source-layer': layer_name,
                'filter': ["==", "$type", "Point"],
                'paint': {
                    'circle-color': color,
                    'circle-radius': 2.5,
                    'circle-opacity': 0.75
                }
            };
        }
        else {
            console.log('unhandled geometry type');
        }
        return null;
    }

    async componentDidMount() {
        const { loc } = this.state;

        const response = await fetch('http://0.0.0.0:8080/api/analysis_result.json');
        const layerInfoItems = (await response.json() as AnalysisResult).tileset_info.layer_info_items;
        //console.log(layerInfoItems);
        const zItems = new Set(layerInfoItems.map(item => item.zoom_level));
        const layerGeometryTypes = new Map<string, Set<string>>();
        for (const layerInfoItem of layerInfoItems) {
            if (!(layerInfoItem.name in layerGeometryTypes)) {
                layerGeometryTypes.set(layerInfoItem.name, new Set()) 
            }

            const layerGeometryType = layerGeometryTypes.get(layerInfoItem.name) as Set<string>;
            for (const geometryType of layerInfoItem.geometry_types) {
                if (!layerGeometryType.has(geometryType)) {
                    layerGeometryType.add(geometryType);
                }
            }
        }
        const styleJson: any = {
            version: 8,
            sources: {
                osm: {
                    type: 'raster',
                    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                    tileSize: 256,
                    attribution: 'Map tiles by <a target="_top" rel="noopener" href="https://tile.openstreetmap.org/">OpenStreetMap tile servers</a>, under the <a target="_top" rel="noopener" href="https://operations.osmfoundation.org/policies/tiles/">tile usage policy</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>',
                    minzoom: Math.min(...Array.from(zItems)),
                    maxzoom: Math.max(...Array.from(zItems))
                },
                vt: {
                    type: 'vector',
                    tiles: ["http://0.0.0.0:8080/tileset/{z}/{x}/{y}.mvt"],
                    minzoom: Math.min(...Array.from(zItems)),
                    maxzoom: Math.max(...Array.from(zItems)),
                    tileSize: 512,
                }
            },
            layers: [
                {
                    id: 'osm',
                    type: 'raster',
                    source: 'osm',
                }
                
            ],
        };


        const geometryOrder = ['point', 'line_string', 'polygon'];

        let layerIndex = 0
        for (const orderGeometry of geometryOrder) {
            const color = this.getColor(layerIndex);
            for (let [layer_name, geometryTypes] of layerGeometryTypes) {
                if (geometryTypes.has(orderGeometry)) {
                    styleJson.layers.push(this.getLayerStyle(color, layer_name, orderGeometry));
                }
            }
            layerIndex += 1
        }
        

        //console.log(styleJson);
        this.map = new MapLibreGlMap({
            container: this.mapContainer.current!,
            style: styleJson,
            center: [loc.lng, loc.lat],
            zoom: loc.zoom,
            minZoom: Math.min(...Array.from(zItems)),
            maxZoom: Math.max(...Array.from(zItems))
        });

        this.map.addControl(new NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true
        }), 'top-right');

        this.map.addControl(new FullscreenControl({}));


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


        this.map.on('mousemove', (e) => {
            if (!this.map) return;

            const threshold = 3;
            const queryBox:  [PointLike, PointLike] = [
                [
                    e.point.x - threshold,
                    e.point.y + threshold
                ],
                [
                    e.point.x + threshold,
                    e.point.y - threshold
                ]
            ];
            const features = this.map.queryRenderedFeatures(queryBox);
            this.map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

            if (!features.length || !this.showPopup) {
                this.popup.remove();
            } else {
                this.popup.setLngLat(e.lngLat).setHTML(renderPopup(features)).addTo(this.map);
            }

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
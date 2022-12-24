import React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './../../map.scss';
import { Map as MapLibreGlMap } from 'maplibre-gl'


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

    componentDidMount() {
        const { loc } = this.state;

        this.map = new maplibregl.Map({
            container: this.mapContainer.current!,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                        tileSize: 256,
                        attribution: 'Map tiles by <a target="_top" rel="noopener" href="https://tile.openstreetmap.org/">OpenStreetMap tile servers</a>, under the <a target="_top" rel="noopener" href="https://operations.osmfoundation.org/policies/tiles/">tile usage policy</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>'
                    }
                },
                layers: [{
                    id: 'osm',
                    type: 'raster',
                    source: 'osm',
                }],
            },
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
            this.setState({ ...this.state, ...{
                loc: {
                    lng: Number(this.map.getCenter().lng.toFixed(4)),
                    lat: Number(this.map.getCenter().lat.toFixed(4)),
                    zoom: Number(this.map.getZoom().toFixed(2))
                }
            }});
    });
}


render () {
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
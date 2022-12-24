import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './../../map.scss';
import { Map as MapLibreGlMap } from 'maplibre-gl'

export default function MapCanvas() {
    const mapContainer = useRef(null);
    const map = useRef<MapLibreGlMap | null>(null);
    const [lng] = useState(-78);
    const [lat] = useState(37);
    const [zoom] = useState(4);

    useEffect(() => {
        if (map.current) return; //stops map from intializing more than once
        map.current = new maplibregl.Map({
            container: mapContainer.current!,
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
            center: [lng, lat],
            zoom: zoom
        });

        map.current.addControl(new maplibregl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true
        }), 'top-right');

    });

    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
        </div>
    );
}
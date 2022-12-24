
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import ErrorPage from "./Error/ErrorPage";
import Layout from "./Layout/LayoutPage";
import TileCount from "./Metrics/TileCountPage";
import TileSize from "./Metrics/TileSizePage";
import 'antd/dist/reset.css';
import './App.scss';
import React, { FC } from 'react';
import TilesetInfo from "./Info/TilesetInfo";
import LayerTileSize from "./Metrics/LayerTileSizePage";
import LayerSizeTree from "./Metrics/LayerSizeTreePage";

const App: FC = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "/",
                    element: <Navigate to="/tile-size" />,
                },
                {
                    path: "/tileset-info",
                    element: <TilesetInfo />,
                },
                {
                    path: "/tile-size",
                    element: <TileSize />,
                },
                {
                    path: "/tile-count",
                    element: <TileCount />,
                },
                {
                    path: "/tile-layer-size",
                    element: <LayerTileSize />,
                },
                {
                    path: "/tile-layer-size-tree-map",
                    element: <LayerSizeTree />,
                },
            ],
        },
    ]);

    return (<RouterProvider router={router} />);
}

export default App;
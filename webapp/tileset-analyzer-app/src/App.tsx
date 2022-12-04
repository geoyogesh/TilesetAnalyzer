
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
import './App.css';

function App1() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "/",
                    element: <Navigate to="/tilesize" />,
                },
                {
                    path: "/tilesize",
                    element: <TileSize />,
                },
                {
                    path: "/tilecount",
                    element: <TileCount />,
                },
            ],
        },
    ]);

    return (<RouterProvider router={router} />);
}

export default App1;
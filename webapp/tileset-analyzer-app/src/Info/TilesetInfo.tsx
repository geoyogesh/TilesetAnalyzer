import { FC, useEffect, useState } from "react";
import { AnalysisResult, TilesetInfo } from "../AnalysisResult";
import { Skeleton, Space, Typography } from 'antd';
import { bytesToString } from "../Metrics/SizeConversions";

const { Title, Paragraph, Text } = Typography;

const TileSetInfo: FC = () => {

    const [tilesetInfo, setTilesetInfo] = useState<TilesetInfo | null>(null);

    useEffect(() => {
        fetch('http://0.0.0.0:8080/api/analysis_result.json')
            .then((res) => res.json())
            .then((res: AnalysisResult) => {
                setTilesetInfo(res.tileset_info);

            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    return (
        <>
            <Title level={4}>TileSetInfo</Title>
            {tilesetInfo !== null ?
                <Space direction="vertical">
                    <Text>Name: {tilesetInfo.name}</Text>
                    <Text>Location: {tilesetInfo.location}</Text>
                    <Text>DataSource Type: {tilesetInfo.ds_type}</Text>
                    <Text>Scheme: {tilesetInfo.scheme}</Text>
                    <Text>Size: {bytesToString(tilesetInfo.size, true)}</Text>
                </Space>
                : <Skeleton />
            }
        </>

    )
}

export default TileSetInfo;
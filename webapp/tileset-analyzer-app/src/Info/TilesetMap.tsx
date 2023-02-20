import { Container, ContentLayout, Header } from "@cloudscape-design/components";
import { FC } from "react";
import MapCanvas from "./map/MapCanvas";


const TileSetMap: FC = () => {
    return (
        <ContentLayout header={<Header
            variant="h1">Tileset Map View</Header>}>
            <Container>
                <MapCanvas></MapCanvas>
            </Container>
        </ContentLayout>
    )
}

export default TileSetMap;
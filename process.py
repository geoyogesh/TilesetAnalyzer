


from utils.mbtiles_utils import count_tiles, count_tiles_by_z
from utils.sqllite_utils import create_connection
from entities.tileset_analysis_result import TilesetAnalysisResult



def main():
    print('started')


    mbtile = 'data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles'
    conn = create_connection(mbtile)

    result = TilesetAnalysisResult()
    result.set_total_tile_count(count_tiles(conn))
    result.set_count_tiles_by_z(count_tiles_by_z(conn))

    print(result.get_json()) 
    print('completed')

if __name__ == "__main__":
   main()
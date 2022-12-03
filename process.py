


from utils.json_utils import write_json_file
from data_source.mbtiles.mbtiles_utils import count_tiles, count_tiles_by_z
from data_source.mbtiles.sqllite_utils import create_connection
from entities.tileset_analysis_result import TilesetAnalysisResult



def main():
    print('started')


    mbtile = 'data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles'
    conn = create_connection(mbtile)

    result = TilesetAnalysisResult()
    result.set_count_tiles_total(count_tiles(conn))
    result.set_count_tiles_by_z(count_tiles_by_z(conn))

    write_json_file(result.get_json(), 'output/analysis_result.json')
    print('completed')

if __name__ == "__main__":
   main()
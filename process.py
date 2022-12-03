


from data_source.tile_source_factory import TilesetSourceFactory
from utils.json_utils import write_json_file




def main():
    print('started')


    src_path = 'data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles'

    data_source = TilesetSourceFactory.get_tileset_source(src_path)
    result = data_source.analyze()

    write_json_file(result.get_json(), 'output/analysis_result.json')
    print('completed')

if __name__ == "__main__":
   main()
import abc
from sqlite3 import Connection
from tileset_analyzer.data_source.mbtiles.mbtiles_source import MBTileSource
from tileset_analyzer.entities.job_param import JobParam


class TilesetSourceFactory:
    @staticmethod
    def get_tileset_source(job_param: JobParam):
        try:
            if job_param.source.endswith('mbtiles'):
                return MBTileSource(job_param)
            
            raise AssertionError("Tileset Type is not valid.")
        except AssertionError as e:
            print(e)

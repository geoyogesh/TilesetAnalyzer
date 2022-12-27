import abc
from sqlite3 import Connection

from tileset_analyzer.data_source.folder_tiles.folder_tiles_source import FolderTilesSource
from tileset_analyzer.data_source.mbtiles.mbtiles_source import MBTilesSource
from tileset_analyzer.entities.job_param import JobParam
import os


class TilesetSourceFactory:
    @staticmethod
    def get_tileset_source(job_param: JobParam):
        try:
            if os.path.isdir(job_param.source):
                return FolderTilesSource(job_param)
            elif os.path.isfile(job_param.source) or job_param.source.endswith('mbtiles'):
                return MBTilesSource(job_param)
            
            raise AssertionError("Tileset Type is not valid.")
        except AssertionError as e:
            print(e)

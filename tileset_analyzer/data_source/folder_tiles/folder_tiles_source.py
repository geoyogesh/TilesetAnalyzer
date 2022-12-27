import os
from pathlib import Path
from typing import List

from tileset_analyzer.data_source.ds_utils import get_attr
from tileset_analyzer.data_source.folder_tiles.folder_utils import get_folder_size, list_files_dir
from tileset_analyzer.data_source.tile_source import TileSource
from tileset_analyzer.entities.job_param import JobParam, CompressionType
from tileset_analyzer.entities.layer_info import LayerInfo
from tileset_analyzer.entities.layer_level_size import LayerLevelSize
from tileset_analyzer.entities.level_count import LevelCount
from tileset_analyzer.entities.level_size import LevelSize
from tileset_analyzer.entities.tile_item import TileItem
from tileset_analyzer.entities.tileset_analysis_result import TilesetAnalysisResult
from tileset_analyzer.entities.tileset_info import TilesetInfo
import re
import gzip
import multiprocessing
from multiprocessing.pool import ThreadPool as Pool
from tileset_analyzer.readers.vector_tile.engine import VectorTile


class FolderTilesSource(TileSource):
    def __init__(self, job_param: JobParam):
        self.job_param = job_param

    def count_tiles(self) -> int:
        pass

    def count_tiles_by_z(self) -> List[LevelCount]:
        pass

    def tiles_size_agg_sum_by_z(self) -> List[LevelSize]:
        pass

    def tiles_size_agg_min_by_z(self) -> List[LevelSize]:
        pass

    def tiles_size_agg_max_by_z(self) -> List[LevelSize]:
        pass

    def tiles_size_agg_avg_by_z(self) -> List[LevelSize]:
        pass

    def tiles_size_agg_50p_by_z(self) -> List[LevelSize]:
        pass

    def tiles_size_agg_85p_by_z(self) -> List[LevelSize]:
        pass

    def tiles_size_agg_90p_by_z(self) -> List[LevelSize]:
        pass

    def tiles_size_agg_95p_by_z(self) -> List[LevelSize]:
        pass

    def tiles_size_agg_99p_by_z(self) -> List[LevelSize]:
        pass

    def _get_all_tiles(self) -> List[TileItem]:
        files = list_files_dir(self.job_param.source, ['*.pbf', '*.mvt'])
        result: List[LevelSize] = []
        for file, data in files:
            g = re.match("(\d+)/(\d+)/(\d+).pbf", file).groups()
            result.append(TileItem(int(g[1]), int(g[2]), int(g[0]), data))
        return result

    def tileset_info(self) -> TilesetInfo:
        tileset_info = TilesetInfo()

        loc = str(Path(self.job_param.source).absolute())
        tileset_info.set_name(Path(self.job_param.source).absolute().name)
        tileset_info.set_size(get_folder_size(loc))
        tileset_info.set_scheme(self.job_param.scheme)
        tileset_info.set_location(loc)
        tileset_info.set_ds_type('folder')
        tileset_info.set_compression(self.job_param.compressed, self.job_param.compression_type)

        tiles = self._get_all_tiles()
        all_layers = get_attr(tiles, self.job_param.compressed, self.job_param.compression_type)
        tileset_info.set_layer_info(all_layers)
        return tileset_info

    def tiles_size_agg_sum_by_z_layer(self) -> List[LayerLevelSize]:
        pass

    def tiles_size_agg_min_by_z_layer(self) -> List[LayerLevelSize]:
        pass

    def tiles_size_agg_max_by_z_layer(self) -> List[LayerLevelSize]:
        pass

    def tiles_size_agg_avg_by_z_layer(self) -> List[LayerLevelSize]:
        pass

    def tiles_size_agg_50p_by_z_layer(self) -> List[LayerLevelSize]:
        pass

    def tiles_size_agg_85p_by_z_layer(self) -> List[LayerLevelSize]:
        pass

    def tiles_size_agg_90p_by_z_layer(self) -> List[LayerLevelSize]:
        pass

    def tiles_size_agg_95p_by_z_layer(self) -> List[LayerLevelSize]:
        pass

    def tiles_size_agg_99p_by_z_layer(self) -> List[LayerLevelSize]:
        pass

    def analyze(self) -> TilesetAnalysisResult:
        result = TilesetAnalysisResult()
        result.set_tileset_info(self.tileset_info())
        return result

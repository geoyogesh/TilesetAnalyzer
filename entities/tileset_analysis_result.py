from collections import namedtuple
from typing import List
import json
from entities.level_count import LevelCount

#LevelCount = namedtuple('LevelCount', ['z', 'count'])

class CustomEncoder(json.JSONEncoder):
    def default(self, o):
            return o.__dict__

class TilesetAnalysisResult:
    def __init__(self):
        pass
    
    def set_total_tile_count(self, num: int):
        self.total_tile_count = num

    def set_count_tiles_by_z(self, level_counts: List[LevelCount]):
        self.count_tiles_by_z = level_counts

    
    def get_json(self):
        return json.dumps(self.__dict__, indent=4, cls=CustomEncoder)
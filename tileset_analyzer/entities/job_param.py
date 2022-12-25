from enum import Enum
from typing import List


class JobAction(str, Enum):
    PROCESS = 'process'
    SERVE = 'serve'


class CompressionType(str, Enum):
    GZIP = 'gzip'


class TileScheme(str, Enum):
    TMS = 'TMS'
    XYZ = 'XYZ'


class JobParam:
    def __init__(self,
                 source: str = None,
                 scheme: TileScheme = None,
                 temp_folder: str = None,
                 actions: List[JobAction] = None,
                 compressed: bool = False,
                 compression_type: CompressionType = CompressionType.GZIP,
                 verbose: str = False):
        self.source = source
        self.scheme = scheme
        self.temp_folder = temp_folder
        self.actions = actions
        self.compressed = compressed
        self.compression_type = compression_type
        self.verbose = verbose



from typing import List


class JobParam:
    def __init__(self,
                 source: str = None,
                 scheme: str = None,
                 temp_folder: str = None,
                 actions: List[str] = None,
                 compressed: bool = False,
                 compression_type: str = 'gzip',
                 verbose: str = False):
        self.source = source
        self.scheme = scheme
        self.temp_folder = temp_folder
        self.actions = actions
        self.compressed = compressed
        self.compression_type = compression_type
        self.verbose = verbose


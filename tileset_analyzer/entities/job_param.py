from typing import List


class JobParam:
    def __init__(self,
                 source: str = None,
                 scheme: str = None,
                 temp_folder: str = None,
                 actions: List[str] = None,
                 verbose: str = False):
        self.source: str = source
        self.scheme: str = scheme
        self.temp_folder: int = temp_folder
        self.actions: List[str] = actions
        self.verbose: bool = verbose


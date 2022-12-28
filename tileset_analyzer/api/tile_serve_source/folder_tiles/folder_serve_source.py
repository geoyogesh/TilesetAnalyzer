from tileset_analyzer.entities.job_param import JobParam
import os


def get_folder_serve_source(job_param: JobParam, z: int, x: int, y: int):
    tile_file_path = f'{job_param.source}/{z}/{x}/{y}.pbf'
    if not os.path.isfile(tile_file_path):
        return None
    with open(tile_file_path, mode="rb") as tile_file:
        return tile_file.read()


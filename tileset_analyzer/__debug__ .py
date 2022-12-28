from main import execute
from tileset_analyzer.entities.job_param import JobParam, CompressionType, JobAction



def run_mbtiles_analyze():
    src_path = 'data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles'
    temp_folder = 'tileset_analyzer/static/data'
    scheme = 'TMS'
    actions = [JobAction.PROCESS, JobAction.SERVE]
    compressed = True
    compression_type = CompressionType.GZIP
    job_param = JobParam(
        source=src_path,
        scheme=scheme,
        temp_folder=temp_folder,
        actions=actions,
        verbose=False,
        compressed=compressed,
        compression_type=compression_type
    )
    execute(job_param)
def folder_tiles_analyze():
    src_path = 'data/tiles/'
    temp_folder = 'tileset_analyzer/static/data'
    scheme = 'XYZ'
    actions = [JobAction.PROCESS, JobAction.SERVE]
    compressed = False
    compression_type = None
    job_param = JobParam(
        source=src_path,
        scheme=scheme,
        temp_folder=temp_folder,
        actions=actions,
        verbose=False,
        compressed=compressed,
        compression_type=compression_type
    )
    execute(job_param)


if __name__ == "__main__":
    # run_mbtiles_analyze()
    folder_tiles_analyze()






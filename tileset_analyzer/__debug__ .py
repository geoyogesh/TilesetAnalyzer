from main import execute
from tileset_analyzer.entities.job_param import JobParam

if __name__ == "__main__":
    src_path = 'data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles'
    temp_folder = 'tileset_analyzer/static/data'
    scheme = 'TMS'
    actions = ['process', 'serve']
    compressed = True
    compression_type = 'gzip'
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

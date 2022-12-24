from main import execute
from tileset_analyzer.entities.job_param import JobParam

if __name__ == "__main__":
    src_path = 'data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles'
    temp_folder = 'tileset_analyzer/static/data'
    scheme = 'TMS'
    actions = ['process', 'serve']
    job_param = JobParam(src_path, scheme, temp_folder, actions, False)
    execute(job_param)

from tileset_analyzer.data_source.mbtiles.sqllite_utils import create_connection
from tileset_analyzer.entities.job_param import JobParam

conn = None


def get_mbtiles_source(job_param: JobParam, z: int, x: int, y: int):
    global conn

    if conn is None:
        conn = create_connection(job_param.source)

    cur = conn.cursor()
    cur.execute(f'select tile_data from tiles where zoom_level = {z} and tile_row = {x} and tile_column = {y}')
    row = cur.fetchone()

    if row:
        return row[0]
    return None

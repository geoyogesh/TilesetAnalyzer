from collections import namedtuple
from sqlite3 import Connection
from typing import List
from entities.tileset_analysis_result import LevelCount
from .sql_queries import SQL_COUNT_TILES, SQL_COUNT_TILES_BY_Z

def count_tiles(conn: Connection) -> int:
    cur = conn.cursor()
    cur.execute(SQL_COUNT_TILES)
    count = cur.fetchone()[0]
    return count


def count_tiles_by_z(conn: Connection) -> List[LevelCount]:
    cur = conn.cursor()
    cur.execute(SQL_COUNT_TILES_BY_Z)
    rows = cur.fetchall()
    result = []
    for row in rows:
        result.append(LevelCount(row[0], row[1]))
    return result

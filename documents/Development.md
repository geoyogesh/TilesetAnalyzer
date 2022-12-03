Tools
- conda
- dbeaver 

``` bash
conda create -n tileset_analyzer
conda activate tileset_analyzer
conda config --env --add channels conda-forge
conda config --env --set channel_priority strict
conda install python=3 geopandas pipx
```


MBTiles Schema

![MBTiles Schema](images/mbtiles_schema.png)

execute command local
``` bash
/usr/bin/python3 tileset_analyzer --source data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles


/usr/bin/python3 tileset_analyzer/__main__.py --source data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles
```

debug by running __debug__.py

test install
``` bash
/usr/bin/python3 setup.py develop
tileset_analyzer
```

pipx run tileset_analyzer --source data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles
pipx run tileset_analyzer=0.0.3 --source data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles


pipx install tileset_analyzer
tileset_analyzer --source data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles
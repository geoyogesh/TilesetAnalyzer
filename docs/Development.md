Tools
- conda
- dbeaver 

``` bash
conda create -n tileset_analyzer
conda activate tileset_analyzer
conda config --env --add channels conda-forge
conda config --env --set channel_priority strict
conda install python=3 pipx pandas protobuf

conda env remove -n tileset_analyzer
```


MBTiles Schema

![MBTiles Schema](images/mbtiles_schema.png)

execute command local
``` bash
/usr/bin/python3 tileset_analyzer --source data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles


/usr/bin/python3 tileset_analyzer/main.py --source data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles --temp_folder output/analysis_result.json --actions serve

tileset_analyzer --source /Users/yogeshdhanapal/Desktop/GitHub/tileset_analyzer/data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles --temp_folder /Users/yogeshdhanapal/Desktop/GitHub/tileset_analyzer/output/ --actions serve
```

debug by running __debug__.py

test install
``` bash
/usr/bin/python3 setup.py develop
tileset_analyzer

/usr/bin/python3 setup.py develop --uninstall
```

pipx run tileset_analyzer --source data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles
pipx run tileset_analyzer=0.0.3 --source data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles


pipx install tileset_analyzer
tileset_analyzer --source /Users/yogeshdhanapal/Desktop/GitHub/tileset_analyzer/data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles --temp_folder /Users/yogeshdhanapal/Desktop/GitHub/tileset_analyzer/output/

pipx upgrade tileset_analyzer


pip install -r requirements.txt
pip freeze > requirements.txt


local debugging
python3 -m pip install --upgrade build && python3 -m build

wheel unpack  dist/tileset_analyzer-0.0.19-py2.py3-none-any.whl


```
brew update 
brew install nvm 

mkdir ~/.nvm

export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh
```

cd /webapp/tileset-analyzer-app
npm start

npm run build_local


http://0.0.0.0:8080/api/analysis_result.json
http://0.0.0.0:8080


npm install antd --save


vector tile
Reference:
https://github.com/mapbox/vector-tile-spec
https://github.com/tilezen/mapbox-vector-tile
https://github.com/mapbox/vector-tile-base

polygon should follow right hand rule
https://github.com/chris48s/geojson-rewind


brew install protobuf
protoc -I=. --python_out=./pbf_vt/ ./proto
protoc -I=. --python_out=./pbf_vt/ ./proto/*

https://github.com/mapbox/vector-tile-js
https://github.com/mapbox/point-geometry
https://github.com/mapbox/pbf
https://github.com/feross/ieee754
https://github.com/tmcw/awesome-geojson


Python 
https://github.com/mapbox/vector-tile-base

tms and xyz scheme
https://gist.github.com/tmcw/4954720
https://stackabuse.com/encoding-and-decoding-base64-strings-in-python/


generating exploded dataset (https://github.com/mapbox/mbutil)
conda install easy_install
conda install -c anaconda setuptools
easy_install mbutil
mb-util -h


https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html
conda install -c conda-forge gdal

rm -r ./data/tiles
ogr2ogr -progress -f MVT ./data/tiles ./data/cb_2021_us_all_500k/cb_2021_us_bg_500k/cb_2021_us_bg_500k.shp -dsco MINZOOM=0 -dsco MAXZOOM=5 -dsco COMPRESS=NO


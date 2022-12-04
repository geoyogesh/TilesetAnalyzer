Tools
- conda
- dbeaver 

``` bash
conda create -n tileset_analyzer
conda activate tileset_analyzer
conda config --env --add channels conda-forge
conda config --env --set channel_priority strict
conda install python=3 pipx



conda env remove -n tileset_analyzer
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

/usr/bin/python3 setup.py develop --uninstall
```

pipx run tileset_analyzer --source data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles
pipx run tileset_analyzer=0.0.3 --source data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles


pipx install tileset_analyzer
tileset_analyzer --source data/maptiler-osm-2017-07-03-v3.6.1-us_virginia.mbtiles


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
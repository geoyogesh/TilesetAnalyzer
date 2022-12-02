Tools
- conda
- dbeaver 

``` bash
conda create -n tileset_analyzer
conda activate tileset_analyzer
conda config --env --add channels conda-forge
conda config --env --set channel_priority strict
conda install python=3 geopandas
```


MBTiles Schema

![MBTiles Schema](images/mbtiles_schema.png)
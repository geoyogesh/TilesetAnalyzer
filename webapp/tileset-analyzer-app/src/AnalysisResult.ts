export interface AnalysisResult {
    count_tiles_by_z:        CountTilesByZ[];
    count_tiles_total:       number;
    tiles_size_agg_avg_by_z: TilesSizeAggByZ[];
    tiles_size_agg_max_by_z: TilesSizeAggByZ[];
    tiles_size_agg_min_by_z: TilesSizeAggByZ[];
    tiles_size_agg_sum_by_z: TilesSizeAggByZ[];
    tiles_size_agg_50p_by_z: TilesSizeAggByZ[];
    tiles_size_agg_85p_by_z: TilesSizeAggByZ[];
    tiles_size_agg_90p_by_z: TilesSizeAggByZ[];
    tiles_size_agg_95p_by_z: TilesSizeAggByZ[];
    tiles_size_agg_99p_by_z: TilesSizeAggByZ[];
    tileset_info:            TilesetInfo;
    tiles_size_agg_sum_by_z_layer: TilesSizeAggSumByZLayer[];
}

export interface TilesSizeAggSumByZLayer {
    layers: {[layer_name: string]: number};
    size:   number;
    z:      number;
}

export interface CountTilesByZ {
    count: number;
    z:     number;
}

export interface TilesSizeAggByZ {
    size: number;
    z:    number;
}


export interface TilesetInfo {
    ds_type:          string;
    layer_info_items: LayerInfoItem[];
    location:         string;
    name:             string;
    scheme:           string;
    size:             number;
}

export interface LayerInfoItem {
    attributes:                string[];
    attributes_numeric_domain: { [key: string]: number[] };
    attributes_sample_values:  { [key: string]: any[] };
    attributes_types:          { [key: string]: string[] };
    count:                     number;
    name:                      string;
    zoom_level:                number;
}


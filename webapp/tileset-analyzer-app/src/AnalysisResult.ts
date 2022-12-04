export interface AnalysisResult {
    count_tiles_by_z:        CountTilesByZ[];
    count_tiles_total:       number;
    tiles_size_agg_avg_by_z: TilesSizeAggByZ[];
    tiles_size_agg_max_by_z: TilesSizeAggByZ[];
    tiles_size_agg_min_by_z: TilesSizeAggByZ[];
    tiles_size_agg_sum_by_z: TilesSizeAggByZ[];
}

export interface CountTilesByZ {
    count: number;
    z:     number;
}

export interface TilesSizeAggByZ {
    size: number;
    z:    number;
}

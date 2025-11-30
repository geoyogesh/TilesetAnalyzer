# Tileset Analyzer

A comprehensive tool for analyzing and optimizing vector tilesets to improve map rendering performance. Analyze MBTiles, Folder Tiles, PMTiles, and COMTiles formats with detailed metrics and interactive visualizations.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Development](#development)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

Vector tile size significantly influences map rendering performance. TilesetAnalyzer provides the insights needed to optimize tilesets by:

- **Analyzing** tile metrics per layer and zoom level
- **Visualizing** size distributions with comprehensive statistics
- **Identifying** optimization opportunities to reduce tile size
- **Comparing** tileset versions before releasing major changes
- **Assisting** cartographers in stylesheet design through layer/attribute inspection

### Use Cases

- Optimize specific layers to reduce average and maximum tile sizes
- Compare current tileset with previous versions before production release
- Inspect layers and attributes to assist with stylesheet design
- Identify problematic zoom levels or layers consuming excessive bandwidth
- Understand feature distribution and attribute usage across your tileset

## Key Features

### Tileset Information

- **Layer Exploration**: View all layers across zoom levels
- **Attribute Inspection**: Analyze geometry types, data types, value ranges, and sample values
- **Interactive Map**: Preview tiles with feature property inspection
- **Format Support**: MBTiles, Folder Tiles, PMTiles, COMTiles
- **Compression Detection**: Automatically identifies gzip or uncompressed tiles

![General Information](./docs/images/general_info.png)

### Metrics & Analytics

- **Tile Count Analysis**: Distribution across zoom levels
- **Size Aggregations**: Min, max, average, sum, and percentiles (50th, 85th, 90th, 95th, 99th)
- **Layer Contributions**: Size breakdown by layer with percentage calculations
- **Treemap Visualization**: Hierarchical view of layer size contributions

![Tile Size Metrics](./docs/images/zoom_level_tilesize_avg.png)

### Layer & Attribute Analysis

- Geometry type detection (Point, LineString, Polygon)
- Data type classification (string, numeric)
- Domain analysis (min/max for numeric attributes)
- Sample value collection (up to 100 distinct values per attribute)

![Layer Attributes](./docs/images/explore_lar_attr.png)

## Installation

### Requirements

- **Python**: 3.9 or higher
- **pip**: Latest version recommended

### Install from PyPI

```bash
pip install tileset-analyzer
```

### Install from Source

```bash
git clone https://github.com/geoyogesh/tileset_analyzer.git
cd tileset_analyzer
pip install -e .
```

### Verify Installation

```bash
tileset_analyzer --help
```

## Quick Start

Analyze an MBTiles file and view results in the web UI:

```bash
tileset_analyzer \
  --source ./your-tileset.mbtiles \
  --temp_folder ./output \
  --actions process,serve \
  --scheme XYZ
```

Then open your browser to `http://localhost:8080` to explore the results.

## Usage

### Basic Analysis

Analyze a tileset and save results to JSON:

```bash
tileset_analyzer \
  --source /path/to/tileset.mbtiles \
  --temp_folder ./results \
  --actions process
```

### Analyze and Serve Web UI

Process the tileset and launch the interactive web interface:

```bash
tileset_analyzer \
  --source /path/to/tileset.mbtiles \
  --temp_folder ./results \
  --actions process,serve \
  --scheme XYZ
```

### Folder Tiles

For folder-based tile structures:

```bash
tileset_analyzer \
  --source /path/to/tiles/{z}/{x}/{y}.pbf \
  --temp_folder ./results \
  --actions process,serve \
  --scheme TMS
```

### MBTiles with Custom Table Schema

For MBTiles with non-standard table structure:

```bash
tileset_analyzer \
  --source ./custom.mbtiles \
  --temp_folder ./output \
  --actions process,serve \
  --scheme XYZ \
  --compressed False \
  --mbtiles_tbl tiles,x,y,z,data
```

### Command-Line Options

| Option          | Description                                 | Default                                           | Required |
| --------------- | ------------------------------------------- | ------------------------------------------------- | -------- |
| `--source`      | Path to tileset file or folder pattern      | -                                                 | Yes      |
| `--temp_folder` | Output directory for results                | -                                                 | Yes      |
| `--actions`     | Comma-separated actions: `process`, `serve` | `process`                                         | No       |
| `--scheme`      | Coordinate scheme: `TMS` or `XYZ`           | `TMS`                                             | No       |
| `--compressed`  | Whether tiles are gzip compressed           | `True`                                            | No       |
| `--mbtiles_tbl` | MBTiles table schema: `table,x,y,z,data`    | `tiles,tile_column,tile_row,zoom_level,tile_data` | No       |

## Architecture

TilesetAnalyzer consists of two main components:

![Architecture](./docs/images/hld.png)

### 1. Python CLI Tool (Backend)

- Reads and parses vector tiles (Mapbox Vector Tile format)
- Performs comprehensive analysis using pandas and numpy
- Generates JSON output with metrics and metadata
- Serves results via FastAPI web server
- **Pluggable architecture** supports multiple tileset formats:
  - ✅ MBTiles (SQLite-based)
  - ✅ Folder Tiles (file system-based)
  - 🚧 PMTiles (coming soon)
  - 🚧 COMTiles (coming soon)

### 2. React Web UI (Frontend)

- Single-page application for interactive data exploration
- Real-time chart rendering with ECharts
- Interactive map preview with MapLibre GL JS
- Persistent settings with LocalForage
- Responsive design with AWS Cloudscape Design System

## Technology Stack

### Backend (Python)

- **FastAPI** `~0.88.0` - Modern web framework for API
- **uvicorn** `~0.20.0` - ASGI server
- **pandas** `~1.5.2` - Data analysis and aggregations
- **numpy** `~1.23.5` - Numerical computations and percentiles
- **protobuf** `<=3.20.3` - Mapbox Vector Tile parsing
- **parse** `~1.19.0` - Pattern parsing for folder tiles

### Frontend (React/TypeScript)

- **React** `18.2.0` - UI framework
- **TypeScript** `4.9.3` - Type-safe JavaScript
- **AWS Cloudscape Components** - Professional UI component library
- **MapLibre GL** `~2.4.0` - Interactive map rendering
- **ECharts** `~3.0.2` - Data visualization and charts
- **Zustand** `~4.3.3` - Lightweight state management
- **React Router** `~6.4.4` - SPA routing
- **LocalForage** `~1.10.0` - Persistent browser storage
- **SCSS** - Styling

## Development

### Setting Up Development Environment

1. **Clone the repository**:

   ```bash
   git clone https://github.com/geoyogesh/tileset_analyzer.git
   cd tileset_analyzer
   ```

2. **Create virtual environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -e ".[dev]"
   ```

4. **Frontend development** (optional):
   ```bash
   cd webapp/tileset-analyzer-app
   npm install
   npm start  # Runs dev server on http://localhost:3000
   ```

### Building the Frontend

To rebuild the React UI and package it with the Python tool:

```bash
cd webapp/tileset-analyzer-app
npm run build
# Built files are automatically copied to tileset_analyzer/static/ui/
```

### Project Structure

```
TilesetAnalyzer/
├── tileset_analyzer/          # Python package
│   ├── api/                   # FastAPI server
│   ├── data_source/           # Tileset format implementations
│   ├── entities/              # Data models
│   ├── readers/               # Vector tile parsers
│   ├── static/                # Built UI and results
│   └── main.py                # CLI entry point
├── webapp/                    # React frontend source
│   └── tileset-analyzer-app/
└── docs/                      # Documentation and images
```

## API Reference

### CLI Commands

**Main command**:

```bash
tileset_analyzer --source <path> --temp_folder <output> [OPTIONS]
```

**Options**:

- `--source` (required): Path to tileset or folder pattern
- `--temp_folder` (required): Output directory for analysis results
- `--actions`: `process` (analyze), `serve` (web UI), or both (comma-separated)
- `--scheme`: `TMS` (default) or `XYZ` coordinate scheme
- `--compressed`: `True` (default) or `False` for tile compression
- `--mbtiles_tbl`: Custom MBTiles table schema (format: `table,x_col,y_col,z_col,data_col`)

### Web API Endpoints

When running with `--actions serve`:

- `GET /` - Serves the web UI
- `GET /tileset/{z}/{x}/{y}.mvt` - Serves individual tiles for map preview
- Static files served from `/tileset_analyzer/static/ui/`

### Output Format

Analysis results are saved as JSON in `<temp_folder>/analysis_result.json`:

```json
{
  "tileset_info": {
    "name": "example",
    "type": "MBTiles",
    "scheme": "XYZ",
    "compressed": true,
    "total_size": 12345678
  },
  "layers": [...],
  "level_counts": [...],
  "level_sizes": [...],
  "layer_level_sizes": [...]
}
```

## Screenshots

### Layer Exploration

View all layers and their attributes across zoom levels:

![Explore Layers](./docs/images/explore_layers.png)

### Interactive Map View

Preview tiles on a map and inspect feature properties:

![Map View](./docs/images/mapview.png)

### Tile Count Metrics

Analyze tile distribution across zoom levels:

![Tile Count](./docs/images/zoom_tile_count.png)

### Layer Size Analysis

Understand which layers contribute most to tileset size:

![Tile Set Size](./docs/images/tile_set_size.png)

### Treemap Visualization

Hierarchical view of layer size contributions:

![Treemap](./docs/images/treemap.png)

## Troubleshooting

### Common Issues

**Issue**: `ModuleNotFoundError: No module named 'tileset_analyzer'`

- **Solution**: Ensure you've installed the package: `pip install tileset-analyzer`

**Issue**: Web UI doesn't load or shows blank page

- **Solution**: Check that `--actions` includes `serve` and browser is pointing to `http://localhost:8080`

**Issue**: "Permission denied" when reading tileset

- **Solution**: Verify file permissions and that the path is correct

**Issue**: Analysis fails with memory error on large tilesets

- **Solution**: TilesetAnalyzer loads the entire tileset into memory. For very large tilesets, ensure sufficient RAM or process subsets

**Issue**: Wrong tiles displayed on map

- **Solution**: Verify the `--scheme` parameter matches your tileset (TMS vs XYZ)

### Getting Help

- **Issues**: Report bugs at [GitHub Issues](https://github.com/geoyogesh/tileset_analyzer/issues)
- **Documentation**: Check the [docs](./docs/) directory for additional resources

## Roadmap

Future enhancements planned:

- [ ] Tileset comparison mode (compare two or more tilesets)
- [ ] Streaming analysis for large tilesets
- [ ] PMTiles format support
- [ ] COMTiles format support
- [ ] Export metrics to CSV/Parquet
- [ ] Historical analysis tracking
- [ ] Performance optimizations for memory usage
- [ ] API authentication options

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:

- Code follows existing style conventions
- New features include appropriate documentation
- Bug fixes include test cases when possible

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/), [React](https://react.dev/), and [MapLibre GL JS](https://maplibre.org/)
- Uses [AWS Cloudscape Design System](https://cloudscape.design/) for UI components
- Mapbox Vector Tile specification support via [protobuf](https://developers.google.com/protocol-buffers)

## References

- Original repository: https://github.com/geoyogesh/tileset_analyzer
- Mapbox Vector Tile Specification: https://github.com/mapbox/vector-tile-spec

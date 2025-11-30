# Quick Start Guide

Follow these steps to run TilesetAnalyzer locally for the first time.

## Step 1: Build the Frontend

```bash
cd webapp/tileset-analyzer-app
npm install
npm run build_local
cd ../..
```

## Step 2: Set Up Python Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Step 3: Run the Application

### Option A: Process and Serve (Full Application)

```bash
python -m tileset_analyzer \
  --source ./data/osm-2020-02-10-v3.11_virginia_richmond.mbtiles \
  --temp_folder ./data/temp \
  --actions process,serve \
  --compressed \
  --scheme TMS
```

### Option B: Process Only

```bash
python -m tileset_analyzer \
  --source ./data/osm-2020-02-10-v3.11_virginia_richmond.mbtiles \
  --temp_folder ./data/temp \
  --actions process \
  --compressed \
  --scheme TMS
```

### Option C: Serve Only (After Processing)

```bash
python -m tileset_analyzer \
  --source ./data/osm-2020-02-10-v3.11_virginia_richmond.mbtiles \
  --temp_folder ./data/temp \
  --actions serve \
  --compressed \
  --scheme TMS
```

## Step 4: Access the Web UI

Open your browser to: `http://localhost:8080`

---

For detailed development instructions, see [docs/Development.md](docs/Development.md)

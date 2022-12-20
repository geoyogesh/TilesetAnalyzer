from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from pathlib import Path
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import RedirectResponse, FileResponse

UI_PATH = f'{Path(os.path.dirname(__file__)).parent}/static/ui'


def start_api(temp_folder):
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.mount("/api", StaticFiles(directory=temp_folder), name="api")

    @app.get("/")
    async def index():
        return FileResponse(f'{UI_PATH}/index.html')

    app.mount("/static", StaticFiles(directory=f'{UI_PATH}/static'), name="ui")

    @app.get("/{file_name}.{file_path}")
    async def root_files(file_name: str, file_path: str):
        return FileResponse(f'{UI_PATH}/{file_name}.{file_path}')

    @app.get("/{path_name:path}")
    async def index_react_path(request: Request, path_name: str):
        return FileResponse(f'{UI_PATH}/index.html')
    
    uvicorn.run(app, host="0.0.0.0", port=8080)
    

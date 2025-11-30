from setuptools import setup, find_packages
import re
from pathlib import Path

# Read version from __init__.py
def get_version():
    init_file = Path(__file__).parent / "tileset_analyzer" / "__init__.py"
    content = init_file.read_text()
    match = re.search(r'__version__\s*=\s*["\']([^"\']+)["\']', content)
    if match:
        return match.group(1)
    raise RuntimeError("Unable to find version string.")

CLASSIFIERS = [
    "Operating System :: OS Independent",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
]

setup(
    name='tileset_analyzer',
    version=get_version(),
    url='https://github.com/geoyogesh/tileset_analyzer',
    license='MIT',
    author='Yogesh Dhanapal',
    author_email='geoyogesh@gmail.com',
    entry_points={"console_scripts": ["tileset_analyzer = tileset_analyzer.main:cli"]},
    description='Analyze vector Tileset',
    python_requires=">=3.10, <4",
    packages=find_packages(),
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    zip_safe=False,
    classifiers=CLASSIFIERS,
    include_package_data=True,
    install_requires=["fastapi", "uvicorn[standard]", "pandas", "protobuf<=3.20.3", "parse"]
)

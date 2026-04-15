#!/bin/bash
cd "$(dirname "$0")/site"
echo "Starting ANCFC preview server at http://localhost:8888"
echo "Press Ctrl+C to stop"
open "http://localhost:8888"
python3 -m http.server 8888

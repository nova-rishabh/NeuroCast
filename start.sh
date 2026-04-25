#!/bin/bash
cd "$(dirname "$0")"
cd backend && pip install -r requirements.txt -q && python train_models.py && python app.py &
cd frontend && npm install && npm run dev &
wait

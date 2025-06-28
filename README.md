# OCR Assignment Manager

This project extracts assignment names and due dates from educational screenshots using:

- OCR (via OCR.space)
- Line classification (using a local DistilBERT model)
- FastAPI backend
- Next.js frontend

## Features

- Upload a screenshot
- Extract text using OCR.space
- Classify lines as: title, due, or noise
- View structured results in the frontend

## Setup Instructions

### Clone the Repository

git clone https://github.com/your-username/ocr-assignment-manager.git
cd ocr-assignment-manager

### Backend Setup (FastAPI)

cd backend
python -m venv .venv
source .venv/bin/activate or .venv\Scripts\activate

pip install -r requirements.txt

Start the Server:
uvicorn main:app --reload

### Frontend Setup (Next.js)

cd ../frontend
npm install
npm run dev

## Notes

- The classifier model uses only 3 labels: title, due, and noise
- OCR is powered by OCR.space
- Classification is powered by a locally fine-tuned DistilBERT

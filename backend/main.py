from fastapi import FastAPI, UploadFile, File
from services.ocr_space import extract_text_via_ocr_space
from services.classifier_hf import classify_line
from services.group_assignments import group_assignments
from services.downscale_image import downscale_image
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/process/")
async def process_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    downscaled_bytes = downscale_image(image_bytes)

    # Step 1: OCR
    lines = extract_text_via_ocr_space(downscaled_bytes)
    
    # Step 2: Classify each line
    labeled = [{"text": line, "label": classify_line(line)} for line in lines]

    # Step 3: Group assignments
    grouped_assignments = group_assignments(labeled)

    return {"assignments": grouped_assignments}

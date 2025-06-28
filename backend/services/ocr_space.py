import requests
import os
from dotenv import load_dotenv

load_dotenv()

OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY")

def extract_text_via_ocr_space(image_bytes):
    response = requests.post(
        "https://api.ocr.space/parse/image",
        files={"file": ("image.png", image_bytes)},
        data={"language": "eng"},
        headers={"apikey": OCR_SPACE_API_KEY}
    )
    result = response.json()
    if not result.get("IsErroredOnProcessing"):
        lines = result["ParsedResults"][0]["ParsedText"].splitlines()
        return [line.strip() for line in lines if line.strip()]
    return []

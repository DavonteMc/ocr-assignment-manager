from services.ocr_space import extract_text_via_ocr_space

image_path = "output-onlinepngtools (2).png"

with open(image_path, "rb") as image_file:
    image_bytes = image_file.read()

print(image_bytes[:10])
result = extract_text_via_ocr_space(image_bytes)


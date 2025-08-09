from io import BytesIO 
from PIL import Image
import os

def downscale_image(image_bytes, max_size_kb=1000, quality=85, max_width=1600):
    """
    Takes in image bytes, resizes/compresses, returns new image bytes under max_size_kb.
    Maintains aspect ratio and converts to JPEG.
    """
    img = Image.open(BytesIO(image_bytes))

    # Convert from RBGA to RGB
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    
    # Save to Bytes with compression
    output_buffer = BytesIO()
    img.save(output_buffer, format="JPEG", quality=quality)

    # Check size and resize if necessary
    while output_buffer.tell() > max_size_kb * 1024 and quality > 10:
        quality -= 5
        output_buffer = BytesIO()
        img.save(output_buffer, format="JPEG", optimize=True, quality=quality)
    
    return output_buffer.getvalue()
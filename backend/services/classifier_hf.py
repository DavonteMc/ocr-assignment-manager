from transformers import pipeline
from functools import lru_cache

label_map = {
    "0": "due",
    "1": "noise",
    "2": "title"
  }

@lru_cache(maxsize=1)
def get_pipeline():
    return pipeline("text-classification", model="davontemc/ocr-assignment-classifier")

def classify_line(text):
    clf = get_pipeline()
    result = clf(text)
    return result[0]["label"] if result else "error"
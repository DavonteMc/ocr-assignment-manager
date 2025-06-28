import torch
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification
import json

# Load model and tokenizer from local directory
model_path = "ocr_line_model"
tokenizer = DistilBertTokenizerFast.from_pretrained(model_path)
model = DistilBertForSequenceClassification.from_pretrained(model_path)

# Load label map 
with open(f"{model_path}/label_map.json") as f:
    label_map = json.load(f)

# Reverse the label map for decoding
inv_label_map = {v: k for k, v in label_map.items()}

# Predict function
def predict(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    predicted_class_id = torch.argmax(logits, dim=1).item()
    return inv_label_map[predicted_class_id]

# Test example
if __name__ == "__main__":
    test_lines = [
        "Assignment 2: Final Essay",
        "Due: July 12",
        "Ends: July 14",
        "submission.docx",
        "Click here to view rubric"
    ]

    for line in test_lines:
        label = predict(line)
        print(f"[{label}] {line}")

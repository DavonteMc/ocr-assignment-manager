from transformers import pipeline
clf = pipeline("text-classification", model="davontemc/ocr-assignment-classifier")
print(clf("Due: July 1"))
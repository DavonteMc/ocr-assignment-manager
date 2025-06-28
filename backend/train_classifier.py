import pandas as pd
import numpy as np
import json
import evaluate
from datasets import Dataset
from sklearn.preprocessing import LabelEncoder
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification, Trainer, TrainingArguments

# Load and preprocess data
df = pd.read_csv("labeled_data.csv").dropna(subset=["text", "label"])

# Encode labels
label_encoder = LabelEncoder()
df["label_id"] = label_encoder.fit_transform(df["label"])
label_map = dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))
id2label = {v: k for k, v in label_map.items()}
label2id = label_map

# Convert to Hugging Face dataset
dataset = Dataset.from_pandas(df[["text", "label_id"]])
dataset = dataset.train_test_split(test_size=0.2)

# Tokenize
tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")

def tokenize(example):
    tokenized = tokenizer(example["text"], truncation=True, padding="max_length")
    tokenized["labels"] = example["label_id"]
    return tokenized

encoded = dataset.map(tokenize, batched=True)

# Load accuracy metric
accuracy = evaluate.load("accuracy")
def compute_metrics(p):
    preds = np.argmax(p.predictions, axis=1)
    return accuracy.compute(predictions=preds, references=p.label_ids)

# Load model with correct label mappings
model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=len(label_encoder.classes_),
    id2label=id2label,
    label2id=label2id
)

# Training setup
args = TrainingArguments(
    output_dir="./ocr_line_model",
    eval_strategy="epoch",
    save_strategy="epoch",
    logging_dir='./logs',
    num_train_epochs=4,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    learning_rate=2e-5,
    weight_decay=0.01,
    save_total_limit=1,
    logging_steps=10,
    load_best_model_at_end=True,
)

# Trainer
trainer = Trainer(
    model=model,
    args=args,
    train_dataset=encoded["train"],
    eval_dataset=encoded["test"],
    tokenizer=tokenizer,
    compute_metrics=compute_metrics
)

# Train
trainer.train()

# Save model and tokenizer
model.save_pretrained("ocr_line_model")
tokenizer.save_pretrained("ocr_line_model")

# Save label map
with open("ocr_line_model/label_map.json", "w") as f:
    json.dump(label2id, f)

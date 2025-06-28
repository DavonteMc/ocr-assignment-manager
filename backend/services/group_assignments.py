def group_assignments(labeled_lines: list[dict]) -> list[dict]:
    assignments = []
    current = None

    for item in labeled_lines:
        label = item["label"]
        text = item["text"]

        if label == "title":
            if current:
                assignments.append(current)
            current = {"title": text, "due": None}
        elif label == "due" and current:
            current["due"] = text

    if current:
        assignments.append(current)

    return assignments 
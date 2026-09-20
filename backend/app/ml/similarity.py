import re
import math
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return ' '.join(text.split())

def levenshtein_distance(s1: str, s2: str) -> int:
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]

def string_similarity(s1: str, s2: str) -> float:
    norm1, norm2 = normalize_text(s1), normalize_text(s2)
    if not norm1 or not norm2:
        return 0.0
    if norm1 == norm2:
        return 1.0
    max_len = max(len(norm1), len(norm2))
    dist = levenshtein_distance(norm1, norm2)
    return max(0.0, 1.0 - (dist / max_len))

def username_similarity(u1: str, u2: str) -> float:
    norm1, norm2 = normalize_text(u1), normalize_text(u2)
    if not norm1 or not norm2:
        return 0.0
    if norm1 == norm2:
        return 1.0
    if norm1 in norm2 or norm2 in norm1:
        return 0.85
    return string_similarity(norm1, norm2)

def text_cosine_similarity(text1: str, text2: str) -> float:
    n1, n2 = normalize_text(text1), normalize_text(text2)
    if not n1 or not n2:
        return 0.0
    if n1 == n2:
        return 1.0
    try:
        vectorizer = TfidfVectorizer().fit([n1, n2])
        tfidf = vectorizer.transform([n1, n2])
        sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return float(sim)
    except Exception:
        return string_similarity(n1, n2)

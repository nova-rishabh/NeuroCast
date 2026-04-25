import os 
import io 
import json 
import zipfile 
import joblib 
import numpy as np 
import pandas as pd 
from flask import Flask, request, jsonify, send_file 
from flask_cors import CORS 
 
app = Flask(__name__) 
CORS(app) 
 
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models') 
DATA_DIR  = os.path.join(os.path.dirname(__file__), 'data') 
 
# ── helpers ────────────────────────────────────────────────────────── 
def load_model(name): 
    vec_path   = os.path.join(MODEL_DIR, f'{name}_vectorizer.pkl') 
    model_path = os.path.join(MODEL_DIR, f'{name}_model.pkl') 
    if os.path.exists(vec_path) and os.path.exists(model_path): 
        return joblib.load(vec_path), joblib.load(model_path) 
    return None, None 
 
def load_metrics(name): 
    path = os.path.join(MODEL_DIR, f'{name}_metrics.json') 
    if os.path.exists(path): 
        with open(path) as f: 
            return json.load(f) 
    return {} 
 
def get_word_weights(text, vectorizer, model, top_n=10): 
    """Return top contributing words with normalized weights.""" 
    try: 
        words = text.lower().split() 
        feature_names = vectorizer.get_feature_names_out() 
        coefs = model.coef_[0] if hasattr(model, 'coef_') else None 
        if coefs is None: 
            return [] 
        results = [] 
        vocab = vectorizer.vocabulary_ 
        for word in words: 
            if word in vocab: 
                idx = vocab[word] 
                results.append({"word": word, "weight": float(coefs[idx])}) 
        results.sort(key=lambda x: abs(x['weight']), reverse=True) 
        if results: 
            max_w = max(abs(r['weight']) for r in results) or 1 
            for r in results: 
                r['weight'] = round(r['weight'] / max_w, 4) 
        return results[:top_n] 
    except Exception: 
        return [] 
 
def detect_language(text): 
    try: 
        from langdetect import detect 
        lang = detect(text) 
        return lang[:2].upper() 
    except Exception: 
        return "EN" 
 
# ── Challenge 1 ─────────────────────────────────────────────────────── 
@app.route('/api/challenge1/predict', methods=['POST']) 
def c1_predict(): 
    data = request.get_json(force=True) 
    text = data.get('text', '').strip() 
    if not text: 
        return jsonify({"error": "No text provided"}), 400 
    vec, model = load_model('disaster') 
    if vec is None: 
        return jsonify({"error": "Model not trained yet"}), 503 
    X = vec.transform([text]) 
    label = int(model.predict(X)[0]) 
    proba = model.predict_proba(X)[0] 
    confidence = round(float(max(proba)), 4) 
    label_text = "Informative" if label == 1 else "Not Informative" 
    word_weights = get_word_weights(text, vec, model) 
    return jsonify({"label": label, "label_text": label_text, 
                    "confidence": confidence, "word_weights": word_weights}) 
 
@app.route('/api/challenge1/batch', methods=['POST']) 
def c1_batch(): 
    if 'csv_file' not in request.files: 
        return jsonify({"error": "No file uploaded"}), 400 
    f = request.files['csv_file'] 
    df = pd.read_csv(f) 
    if 'text' not in df.columns: 
        return jsonify({"error": "CSV must have a 'text' column"}), 400 
    vec, model = load_model('disaster') 
    if vec is None: 
        return jsonify({"error": "Model not trained"}), 503 
    df['text'] = df['text'].fillna('').astype(str) 
    X = vec.transform(df['text'].values) 
    df['label'] = model.predict(X).astype(int) 
    out = io.StringIO() 
    df.to_csv(out, index=False) 
    out.seek(0) 
    return send_file(io.BytesIO(out.getvalue().encode()), 
                     mimetype='text/csv', 
                     as_attachment=True, 
                     download_name='disaster_predictions.csv') 
 
@app.route('/api/challenge1/metrics', methods=['GET']) 
def c1_metrics(): 
    return jsonify(load_metrics('disaster')) 
 
# ── Challenge 2 ─────────────────────────────────────────────────────── 
@app.route('/api/challenge2/predict', methods=['POST']) 
def c2_predict(): 
    data = request.get_json(force=True) 
    title = data.get('title', '') 
    text  = data.get('text', '') 
    combined = f"{title} {text}".strip() 
    if not combined: 
        return jsonify({"error": "No content provided"}), 400 
    vec, model = load_model('fakenews') 
    if vec is None: 
        return jsonify({"error": "Model not trained yet"}), 503 
    X = vec.transform([combined]) 
    label_num = int(model.predict(X)[0]) 
    proba = model.predict_proba(X)[0] 
    confidence = round(float(max(proba)), 4) 
    label = "TRUE" if label_num == 1 else "FALSE" 
    label_display = "Real News" if label_num == 1 else "Fake News" 
    word_weights = get_word_weights(combined, vec, model) 
    return jsonify({"label": label, "label_display": label_display, 
                    "confidence": confidence, "word_weights": word_weights}) 
 
@app.route('/api/challenge2/batch', methods=['POST']) 
def c2_batch(): 
    if 'csv_file' not in request.files: 
        return jsonify({"error": "No file uploaded"}), 400 
    f = request.files['csv_file'] 
    df = pd.read_csv(f) 
    for col in ['title', 'text']: 
        if col not in df.columns: 
            df[col] = '' 
    df['title'] = df['title'].fillna('').astype(str) 
    df['text']  = df['text'].fillna('').astype(str) 
    df['combined'] = df['title'] + ' ' + df['text'] 
    vec, model = load_model('fakenews') 
    if vec is None: 
        return jsonify({"error": "Model not trained"}), 503 
    X = vec.transform(df['combined'].values) 
    preds = model.predict(X).astype(int) 
    df['label'] = ['TRUE' if p == 1 else 'FALSE' for p in preds] 
    df = df.drop(columns=['combined'], errors='ignore') 
    out = io.StringIO() 
    df.to_csv(out, index=False) 
    out.seek(0) 
    return send_file(io.BytesIO(out.getvalue().encode()), 
                     mimetype='text/csv', 
                     as_attachment=True, 
                     download_name='fakenews_predictions.csv') 
 
@app.route('/api/challenge2/metrics', methods=['GET']) 
def c2_metrics(): 
    return jsonify(load_metrics('fakenews')) 
 
# ── Challenge 3 ─────────────────────────────────────────────────────── 
@app.route('/api/challenge3/predict', methods=['POST']) 
def c3_predict(): 
    data = request.get_json(force=True) 
    text = data.get('text', '').strip() 
    if not text: 
        return jsonify({"error": "No text provided"}), 400 
    vec, model = load_model('toxic') 
    if vec is None: 
        return jsonify({"error": "Model not trained yet"}), 503 
    X = vec.transform([text]) 
    label = int(model.predict(X)[0]) 
    proba = model.predict_proba(X)[0] 
    confidence = round(float(max(proba)), 4) 
    label_text = "Toxic" if label == 1 else "Non-toxic" 
    detected_lang = detect_language(text) 
    word_weights = get_word_weights(text, vec, model) 
    return jsonify({"label": label, "label_text": label_text, 
                    "confidence": confidence, 
                    "detected_language": detected_lang, 
                    "word_weights": word_weights}) 
 
@app.route('/api/challenge3/batch', methods=['POST']) 
def c3_batch(): 
    if 'file' not in request.files: 
        return jsonify({"error": "No file uploaded"}), 400 
    f = request.files['file'] 
    fname = f.filename.lower() 
    if fname.endswith('.xlsx'): 
        df = pd.read_excel(f) 
    else: 
        df = pd.read_csv(f) 
    df.columns = [c.strip().lower() for c in df.columns] 
    text_col = next((c for c in df.columns if 'text' in c or 'comment' in c), None) 
    if text_col is None: 
        return jsonify({"error": "File must have a 'text' column"}), 400 
    df[text_col] = df[text_col].fillna('').astype(str) 
    vec, model = load_model('toxic') 
    if vec is None: 
        return jsonify({"error": "Model not trained"}), 503 
    X = vec.transform(df[text_col].values) 
    df['label'] = model.predict(X).astype(int) 
    out = io.StringIO() 
    df.to_csv(out, index=False) 
    out.seek(0) 
    return send_file(io.BytesIO(out.getvalue().encode()), 
                     mimetype='text/csv', 
                     as_attachment=True, 
                     download_name='toxic_predictions.csv') 
 
@app.route('/api/challenge3/metrics', methods=['GET']) 
def c3_metrics(): 
    return jsonify(load_metrics('toxic')) 
 
# ── Dashboard ───────────────────────────────────────────────────────── 
@app.route('/api/dashboard/metrics', methods=['GET']) 
def dashboard(): 
    return jsonify({ 
        "challenge1": load_metrics('disaster'), 
        "challenge2": load_metrics('fakenews'), 
        "challenge3": load_metrics('toxic') 
    }) 
 
# ── Download All ────────────────────────────────────────────────────── 
@app.route('/api/download/all', methods=['GET']) 
def download_all(): 
    zip_buffer = io.BytesIO() 
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zf: 
        # Challenge 1 
        try: 
            df1 = pd.read_csv(os.path.join(DATA_DIR, 'Disaster_no_label.csv')) 
            df1['text'] = df1['text'].fillna('').astype(str) 
            vec1, m1 = load_model('disaster') 
            if vec1: 
                X1 = vec1.transform(df1['text'].values) 
                df1['label'] = m1.predict(X1).astype(int) 
            out1 = df1.to_csv(index=False) 
            zf.writestr('disaster_predictions.csv', out1) 
        except Exception as e: 
            zf.writestr('disaster_predictions_error.txt', str(e)) 
 
        # Challenge 2 
        try: 
            df2 = pd.read_csv(os.path.join(DATA_DIR, 'FakeNews_no_labels.csv')) 
            df2['title'] = df2.get('title', pd.Series([''] * len(df2))).fillna('').astype(str) 
            df2['text']  = df2.get('text', pd.Series([''] * len(df2))).fillna('').astype(str) 
            df2['combined'] = df2['title'] + ' ' + df2['text'] 
            vec2, m2 = load_model('fakenews') 
            if vec2: 
                X2 = vec2.transform(df2['combined'].values) 
                preds2 = m2.predict(X2).astype(int) 
                df2['label'] = ['TRUE' if p == 1 else 'FALSE' for p in preds2] 
                df2 = df2.drop(columns=['combined'], errors='ignore') 
            out2 = df2.to_csv(index=False) 
            zf.writestr('fakenews_predictions.csv', out2) 
        except Exception as e: 
            zf.writestr('fakenews_predictions_error.txt', str(e)) 
 
        # Challenge 3 
        try: 
            df3 = pd.read_excel(os.path.join(DATA_DIR, 'toxic_no_label_evaluation.xlsx')) 
            df3.columns = [c.strip().lower() for c in df3.columns] 
            text_col = next((c for c in df3.columns if 'text' in c or 'comment' in c), df3.columns[0]) 
            df3[text_col] = df3[text_col].fillna('').astype(str) 
            vec3, m3 = load_model('toxic') 
            if vec3: 
                X3 = vec3.transform(df3[text_col].values) 
                df3['label'] = m3.predict(X3).astype(int) 
            out3 = df3.to_csv(index=False) 
            zf.writestr('toxic_predictions.csv', out3) 
        except Exception as e: 
            zf.writestr('toxic_predictions_error.txt', str(e)) 
 
    zip_buffer.seek(0) 
    return send_file(zip_buffer, mimetype='application/zip', 
                     as_attachment=True, 
                     download_name='neuroCast_all_predictions.zip') 
 
# ── Health check ────────────────────────────────────────────────────── 
@app.route('/api/health', methods=['GET']) 
def health(): 
    return jsonify({"status": "ok", "models": { 
        "disaster": os.path.exists(os.path.join(MODEL_DIR, 'disaster_model.pkl')), 
        "fakenews": os.path.exists(os.path.join(MODEL_DIR, 'fakenews_model.pkl')), 
        "toxic":    os.path.exists(os.path.join(MODEL_DIR, 'toxic_model.pkl')) 
    }}) 
 
if __name__ == '__main__': 
    app.run(host='0.0.0.0', port=5000, debug=False) 
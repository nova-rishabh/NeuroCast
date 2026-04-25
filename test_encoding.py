import pandas as pd
import os

DATA_DIR = 'backend/data'
files = ['Disaster_no_label.csv', 'FakeNews_no_labels.csv']
for fname in files:
    path = os.path.join(DATA_DIR, fname)
    try:
        pd.read_csv(path, encoding='utf-8')
        print(f"{fname}: utf-8 OK")
    except Exception as e:
        print(f"{fname}: utf-8 FAIL - {e}")
        try:
            pd.read_csv(path, encoding='latin1')
            print(f"{fname}: latin1 OK")
        except Exception as e2:
            print(f"{fname}: latin1 FAIL - {e2}")

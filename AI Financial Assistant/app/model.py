import pandas as pd  
from sklearn.ensemble import RandomForestRegressor 
import joblib   
import os       

MODEL_PATH = 'models/budget_model.pkl'  

def train_and_save_model(csv_path):
    data = pd.read_csv(csv_path)
    X = data[['income', 'fixed_expenses', 'savings_goal', 'months_to_goal']]
    Y = data[['food_pct', 'entertainment_pct', 'shopping_pct']]

    model = RandomForestRegressor()
    model.fit(X, Y)
    joblib.dump(model, MODEL_PATH)
    print("✅ Model Trained and Saved")

def load_model():
    if not os.path.exists(MODEL_PATH):
        print("⚠️ Model not found — training a new one.")
        train_and_save_model("data/sample_data.csv")  
    return joblib.load(MODEL_PATH)
import pandas as pd
import os
import yaml
import joblib
import argparse
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

def load_params(config_path):
    with open(config_path) as yaml_file:
        config = yaml.safe_load(yaml_file)
    return config

def train_model(config_path):
    config = load_params(config_path)
    
    try:
        # Load Train Data
        processed_dir = config["processed_data_config"]["dir"]
        train_data = pd.read_csv(os.path.join(processed_dir, "train.csv"))
        
        target_col = config["processed_data_config"]["target_col"]
        X_train = train_data.drop(columns=[target_col])
        y_train = train_data[target_col]
        
        # Build Pipeline
        n_estimators = config["model_config"]["n_estimators"]
        random_state = config["model_config"]["random_state"]
        
        pipeline = Pipeline([
            ('scaler', StandardScaler()),
            ('classifier', RandomForestClassifier(n_estimators=n_estimators, random_state=random_state))
        ])
        
        print("🤖 Training Model...")
        pipeline.fit(X_train, y_train)
        
        # Save Model
        model_dir = config["model_config"]["dir"]
        model_name = config["model_config"]["model_name"]
        joblib.dump(pipeline, os.path.join(model_dir, model_name))
        
        print(f"✅ Model saved to {os.path.join(model_dir, model_name)}")

    except Exception as e:
        print(f"❌ Error in Training: {e}")
        raise

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="params.yaml")
    args = parser.parse_args()
    train_model(config_path=args.config)
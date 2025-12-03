import pandas as pd
import os
import yaml
import joblib
import json
import argparse
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def load_params(config_path):
    with open(config_path) as yaml_file:
        config = yaml.safe_load(yaml_file)
    return config

def evaluate_model(config_path):
    config = load_params(config_path)
    
    try:
        # Load Data and Model
        processed_dir = config["processed_data_config"]["dir"]
        test_data = pd.read_csv(os.path.join(processed_dir, "test.csv"))
        
        model_dir = config["model_config"]["dir"]
        model_name = config["model_config"]["model_name"]
        model = joblib.load(os.path.join(model_dir, model_name))
        
        target_col = config["processed_data_config"]["target_col"]
        X_test = test_data.drop(columns=[target_col])
        y_test = test_data[target_col]
        
        # Predict
        y_pred = model.predict(X_test)
        
        # Metrics
        metrics = {
            "accuracy": accuracy_score(y_test, y_pred),
            "precision": precision_score(y_test, y_pred),
            "recall": recall_score(y_test, y_pred),
            "f1_score": f1_score(y_test, y_pred)
        }
        
        # Save metrics
        with open("metrics.json", "w") as f:
            json.dump(metrics, f, indent=4)
            
        print(f"✅ Evaluation complete. Metrics: {metrics}")

    except Exception as e:
        print(f"❌ Error in Evaluation: {e}")
        raise

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="params.yaml")
    args = parser.parse_args()
    evaluate_model(config_path=args.config)
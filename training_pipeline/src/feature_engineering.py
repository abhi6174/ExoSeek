import pandas as pd
import os
import yaml
import json
import argparse
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import RFE

def load_params(config_path):
    with open(config_path) as yaml_file:
        config = yaml.safe_load(yaml_file)
    return config

def engineered_features(config_path):
    config = load_params(config_path)
    
    try:
        # Load clean data
        processed_dir = config["processed_data_config"]["dir"]
        df = pd.read_csv(os.path.join(processed_dir, "clean_data.csv"))
        
        target_col = config["processed_data_config"]["target_col"]
        X = df.drop(columns=[target_col])
        y = df[target_col]
        
        # 1. Split Data (Prevent Leakage)
        test_size = config["model_config"]["test_size"]
        random_state = config["model_config"]["random_state"]
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
        
        # 2. Feature Selection (RFE)
        print("🔍 Running RFE to select top features...")
        n_features = config["model_config"]["n_features_to_select"]
        
        rf = RandomForestClassifier(n_estimators=100, random_state=random_state)
        rfe = RFE(estimator=rf, n_features_to_select=n_features)
        rfe.fit(X_train, y_train)
        
        selected_cols = X.columns[rfe.support_].tolist()
        print(f"✅ Selected Features: {selected_cols}")
        
        # 3. Filter Datasets
        X_train_selected = X_train[selected_cols]
        X_test_selected = X_test[selected_cols]
        
        # Add target back for saving
        train_df = X_train_selected.copy()
        train_df[target_col] = y_train
        
        test_df = X_test_selected.copy()
        test_df[target_col] = y_test
        
        # 4. Save Split Data
        train_df.to_csv(os.path.join(processed_dir, "train.csv"), index=False)
        test_df.to_csv(os.path.join(processed_dir, "test.csv"), index=False)
        
        # 5. Save Feature List (Important for Backend/Frontend!)
        model_dir = config["model_config"]["dir"]
        os.makedirs(model_dir, exist_ok=True)
        
        feature_list_path = os.path.join(model_dir, config["model_config"]["feature_list_name"])
        with open(feature_list_path, 'w') as f:
            json.dump(selected_cols, f)
            
        print(f"✅ Train/Test data and Feature List saved.")

    except Exception as e:
        print(f"❌ Error in Feature Engineering: {e}")
        raise

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="params.yaml")
    args = parser.parse_args()
    engineered_features(config_path=args.config)
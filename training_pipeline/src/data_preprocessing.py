import pandas as pd
import os
import yaml
import argparse

def load_params(config_path):
    with open(config_path) as yaml_file:
        config = yaml.safe_load(yaml_file)
    return config

def preprocess_data(config_path):
    config = load_params(config_path)
    
    try:
        # Load raw data
        raw_path = os.path.join(config["raw_data_config"]["dir"], config["raw_data_config"]["train_file"])
        df = pd.read_csv(raw_path)
        
        # --- Cleaning Logic ---
        # 1. Drop irrelevant ID columns
        cols_to_drop = ['rowid', 'kepid', 'kepoi_name', 'kepler_name', 
                        'koi_tce_delivname', 'koi_pdisposition', 'koi_score',
                        'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec']
        df.drop(columns=cols_to_drop, errors='ignore', inplace=True)
        
        # 2. Drop columns with > 50% missing data
        threshold = 0.5
        df = df.loc[:, df.isnull().mean() < threshold]
        
        # 3. Drop rows with remaining NaNs
        df.dropna(inplace=True)
        
        # 4. Filter: Remove 'CANDIDATE' (We only want binary classification)
        target = config["processed_data_config"]["target_col"]
        df = df[df[target] != 'CANDIDATE']
        
        # 5. Map Target: CONFIRMED=1, FALSE POSITIVE=0
        df[target] = df[target].map({'CONFIRMED': 1, 'FALSE POSITIVE': 0})
        
        # Save processed data (still all features)
        processed_dir = config["processed_data_config"]["dir"]
        os.makedirs(processed_dir, exist_ok=True)
        
        clean_path = os.path.join(processed_dir, "clean_data.csv")
        df.to_csv(clean_path, index=False)
        print(f"Preprocessed data saved to {clean_path}")

    except Exception as e:
        print(f" Error in Preprocessing: {e}")
        raise

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="params.yaml")
    args = parser.parse_args()
    preprocess_data(config_path=args.config)
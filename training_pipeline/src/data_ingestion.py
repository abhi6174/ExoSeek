import pandas as pd
import os
import yaml
import argparse

def load_params(config_path):
    with open(config_path) as yaml_file:
        config = yaml.safe_load(yaml_file)
    return config

def ingest_data(config_path):
    config = load_params(config_path)
    
    try:
        dataset_url = config["external_data_config"]["external_data_csv"]
        print(f"📥 Downloading data from {dataset_url}...")
        
        df = pd.read_csv(dataset_url)
        
        # Save raw data
        raw_data_dir = config["raw_data_config"]["dir"]
        raw_filename = config["raw_data_config"]["train_file"]
        
        os.makedirs(raw_data_dir, exist_ok=True)
        
        raw_path = os.path.join(raw_data_dir, raw_filename)
        df.to_csv(raw_path, index=False)
        
        print(f"✅ Raw data saved to {raw_path}")
        
    except Exception as e:
        print(f"❌ Error in Data Ingestion: {e}")
        raise

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="params.yaml")
    args = parser.parse_args()
    ingest_data(config_path=args.config)
from huggingface_hub import hf_hub_download, HfApi
import numpy as np
import os
import json
import gc  # 👈 Naya tool: Memory saaf karne ke liye
from dotenv import load_dotenv

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")
REPO_ID = "Ramais8763/my_FYP_Project_data"

NUM_PER_CATEGORY = 80

LOCAL_CACHE_DIR = "./hf_data_cache"
os.makedirs(LOCAL_CACHE_DIR, exist_ok=True)

print("🚀 Connecting to Hugging Face...")
api = HfApi(token=HF_TOKEN)

try:
    all_files = api.list_repo_files(repo_id=REPO_ID, repo_type="dataset")
    npy_files = [f for f in all_files if f.endswith(".npy") and not f.split("/")[-1].startswith("~$")]
    
    categories = [
        f.replace("full_numpy_bitmap_", "").replace(".npy", "")
        for f in npy_files
    ]
    
    print(f"📂 Total {len(categories)} categories. Data F: Drive mein aa raha hai...\n")
    
    X_data = []    
    Y_labels = []  

    for index, (file_name, category) in enumerate(zip(npy_files, categories)):
        print(f"[{index + 1}/{len(categories)}] Fetching {NUM_PER_CATEGORY} drawings for: {category}...")
        
        try:
            file_path = hf_hub_download(
                repo_id=REPO_ID, 
                filename=file_name, 
                repo_type="dataset",
                token=HF_TOKEN,
                cache_dir=LOCAL_CACHE_DIR 
            )

            full_data = np.load(file_path)
            limit = min(NUM_PER_CATEGORY, len(full_data))
            
            # .copy() zaroori hai taake connection break ho aur RAM free ho sake
            small_chunk = full_data[:limit].copy() 
            
            X_data.append(small_chunk)
            Y_labels.append(np.full(limit, index))
            
            # 🧹 MEMORY CLEANUP: Badi file ko RAM se fauran delete karein
            del full_data
            gc.collect()
            
        except Exception as e:
            print(f" -> ❌ Error in {category}: {e}")

    if len(X_data) > 0:
        print("\n🔄 Merging all data...")
        X_final = np.concatenate(X_data)
        Y_final = np.concatenate(Y_labels)

        print("💾 Saving .npy files to F: Drive...")
        np.save('X_training_data_FYP.npy', X_final)
        np.save('Y_training_labels_FYP.npy', Y_final)
        
        with open('categories_list.json', 'w') as f:
            json.dump(categories, f)

        print(f"\n🎉 PERFECT! Dataset tayyar hai.")
        print(f"📊 Total Categories: {len(categories)}")
        print(f"🖼️ Total Images: {X_final.shape[0]}")
        print("Ab aap 'python train_ccn.py' chala sakte hain!")
        
except Exception as e:
    print(f"❌ Main Error: {e}")
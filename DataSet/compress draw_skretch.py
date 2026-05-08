from huggingface_hub import hf_hub_download
import numpy as np

# 1. Aapka Repo aur Token (Token yahan lazmi dalain agar repo private hai)
hf_repo_name = "Ramais8763/my_FYP_Project_data"

# 2. Yeh list maine aapke actual uploaded files se banayi hai (Bilkul sahi spelling)
categories = [
    "apple", "airplane", "alarm clock", "ambulance", "ant", 
    "banana", "backpack", "baseball", "basketball", "bed", 
    "bee", "bird", "book", "birthday cake", "bicycle",
    "brain", "bread", "bridge", "broccoli", "broom"
]

X_data = []    
Y_labels = []  

print("🚀 Optimized Data Extraction Start Ho Rahi Hai...\n")

for index, category in enumerate(categories):
    # Aapki files ka prefix "full_numpy_bitmap_" hai
    file_to_download = f"full_numpy_bitmap_{category}.npy"
    print(f"[{index + 1}/{len(categories)}] Processing: {category}...")

    try:
        # Token ke sath download karein
        file_path = hf_hub_download(
            repo_id=hf_repo_name, 
            filename=file_to_download, 
            repo_type="dataset",
            token=my_token
        )

        # Data load aur chunking
        full_data = np.load(file_path)
        small_chunk = full_data[:5000] # Sirf 5000 drawings
        
        X_data.append(small_chunk)
        Y_labels.append(np.full(5000, index))
        
        print(f" -> ✅ Done! 5000 samples mil gaye.\n")
        
    except Exception as e:
        # Asli error dekhne ke liye 'e' ko print kar rahe hain
        print(f" -> ❌ Error in {category}: {e}\n")

# Final saving logic
if len(X_data) > 0:
    X_final = np.concatenate(X_data)
    Y_final = np.concatenate(Y_labels)

    np.save('X_training_data_FYP.npy', X_final)
    np.save('Y_training_labels_FYP.npy', Y_final)

    print(f"\n🎉 Mubarak ho! Dataset tayyar hai. Total images: {X_final.shape[0]}")
else:
    print("\n⚠️ Afsos, koi bhi file download nahi ho saki. Token aur Repo settings check karein.")
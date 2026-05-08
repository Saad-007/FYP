from huggingface_hub import HfApi

api = HfApi()

# Yahan apni details dalein
TOKEN = "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" # Apna Hugging Face token yahan dalein
REPO_ID = "Ramais8763/my_FYP_Project_data" # Apna Hugging Face username aur dataset ka naam yahan dalein (e.g., "john_doe/my_large_dataset")
FOLDER_PATH = "f:/data & sketch data" # Apne folder ka path dein

print("Uploading started... 16GB hai toh thoda time lagega.")

api.upload_folder(
    folder_path=FOLDER_PATH,
    repo_id=REPO_ID,
    repo_type="dataset",
    token=TOKEN
)

print("Mubarak ho! Upload complete ho gaya.")
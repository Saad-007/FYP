from huggingface_hub import HfApi

api = HfApi()

TOKEN = "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" # Apna Write token dalein
REPO_ID = "Ramais8763/my_FYP_Project_data" # Wahi purana Repo ID
NEW_FOLDER_PATH = r"F:/Data" # Naye folder ka path

print("Uploading 15GB update...")

api.upload_folder(
    folder_path=NEW_FOLDER_PATH,
    path_in_repo="Updated_Data_V2", # HF par is naam se naya folder ban jayega
    repo_id=REPO_ID,
    repo_type="dataset",
    token=TOKEN
)

print("Update Complete!")
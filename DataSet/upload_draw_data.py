import os
from dotenv import load_dotenv
from huggingface_hub import HfApi

# Load environment variables
load_dotenv()

TOKEN = os.getenv("HF_TOKEN")

REPO_ID = "Ramais8763/my_FYP_Project_data"
FOLDER_PATH = r"F:/data & sketch data"

if not TOKEN:
    raise ValueError(
        "HF_TOKEN not found. Please add it to your .env file."
    )

print("Uploading started... 16GB hai toh thoda time lagega.")

try:
    api = HfApi()

    api.upload_folder(
        folder_path=FOLDER_PATH,
        repo_id=REPO_ID,
        repo_type="dataset",
        token=TOKEN
    )

    print("Mubarak ho! Upload complete ho gaya.")

except Exception as e:
    print(f"❌ Upload failed: {e}")
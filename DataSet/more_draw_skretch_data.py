import os
from dotenv import load_dotenv
from huggingface_hub import HfApi

# Load environment variables
load_dotenv()

TOKEN = os.getenv("HF_TOKEN")

REPO_ID = "Ramais8763/my_FYP_Project_data"

NEW_FOLDER_PATH = r"F:/Data"

if not TOKEN:
    raise ValueError(
        "HF_TOKEN not found. Please add HF_TOKEN to your .env file."
    )


def main():
    api = HfApi()

    print("Uploading 15GB update...")

    try:
        api.upload_folder(
            folder_path=NEW_FOLDER_PATH,
            path_in_repo="Updated_Data_V2",
            repo_id=REPO_ID,
            repo_type="dataset",
            token=TOKEN
        )

        print("Update Complete!")

    except Exception as e:
        print(f"❌ Upload failed: {e}")


if __name__ == "__main__":
    main()
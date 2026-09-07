import os
import numpy as np
from PIL import Image
from dotenv import load_dotenv
from huggingface_hub import hf_hub_download, HfApi

# Load environment variables from .env
load_dotenv()

# Repository Details
REPO_ID = "Ramais8763/my_FYP_Project_data"
HF_TOKEN = os.getenv("HF_TOKEN")
NUM_IMAGES_PER_CATEGORY = 50

if not HF_TOKEN:
    raise ValueError("HF_TOKEN not found. Please add it to your .env file.")


def main():
    api = HfApi(token=HF_TOKEN)

    print("🔍 Hugging Face se saari categories dhoond rahe hain...")

    try:
        all_files = api.list_repo_files(
            repo_id=REPO_ID,
            repo_type="dataset"
        )

        # Temporary/ghost files ko filter out karein
        npy_files = [
            f for f in all_files
            if f.endswith(".npy")
            and not f.split("/")[-1].startswith("~$")
        ]

        print(f"📂 Total {len(npy_files)} valid categories milin!")

        base_output_dir = "EduAIQuest_Drawings"
        os.makedirs(base_output_dir, exist_ok=True)

        for index, file_name in enumerate(npy_files):

            clean_file_name = file_name.split("/")[-1]

            category_name = (
                clean_file_name
                .replace("full_numpy_bitmap_", "")
                .replace(".npy", "")
            )

            category_dir = os.path.join(
                base_output_dir,
                category_name
            )

            # Smart Resume Check
            if os.path.exists(category_dir):

                existing_files = [
                    f for f in os.listdir(category_dir)
                    if f.endswith(".png")
                ]

                if len(existing_files) >= NUM_IMAGES_PER_CATEGORY:
                    print(
                        f"⏩ [{index + 1}/{len(npy_files)}] "
                        f"Skipping {category_name.upper()} "
                        f"(Pehle se mojood hai)"
                    )
                    continue

            print(
                f"\n[{index + 1}/{len(npy_files)}] 🚀 "
                f"Processing: {category_name.upper()}..."
            )

            os.makedirs(category_dir, exist_ok=True)

            file_path = hf_hub_download(
                repo_id=REPO_ID,
                filename=file_name,
                repo_type="dataset",
                token=HF_TOKEN
            )

            data = np.load(file_path)

            limit = min(
                NUM_IMAGES_PER_CATEGORY,
                len(data)
            )

            print(
                f"✂️ Extracting top {limit} drawings "
                f"for {category_name}..."
            )

            for i in range(limit):

                image_array = data[i].reshape(28, 28)

                inverted_array = 255 - image_array

                img = Image.fromarray(
                    inverted_array,
                    mode="L"
                )

                save_path = os.path.join(
                    category_dir,
                    f"{category_name}_{i + 1}.png"
                )

                img.save(save_path)

        print(
            "\n🎉 BULK EXTRACTION COMPLETE! "
            "Saara data 'EduAIQuest_Drawings' "
            "folder mein ready hai."
        )

    except Exception as e:
        print(f"❌ Error occurred: {e}")


if __name__ == "__main__":
    main()
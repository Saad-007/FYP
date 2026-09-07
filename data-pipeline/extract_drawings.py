import os
import numpy as np
from PIL import Image
from dotenv import load_dotenv
from huggingface_hub import hf_hub_download

# Load environment variables
load_dotenv()

REPO_ID = "Ramais8763/my_FYP_Project_data"

FILE_NAME = "full_numpy_bitmap_airplane.npy"

HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    raise ValueError("HF_TOKEN not found. Please add it to your .env file.")


def main():
    print(f"🚀 Downloading {FILE_NAME} from Hugging Face...")

    try:
        # Hugging Face se directly root file download karega
        file_path = hf_hub_download(
            repo_id=REPO_ID,
            filename=FILE_NAME,
            repo_type="dataset",
            token=HF_TOKEN
        )

        print("✅ Download complete! Loading data into memory...")

        data = np.load(file_path)

        print(
            f"📊 Is file mein total {len(data)} "
            f"airplanes ki drawings hain."
        )

        output_dir = "test_drawings"
        os.makedirs(output_dir, exist_ok=True)

        print("✂️ Pehli 5 drawings ko PNG mein convert kar rahe hain...")

        for i in range(min(5, len(data))):

            image_array = data[i].reshape(28, 28)

            inverted_array = 255 - image_array

            img = Image.fromarray(
                inverted_array,
                mode="L"
            )

            save_path = os.path.join(
                output_dir,
                f"airplane_{i + 1}.png"
            )

            img.save(save_path)

            print(f"🖼️ Saved: {save_path}")

        print(
            "\n🎉 Pehla test mukammal! "
            "Apne folder mein 'test_drawings' check karein."
        )

    except Exception as e:
        print(f"❌ Error occurred: {e}")


if __name__ == "__main__":
    main()
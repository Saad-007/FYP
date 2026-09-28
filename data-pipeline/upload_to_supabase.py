import os
from supabase import create_client, Client

# 👇 YAHAN APNI SUPABASE DETAILS DAALEIN
SUPABASE_URL = "https://kecchipeimysyhjylnqi.supabase.co"
SUPABASE_KEY = "me key"
BUCKET_NAME = "edu-drawings"

# Local folders and log file
BASE_DIR = "EduAIQuest_Drawings"
LOG_FILE = "upload_log.txt"

def get_uploaded_files():
    # Yeh function check karega ke pehle kitni files upload ho chuki hain
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            return set(line.strip() for line in f)
    return set()

def log_upload(file_path):
    # Jo file upload ho jayegi, usay log mein likh denge taake dobara na ho
    with open(LOG_FILE, "a") as f:
        f.write(file_path + "\n")

def main():
    print("🚀 Connecting to Supabase...")
    
    # Supabase Client Initialize kar rahe hain
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print("❌ Supabase se connect nahi ho paya. URL ya Key check karein.")
        return

    uploaded_files = get_uploaded_files()
    print(f"📊 Pehle se {len(uploaded_files)} files cloud par upload ho chuki hain.")

    # Saari categories dhoondhein
    if not os.path.exists(BASE_DIR):
        print(f"❌ {BASE_DIR} folder nahi mila. Pehle data extract karein.")
        return
        
    categories = os.listdir(BASE_DIR)
    
    for category in categories:
        category_path = os.path.join(BASE_DIR, category)
        
        # Sirf folders ko process karein
        if not os.path.isdir(category_path):
            continue
            
        images = [img for img in os.listdir(category_path) if img.endswith(".png")]
        
        for img_name in images:
            local_file_path = os.path.join(category_path, img_name)
            
            # Supabase bucket mein path: jaise "bus/bus_1.png"
            supabase_file_path = f"{category}/{img_name}"
            
            # 🛑 SMART RESUME CHECK
            if supabase_file_path in uploaded_files:
                continue
                
            print(f"⬆️ Uploading: {supabase_file_path}...")
            
            try:
                # File ko binary mode mein parhein aur upload karein
                with open(local_file_path, 'rb') as f:
                    supabase.storage.from_(BUCKET_NAME).upload(
                        file=f,
                        path=supabase_file_path,
                        file_options={"content-type": "image/png"}
                    )
                # Kamyabi se upload hone ke baad log mein likh dein
                log_upload(supabase_file_path)
                
            except Exception as e:
                error_msg = str(e)
                # Agar ghalti se file pehle se wahan mojood hai
                if "Duplicate" in error_msg or "already exists" in error_msg:
                    log_upload(supabase_file_path)
                else:
                    print(f"❌ Error uploading {supabase_file_path}: {e}")

    print("\n🎉 BUCKET UPLOAD COMPLETE! Saari tasweerein cloud par safely pohanch chuki hain.")

if __name__ == "__main__":
    main()
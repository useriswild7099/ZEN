"""
Resilient Downloader for MeeTARA Qwen 2.5 1.5B Instruct GGUF Model
Features:
- Resumes broken downloads seamlessly using Range HTTP header
- Infinite retry loop on network disconnects / timeouts
- Live progress bar & stats in separate terminal window
- Auto-registers model into Ollama once download finishes
"""

import os
import sys
import time
import urllib.request
import subprocess

# Force UTF-8 stdout for Windows CMD
sys.stdout.reconfigure(encoding='utf-8')

REPO_ID = "meetara-lab/meetara-qwen2.5-1.5b-instruct-gguf"
FILENAME = "meetara-qwen2.5-1.5b-instruct-Q4_K_M.gguf"
DOWNLOAD_URL = f"https://huggingface.co/{REPO_ID}/resolve/main/{FILENAME}"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEST_PATH = os.path.join(SCRIPT_DIR, FILENAME)

def get_remote_file_size(url):
    try:
        req = urllib.request.Request(url, method='HEAD')
        req.add_header('User-Agent', 'Mozilla/5.0')
        with urllib.request.urlopen(req, timeout=10) as resp:
            return int(resp.headers.get('Content-Length', 0))
    except Exception:
        return 0

def download_with_resume():
    print("=" * 65)
    print(" MeeTARA Qwen 2.5 1.5B Instruct - Resilient Model Downloader")
    print("=" * 65)
    print(f"Model File: {FILENAME}")
    print(f"Destination: {DEST_PATH}\n")

    total_bytes = get_remote_file_size(DOWNLOAD_URL)
    if total_bytes > 0:
        print(f"Total Size: {total_bytes / (1024 * 1024):.2f} MB ({total_bytes / (1024**3):.2f} GB)")

    attempt = 0
    buffer_size = 1024 * 512 # 512 KB chunks

    while True:
        attempt += 1
        existing_bytes = os.path.getsize(DEST_PATH) if os.path.exists(DEST_PATH) else 0

        if total_bytes > 0 and existing_bytes >= total_bytes:
            print("\nDownload already complete!")
            break

        print(f"\n[Attempt {attempt}] Resuming download from {existing_bytes / (1024 * 1024):.2f} MB...")

        req = urllib.request.Request(DOWNLOAD_URL)
        req.add_header('User-Agent', 'Mozilla/5.0')
        if existing_bytes > 0:
            req.add_header('Range', f'bytes={existing_bytes}-')

        try:
            chunk_downloaded = 0

            with urllib.request.urlopen(req, timeout=15) as resp, open(DEST_PATH, 'ab') as f:
                content_range = resp.headers.get('Content-Range')
                if total_bytes == 0 and content_range:
                    total_bytes = int(content_range.split('/')[-1])

                chunk_start_time = time.time()
                while True:
                    chunk = resp.read(buffer_size)
                    if not chunk:
                        break

                    f.write(chunk)
                    existing_bytes += len(chunk)
                    chunk_downloaded += len(chunk)

                    now = time.time()
                    elapsed = now - chunk_start_time
                    speed_mb = (chunk_downloaded / (1024 * 1024)) / elapsed if elapsed > 0 else 0

                    if total_bytes > 0:
                        pct = (existing_bytes / total_bytes) * 100
                        mb_done = existing_bytes / (1024 * 1024)
                        mb_total = total_bytes / (1024 * 1024)
                        bar_len = 30
                        filled = int(bar_len * existing_bytes // total_bytes)
                        bar = '=' * filled + '-' * (bar_len - filled)
                        print(f"\r[{bar}] {pct:6.2f}% | {mb_done:.1f}/{mb_total:.1f} MB | {speed_mb:.2f} MB/s ", end='', flush=True)

            print("\n\nDownload completed successfully!")
            break

        except Exception as e:
            print(f"\nNetwork glitch/disconnect ({e}). Retrying in 5 seconds...")
            time.sleep(5)

    # Register into Ollama
    register_ollama()

def register_ollama():
    print("\n" + "=" * 65)
    print(" Registering MeeTARA Model into Ollama...")
    print("=" * 65)

    modelfile_path = os.path.join(SCRIPT_DIR, "Modelfile.meetara")
    modelfile_content = f'''FROM "{DEST_PATH.replace('\\', '/')}"

# MeeTARA Qwen 2.5 1.5B Instruct - Empathetic Mental Health Assistant
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER repeat_penalty 1.15
PARAMETER num_ctx 4096
'''
    with open(modelfile_path, "w", encoding="utf-8") as f:
        f.write(modelfile_content)

    print(f"Created Modelfile at {modelfile_path}")
    print("Executing: ollama create meetara -f Modelfile.meetara ...")

    try:
        res = subprocess.run(["ollama", "create", "meetara", "-f", modelfile_path], capture_output=True, text=True)
        if res.returncode == 0:
            print("Successfully registered model as 'meetara' in Ollama!")
            print("You can now use OLLAMA_MODEL=meetara in your .env!")
        else:
            print(f"Ollama registration notice: {res.stderr}")
    except Exception as err:
        print(f"Could not register into Ollama automatically: {err}")

    print("\nPress Enter to exit window...")
    try:
        input()
    except Exception:
        pass

if __name__ == "__main__":
    download_with_resume()

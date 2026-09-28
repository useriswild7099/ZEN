import os
import sys

try:
    import pypdf
except ImportError:
    try:
        import PyPDF2 as pypdf
    except ImportError:
        print("❌ Neither pypdf nor PyPDF2 is installed.")
        sys.exit(1)

def read_pdf(path):
    print(f"📖 Reading: {path}")
    try:
        reader = pypdf.PdfReader(path)
        print(f"✅ PDF Loaded. Pages: {len(reader.pages)}")
        
        # Extract FULL text for RAG
        full_text = ""
        print(f"⏳ Extracting text from {len(reader.pages)} pages... This may take a moment.")
        
        for i, page in enumerate(reader.pages):
            full_text += f"\n--- PAGE {i+1} ---\n"
            full_text += page.extract_text() + "\n"
            
        output_path = os.path.join(os.path.dirname(path), "..", "data", "counseling_handbook.txt")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(full_text)
            
        print(f"✅ Full text saved to: {output_path}")
        print(f"📊 Total Characters: {len(full_text)}")
        
    except Exception as e:
        print(f"❌ Error reading PDF: {e}")

if __name__ == "__main__":
    pdf_path = r"e:\prince\Projects\neuralx health\frontend\assets\Counselling and Guidance By Rao.pdf"
    read_pdf(pdf_path)

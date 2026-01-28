import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from uuid import uuid4
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Load environment
load_dotenv()

# Initialize embeddings model
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",  # Cost-effective and good quality
    openai_api_key=os.environ.get("OPENAI_API_KEY")
)

# Initialize text splitter
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
    is_separator_regex=False,
    separators=["\n\n", "\n", ". ", " ", ""]
)

# Initialize vector store
vector_store = Chroma(
    embedding_function=embeddings,  
    collection_name="ingested_law_docs",
    persist_directory="./chroma"
)

# Get directories
BASE_DIR = Path(__file__).resolve().parent
DOCS_DIR = BASE_DIR.parent / "PolicyGeneratorDocuments"
base_path = "/Users/varunsingh/Desktop/CompliGen"

# Track progress
total_files = 0
total_chunks = 0

print("🚀 Starting document ingestion...")
print(f"📁 Scanning directory: {DOCS_DIR}\n")

# Loop through all PDFs
for file_path in DOCS_DIR.rglob('*.pdf'):
    
    total_files += 1
    print(f"[{total_files}] Processing: {file_path.name}")
    
    # Load PDF in langchain documents
    loader = PyPDFLoader(str(file_path))  #  Convert Path to string
    docs = loader.load()
    
    # Process based on directory
    if file_path.parent.parent.name == "examples":
        # Example documents
        # example documents have the type and the company
        file_info = file_path.stem.split("_")
        
        for doc in docs:
            # Fix source path
            abs_path = doc.metadata['source']
            if abs_path.startswith(base_path):
                relative_path = abs_path.replace(base_path, "").lstrip("/")
                doc.metadata['source'] = relative_path
            
            # Determine policy type and company
            if 'Terms of use' in file_info:
                index = file_info.index('Terms of use')
                doc.metadata.update({
                    'doc_type': 'example',
                    'policy_type': 'Terms of use',
                    'company': file_info[1-index]
                })
            elif 'Cookies Policy' in file_info:
                index = file_info.index('Cookies Policy')
                doc.metadata.update({
                    'doc_type': 'example',
                    'policy_type': 'Cookies Policy',
                    'company': file_info[1-index]
                })
            elif 'Acceptable Use Policy' in file_info:
                index = file_info.index('Acceptable Use Policy')
                doc.metadata.update({
                    'doc_type': 'example',
                    'policy_type': 'Acceptable Use Policy',
                    'company': file_info[1-index]
                })
            elif 'Data Processing Addendum' in file_info:
                index = file_info.index('Data Processing Addendum')
                doc.metadata.update({
                    'doc_type': 'example',
                    'policy_type': 'Data Processing Addendum',
                    'company': file_info[1-index]
                })
            elif 'Privacy Policy' in file_info:
                index = file_info.index('Privacy Policy')
                doc.metadata.update({
                    'doc_type': 'example',
                    'policy_type': 'Privacy Policy',
                    'company': file_info[1-index]
                })
    
    elif file_path.parent.name == "Laws":
        # Law documents
        file_info = file_path.stem
        
        for doc in docs:
            # Fix source path
            abs_path = doc.metadata['source']
            if abs_path.startswith(base_path):
                relative_path = abs_path.replace(base_path, "").lstrip("/")
                doc.metadata['source'] = relative_path
            
            #  FIX: Add metadata for laws
            doc.metadata.update({
                'doc_type': 'law',
                'regulation': file_info,
                'jurisdiction': 'Australia'
            })
    
    elif file_path.parent.name == "policy_template":
        # Template documents
        # name of the file which is being ingested
        file_info = file_path.stem
        
        for doc in docs:
            # Fix source path
            abs_path = doc.metadata['source']
            if abs_path.startswith(base_path):
                relative_path = abs_path.replace(base_path, "").lstrip("/")
                doc.metadata['source'] = relative_path
            
            # FIX: Add metadata for templates
            doc.metadata.update({
                'doc_type': 'template',
                'template_name': file_info
            })
    

    # Split documents into chunks
    chunks = splitter.split_documents(docs)
    
    # Generate UUIDs
    uuids = [str(uuid4()) for _ in range(len(chunks))]
    
    # Add to vector store
    vector_store.add_documents(
        documents=chunks,  # ✅ Can pass Document objects directly
        ids=uuids
    )
    
    # ✅ Track progress
    total_chunks += len(chunks)
    print(f"   ✓ Created {len(chunks)} chunks from {len(docs)} pages")

# ✅ Final summary
print("\n" + "="*50)
print("✅ Ingestion Complete!")
print(f"📄 Total Files Processed: {total_files}")
print(f"📦 Total Chunks Created: {total_chunks}")
print(f"💾 Vector DB Location: ./chroma")
print("="*50)
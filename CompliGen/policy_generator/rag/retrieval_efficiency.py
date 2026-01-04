import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
import time

# Load environment
load_dotenv()

# Initialize embeddings model
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=os.environ.get("GOOGLE_API_KEY")
)

# Initialize vector store
print("🔄 Initializing ChromaDB...")
init_start = time.time()
vector_store = Chroma(
    embedding_function=embeddings,  
    collection_name="ingested_law_docs",
    persist_directory="./chroma"
)
init_time = time.time() - init_start
print(f"✅ ChromaDB initialized in {init_time:.3f}s\n")

# Get collection info
print("📊 Collection Info:")
print(f"   Total documents: {vector_store._collection.count()}")
print(f"   Collection name: {vector_store._collection.name}\n")

print("="*60)
print("🔬 PERFORMANCE DIAGNOSTIC")
print("="*60)

# Test 1: First query (cold start)
print("\n📍 Test 1: First Query (Cold Start)")
start = time.time()
results1 = vector_store.similarity_search(
    "privacy policy data collection requirements",
    k=5,
    filter={"doc_type": "law"}
)
cold_time = time.time() - start
print(f"   ⏱️  Time: {cold_time:.3f}s")
print(f"   📄 Results: {len(results1)} chunks retrieved")

# Test 2: Second query (warmed up)
print("\n📍 Test 2: Second Query (Warmed Up)")
start = time.time()
results2 = vector_store.similarity_search(
    "cookie policy tracking technologies",
    k=5,
    filter={"doc_type": "law"}
)
warm_time = time.time() - start
print(f"   ⏱️  Time: {warm_time:.3f}s")
print(f"   📄 Results: {len(results2)} chunks retrieved")

# Test 3: Third query (consistency check)
print("\n📍 Test 3: Third Query (Consistency)")
start = time.time()
results3 = vector_store.similarity_search(
    "terms of service consumer rights",
    k=5,
    filter={"doc_type": "law"}
)
third_time = time.time() - start
print(f"   ⏱️  Time: {third_time:.3f}s")
print(f"   📄 Results: {len(results3)} chunks retrieved")

# Test 4: Query without filter
print("\n📍 Test 4: Query WITHOUT Filter")
start = time.time()
results4 = vector_store.similarity_search(
    "privacy policy",
    k=5
)
no_filter_time = time.time() - start
print(f"   ⏱️  Time: {no_filter_time:.3f}s")
print(f"   📄 Results: {len(results4)} chunks retrieved")

# Test 5: Just embedding (no retrieval)
print("\n📍 Test 5: Embedding Only (OpenAI API)")
start = time.time()
query_embedding = embeddings.embed_query("test query")
embed_time = time.time() - start
print(f"   ⏱️  Time: {embed_time:.3f}s")
print(f"   📊 Embedding size: {len(query_embedding)} dimensions")

# Performance Summary
print("\n" + "="*60)
print("📊 PERFORMANCE SUMMARY")
print("="*60)
print(f"   Initialization:     {init_time:.3f}s")
print(f"   Cold Start Query:   {cold_time:.3f}s")
print(f"   Warm Query (2nd):   {warm_time:.3f}s")
print(f"   Warm Query (3rd):   {third_time:.3f}s")
print(f"   Without Filter:     {no_filter_time:.3f}s")
print(f"   OpenAI Embedding:   {embed_time:.3f}s")
print(f"\n   Average (warm):     {(warm_time + third_time) / 2:.3f}s")

# Performance Rating
avg_warm = (warm_time + third_time) / 2
print("\n" + "="*60)
if avg_warm < 0.2:
    print("✅ Performance: EXCELLENT (<200ms)")
elif avg_warm < 0.5:
    print("✅ Performance: GOOD (200-500ms)")
elif avg_warm < 1.0:
    print("⚠️  Performance: ACCEPTABLE (500ms-1s)")
elif avg_warm < 2.0:
    print("⚠️  Performance: SLOW (1-2s)")
else:
    print("❌ Performance: TOO SLOW (>2s)")
print("="*60)

# Show sample results from first query
print("\n" + "="*60)
print("🔍 SAMPLE RESULTS (First Query)")
print("="*60)
for i, doc in enumerate(results1, 1):
    print(f"\n[{i}] {doc.metadata.get('regulation', 'Unknown')}")
    print(f"    Page: {doc.metadata.get('page', '?')}")
    print(f"    Doc Type: {doc.metadata.get('doc_type', '?')}")
    print(f"    Preview: {doc.page_content[:150]}...")

print("\n✅ Diagnostic Complete!")
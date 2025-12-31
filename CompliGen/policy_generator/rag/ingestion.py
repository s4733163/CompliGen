import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma

# load the dotenv
load_dotenv()

# initialise the embeddings model
embeddings = OpenAIEmbeddings(openai_api_key=os.environ.get("OPENAI_API_KEY"))

# split the document into chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,        # Characters per chunk
    chunk_overlap=200,      # Overlap between chunks
    length_function=len,    # How to measure length
    is_separator_regex=False,
    separators=["\n\n", "\n", ". ", " ", ""]  # Priority order
)

# vector db initialized
vector_store = Chroma(
    embedding_function=OpenAIEmbeddings,
    collection_name="ingested_law_docs",# collection created
    persist_directory="./chroma" # the directory

)

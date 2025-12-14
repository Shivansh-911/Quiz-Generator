import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const embeddingModel = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY,
  model: "sentence-transformers/all-MiniLM-L6-v2"
});

async function embedChunks(chunks) {
  const embeddings = [];

  for (const chunk of chunks) {
    const vector = await embeddingModel.embedQuery(chunk);
    embeddings.push({
      text: chunk,
      embedding: vector
    });
  }

  return embeddings;
}

export default embedChunks;

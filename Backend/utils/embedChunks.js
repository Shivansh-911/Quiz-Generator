import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

async function embedChunks(chunks) {
    const model = new GoogleGenerativeAIEmbeddings({
        modelName: "embedding-001",
        apiKey: process.env.GOOGLE_API_KEY
    });

    const embeddings = [];
    for (const chunk of chunks) {
        const embedding = await model.embedQuery(chunk);
        embeddings.push({
            embedding,
            text: chunk
        });
    }
    return embeddings;
}

export default embedChunks;

let store = [];

export function addEmbeddings(embeddedChunks) {
    store = embeddedChunks;
}

export function getRelevantChunks(queryEmbedding, topK = 5) {
    return store
        .map(({ embedding, text }) => ({
            text,
            score: cosineSimilarity(queryEmbedding, embedding)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(item => item.text);
}

function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

function generateQuery({ topics, description, fallbackText }) {
    let query = "";

    if (topics && description) {
        query = `Generate a quiz mainly focused on the following topics: ${topics}. 
                 The document is about: ${description}. 
                 Include other relevant topics too if present.`;
    } else if (topics) {
        query = `Generate a quiz mainly focused on the following topics: ${topics}. 
                 You may include related concepts from the document as well.`;
    } else if (description) {
        query = `Generate a quiz based on this description: ${description}. 
                 Include all relevant topics from the document.`;
    } else {
        query = `extract important information`;
    }

    return query.trim();
}

export default generateQuery;

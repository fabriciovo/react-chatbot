import { OpenAIEmbeddings } from "@langchain/openai";

async function getVector(text) {
    try {
      const embeddings = new OpenAIEmbeddings();
      const res = await embeddings.embedQuery(text);
      return res;
    } catch (error) {
      console.error("Erro ao gerar vetor de texto:", error);
      throw error;
    }
  }

export default getVector;
import { OpenAIEmbeddings } from "@langchain/openai";

export const generateResponse = async (text: string): Promise<number[]> => {
  try {
    const embeddings = new OpenAIEmbeddings();
    const res = await embeddings.embedQuery(text);
    return res;
  } catch (error) {
    console.error("Erro ao gerar vetor de texto:", error);
    throw error;
  }
};

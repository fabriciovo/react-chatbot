import { Request, Response } from "express";
import { getCollection } from "@config/database";
import { generateResponse } from "@utils/langchain";
import { llm } from "@config/openai";
import {PromptTemplate} from "@langchain/core/prompts";

export const botMessage = async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: "Mensagem é obrigatória!" });
    return;
  }

  try {
    const collection = getCollection();
    if (!collection) {
      throw new Error("Banco de dados não inicializado.");
    }

    const queryVector = await generateResponse(message);

    const results = await collection
      .aggregate([
        {
          $search: {
            index: "default",
            knnBeta: {
              vector: queryVector,
              path: "embedding",
              k: 3,
            },
          },
        },
        {
          $project: {
            name: 1,
            description: 1,
            url: 1,
            score: { $meta: "searchScore" },
          },
        },
      ])
      .toArray();

    const contextListings = results
      .map((listing) => `- ${listing.name}: ${listing.description}`)
      .join("\n");

      const prompt = new PromptTemplate({
        template: `Você é um assistente especializado em acomodações da coleção Airbnb e ajuda os usuários a encontrar listagens relevantes. Aqui estão as listagens mais relacionadas à pergunta do usuário:\n${contextListings}\n\nPergunta: "{message}"`,
        inputVariables: ["message"],
      });
  
      const _llm = llm;
      const chain = prompt.pipe(_llm);
  
      const botResponse = await chain.invoke({
        message,
      });

      console.log(botResponse)

      res.json({
        userMessage: message,
        botResponse:botResponse
      });

  } catch (error) {
    console.error("Erro ao processar a mensagem:", error);
    res
      .status(500)
      .json({ error: "Erro ao processar a mensagem com LangChain ou MongoDB." });
  }
};

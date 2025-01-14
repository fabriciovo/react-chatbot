import express from 'express';
import getVector from '../functions/getVector';

const router = express.Router();

router.post("/botMessage", async (req, res) => {
    const { message } = req.body;
  
    if (!message) {
      return res.status(400).json({ error: "Mensagem é obrigatória!" });
    }
  
    try {
      const queryVector = await getVector(message);
  
      const results = await collection.aggregate([
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
      ]).toArray();
  
      const contextListings = results
        .map((listing) => `- ${listing.name}: ${listing.description}`)
        .join("\n");
  
      const prompt = new PromptTemplate({
        template: `Você é um assistente especializado em acomodações da coleção Airbnb e ajuda os usuários a encontrar listagens relevantes. Aqui estão as listagens mais relacionadas à pergunta do usuário:\n${contextListings}\n\nPergunta: "{message}"`,
        inputVariables: ["message"],
      });
  
      const chain = prompt.pipe(llm);
  
      const botResponse = await chain.invoke({
        message,
      });

      res.json({
        userMessage: message,
        botResponse: botResponse,
      });
    } catch (error) {
      console.error("Erro ao processar a mensagem:", error);
      res.status(500).json({ error: "Erro ao processar a mensagem com o LangChain ou MongoDB." });
    }
  });

  export default router;
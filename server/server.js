require("dotenv/config");
const cors = require("cors");
const express = require("express");
const { MongoClient } = require("mongodb");
const { OpenAI } = require("langchain/llms/openai");


const app = express();

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
});

const uri = process.env.MONGODB_URI; 
const client = new MongoClient(uri);

let db, collection;
const collectionName = "listingsAndReviews"; 

(async () => {
  try {
    await client.connect();
    db = client.db("sample_airbnb");
    collection = db.collection(collectionName);
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
})();

app.get("/", (req, res) => {
  res.json({ answer: "Hello world! Este chatbot usa LangChain para responder perguntas sobre acomodações." });
});

app.post("/botMessage", async (req, res) => {
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

    const prompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "Você é um assistente especializado em acomodações da coleção 'sample_airbnb.listingsAndReviews' e ajuda os usuários a encontrar listagens relevantes."
      ),
      HumanMessagePromptTemplate.fromTemplate(
        `Aqui estão as listagens mais relacionadas à pergunta do usuário:\n{context}\n\nPergunta: "{message}"`
      ),
    ]);

    const chain = new LLMChain({
      llm: openai,
      prompt,
    });

    const botResponse = await chain.call({
      context: contextListings,
      message,
    });

    res.json({
      userMessage: message,
      botResponse: botResponse.text,
    });
  } catch (error) {
    console.error("Erro ao processar a mensagem:", error);
    res.status(500).json({ error: "Erro ao processar a mensagem com o LangChain ou MongoDB." });
  }
});

async function getVector(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Erro ao gerar vetor de texto:", error);
    throw error;
  }
}

app.use((request, response) => {
  response.status(404).json({ message: "404 - Not Found", status: 404 });
});

app.use((error, request, response, next) => {
  console.error(error);
  response
    .status(error.status || 500)
    .json({ error: error.message, status: 500 });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

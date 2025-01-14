require("dotenv/config");
const cors = require("cors");
const express = require("express");
const { MongoClient } = require("mongodb");
const { OpenAI, OpenAIEmbeddings } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
import routes from "./routes";
const app = express();

app.use(express.json());
app.use(cors());
app.use("/", routes);

  const llm = new OpenAI({
    model: "gpt-3.5-turbo-instruct",
    temperature: 0,
    maxTokens: undefined,
    timeout: undefined,
    maxRetries: 2,
    apiKey: process.env.OPENAI_API_KEY,
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

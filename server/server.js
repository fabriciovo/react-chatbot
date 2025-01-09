require("dotenv/config");
const cors = require('cors');
const express = require('express');
const OpenAI = require("openai");

const app = express();

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mockNews = [
  { id: 1, title: "Motoristas de carros de luxo envolvidos em acidente fatal são autuados por racha", url: "https://www.band.uol.com.br/noticias/brasil-urgente/ultimas/motoristas-de-carros-de-luxo-envolvidos-em-acidente-fatal-sao-autuados-por-racha-202501091809", content: "Proprietário do Audi envolvido no acidente deve ser investigado por homicídio e lesão corporal culposos na direção de veículo automotor" },
  { id: 2, title: "Avião da FAB faz pouso de emergência em Brasília após problema técnico", url: "https://www.band.uol.com.br/noticias/aviao-da-fab-faz-pouso-de-emergencia-em-brasilia-apos-problema-tecnico-202501091700", content: "Segundo o Comando da Aeronáutica, a aeronave teve problemas técnicos durante um voo de experiência. Ninguém ficou ferido." },
  { id: 3, title: "Entidades pedem que Dino reconsidere decisão que suspendeu emendas", url: "https://www.band.uol.com.br/noticias/entidades-pedem-que-dino-reconsidere-decisao-que-suspendeu-emendas-202501091657", content: "Dino bloqueou o envio de emendas a 13 organizações que, segundo a Controladoria-Geral da União, não dão a transparência adequada à gestão dos recursos públicos" },
];

app.get('/', (req, res) => {
  res.json({ answer: "Olá mundo!" });
});

app.post("/botMessage", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mensagem é obrigatória!" });
  }

  try {
    const query = message.toLowerCase();
    const newsList = mockNews.filter(
      (news) =>
        news.title.toLowerCase().includes(query) ||
        news.content.toLowerCase().includes(query)
    );

    const contextNews = newsList
      .map((news) => `- ${news.title}: ${news.url}`)
      .join("\n");

    const prompt = `Você é um chatbot que responde perguntas sobre notícias do https://www.band.uol.com.br/noticias. Aqui estão algumas notícias relacionadas:\n${contextNews}\n\nPergunta do usuário: "${message}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em notícias do https://www.band.uol.com.br/noticias"
        },
        {
          role: "user",
          content: prompt
        },
      ],
    });


    const botResponse = response.choices[0].message.content;

    res.json({
      userMessage: message,
      botResponse,
    });
  } catch (error) {
    console.error("Erro ao chamar a API do ChatGPT:", error);
    res.status(500).json({ error: "Erro ao se comunicar com o ChatGPT." });
  }
});

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

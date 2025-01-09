import { useState } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot: React.FC = () => {
  const firstBotMessage: Message = { sender: "bot", text: "Olá, eu sou seu assistente da Band, pode perguntar qualquer coisa :)" };

  const [messages, setMessages] = useState<Message[]>([firstBotMessage]);
  const [input, setInput] = useState<string>("");
  const [minimize, setMinimize] = useState<boolean>(false);



  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    getBotMessage(input);
  };

  const getBotMessage = async (userInput: string) => {
    try {
      const response = await fetch("http://localhost:3002/botMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error("Falha ao comunicar com o chatbot");
      }

      const data = await response.json();

      const botMessage: Message = {
        sender: "bot",
        text: data.botResponse,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erro:", error);
      const botMessage: Message = {
        sender: "bot",
        text: "Desculpe, algo deu errado!",
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  };


  return (
    <div className="flex flex-col max-w-md mx-auto bg-white border rounded-lg shadow-lg fixed right-1 bottom-0 w-[320px] transition-all"
    style={{height: minimize ? 384 : 47 }}>
      <button className="w-1/2 text-center " onClick={()=>setMinimize(prev => !prev)}> {minimize ? <>Min</> : <>Max</>}</button>
      <div
        className="flex-grow overflow-y-auto p-4"
        style={{ height: "300px" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end text-right"
                : "bg-gray-200 text-black self-start text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex items-center border-t p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-grow p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

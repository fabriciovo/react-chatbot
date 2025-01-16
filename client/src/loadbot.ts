(function () {
    const chatbotCssUrl = `${import.meta.env.VITE_CHATBOT_SITE}/assets/main.css`;
    const chatbotJsUrl = `${import.meta.env.VITE_CHATBOT_SITE}/loadbot.js`;
  
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chatbotCssUrl;
    link.media = "all";
    document.head.appendChild(link);
  
    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "chatbot";
    document.body.appendChild(chatbotContainer);
  
    const script = document.createElement("script");
    script.src = chatbotJsUrl;
    script.async = true;
    document.body.appendChild(script);
  })();
  
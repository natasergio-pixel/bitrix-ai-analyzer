export default async function handler(req, res) {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const text = body?.text || "";

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `
Ты помощник редактора Bitrix24.

Проанализируй текст и верни:

1. web / mobile / both  
2. есть ли мобильные скрины  
3. есть ли ошибки  
4. категория  
5. улучшение  

Текст:
${text.slice(0, 12000)}
            `
          }
        ]
      })
    });

    const data = await response.json();

    const answer = data?.choices?.[0]?.message?.content;

    return res.status(200).json({ result: answer || "No response from model" });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}

export default async function handler(req, res) {
  const { text } = req.body;

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
Проанализируй статью:

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

  res.status(200).json({
    result: data.choices?.[0]?.message?.content
  });
}

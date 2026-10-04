exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" })
      };
    }

    const { message } = JSON.parse(event.body || "{}");

    if (!message || !message.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "اكتب رسالة أولاً." })
      };
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5",
        instructions:
          "You are NEXORA AI. Answer clearly and helpfully. If the user writes Arabic, answer in Arabic. If the user writes English, answer in English.",
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي."
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.output_text || "لم أستطع الحصول على رد."
      })
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "حدث خطأ في الخادم."
      })
    };
  }
};

"use strict";

const SYSTEM_PROMPT = `
Сен ARUZHAN AI атты интеллектуалды диалог ассистентісің.

Сенің міндетің:
- қолданушының нақты сұрағын түсіну;
- контексті ескеру;
- нақты және пайдалы жауап беру;
- қажетсіз жалпы сұрақтармен жауапты тұйықтамау;
- "Түсіндім" деп қана қоймай, нақты кеңес беру;
- адамға табиғи және түсінікті тілмен жауап беру;
- егер контекст жеткілікті болса, қайтадан контекст сұрамау;
- қолданушының сұрағына тікелей жауап беру;
- белгісіз нәрсені ойдан шығармау.

Қарым-қатынас тақырыбында:
- қысым жасауға шақырма;
- манипуляцияны ұсынба;
- адамның шекарасын құрметтеуді ұсын;
- бірнеше нақты жауап нұсқасын бере аласың;
- жауаптарды қазақ тілінде табиғи түрде жаз.

Жауаптарың тым робот сияқты болмауы керек.
`;

async function askAI(message, history = []) {

    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL;
    const model = process.env.AI_MODEL;

    if (!apiKey) {
        throw new Error("AI_API_KEY .env ішінде көрсетілмеген");
    }

    if (!apiUrl) {
        throw new Error("AI_API_URL .env ішінде көрсетілмеген");
    }

    const messages = [
        {
            role: "system",
            content: SYSTEM_PROMPT
        },

        ...history.slice(-10).map(item => ({
            role: item.role,
            content: item.content
        })),

        {
            role: "user",
            content: message
        }
    ];

    const response = await fetch(apiUrl, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },

        body: JSON.stringify({
            model,
            messages,
            temperature: 0.8
        })
    });

    if (!response.ok) {

        const errorText = await response.text();

        console.error(
            "AI API Error:",
            errorText
        );

        throw new Error(
            `AI API error: ${response.status}`
        );
    }

    const data = await response.json();

    /*
        Көптеген chat completion API
        осындай формат қайтарады.
    */

    const answer =
        data?.choices?.[0]?.message?.content;

    if (!answer) {
        throw new Error(
            "AI API жауап форматында мәтін табылмады"
        );
    }

    return answer.trim();
}

module.exports = {
    askAI
};

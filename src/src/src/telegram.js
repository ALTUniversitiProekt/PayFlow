"use strict";

const {
    setPendingQuestion
} = require("./store");

async function sendTelegramMessage(
    chatId,
    text
) {

    const token =
        process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
        throw new Error(
            "TELEGRAM_BOT_TOKEN .env ішінде жоқ"
        );
    }

    const url =
        `https://api.telegram.org/bot${token}/sendMessage`;

    const response =
        await fetch(url, {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                chat_id:
                    chatId,

                text,

                parse_mode:
                    "HTML"

            })

        });

    if (!response.ok) {

        const error =
            await response.text();

        console.error(
            "Telegram error:",
            error
        );

        throw new Error(
            "Telegram хабарламасын жіберу сәтсіз аяқталды"
        );
    }

    return response.json();
}


async function sendHumanQuestion({
    userId,
    question
}) {

    const adminChatId =
        process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!adminChatId) {

        throw new Error(
            "TELEGRAM_ADMIN_CHAT_ID .env ішінде жоқ"
        );
    }

    setPendingQuestion(
        userId,
        question
    );

    const telegramText = `

<b>🆕 ARUZHAN AI — АДАМ КЕҢЕСШІСІНЕ СҰРАҚ</b>

<b>User ID:</b>
<code>${escapeHTML(userId)}</code>

<b>Сұрақ:</b>

${escapeHTML(question)}

━━━━━━━━━━━━━━

Жауап беру үшін осы хабарламаға
Reply арқылы жауап жазыңыз.

`;

    return sendTelegramMessage(
        adminChatId,
        telegramText
    );
}


function escapeHTML(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        );
}


module.exports = {

    sendTelegramMessage,

    sendHumanQuestion

};

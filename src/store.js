"use strict";

/*
    Уақытша memory store.

    Кейін production кезінде:
    PostgreSQL / MySQL / MongoDB / Redis
    қолдануға болады.
*/

const users = new Map();

/*
    userId:
    Сайттағы қолданушының ID-і

    telegramChatId:
    Telegram әкімші чатының ID-і

    pendingQuestion:
    Адам кеңесшісіне жіберілген сұрақ
*/

function createUser(userId) {
    if (!users.has(userId)) {
        users.set(userId, {
            userId,
            telegramChatId: null,
            pendingQuestion: null,
            createdAt: Date.now()
        });
    }

    return users.get(userId);
}

function getUser(userId) {
    return users.get(userId);
}

function setPendingQuestion(userId, question) {
    const user = createUser(userId);

    user.pendingQuestion = question;

    users.set(userId, user);

    return user;
}

function setTelegramChatId(userId, telegramChatId) {
    const user = createUser(userId);

    user.telegramChatId = telegramChatId;

    users.set(userId, user);

    return user;
}

function getAllUsers() {
    return Array.from(users.values());
}

module.exports = {
    createUser,
    getUser,
    setPendingQuestion,
    setTelegramChatId,
    getAllUsers
};

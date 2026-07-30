"use strict";

require("dotenv").config();

const express =
    require("express");

const cors =
    require("cors");

const path =
    require("path");

const {
    askAI
} = require("./src/ai");

const {
    sendHumanQuestion
} = require("./src/telegram");

const {
    createUser,
    getUser
} = require("./src/store");


const app =
    express();


const PORT =
    process.env.PORT || 3000;


/*
    Middleware
*/

app.use(
    cors({
        origin: true
    })
);

app.use(
    express.json({
        limit: "1mb"
    })
);


/*
    Frontend
*/

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


/*
    Health Check
*/

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success: true,

            message:
                "ARUZHAN AI Backend жұмыс істеп тұр",

            time:
                new Date().toISOString()

        });

    }
);


/*
    AI CHAT
*/

app.post(
    "/api/chat",
    async (req, res) => {

        try {

            const {
                userId,
                message,
                history
            } = req.body;


            if (
                !userId ||
                !message
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        error:
                            "userId және message міндетті"

                    });

            }


            const cleanMessage =
                String(message)
                    .trim()
                    .slice(
                        0,
                        5000
                    );


            if (!cleanMessage) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        error:
                            "Хабарлама бос болмауы керек"

                    });

            }


            createUser(
                userId
            );


            const answer =
                await askAI(
                    cleanMessage,
                    Array.isArray(history)
                        ? history
                        : []
                );


            return res.json({

                success: true,

                type:
                    "ai",

                answer

            });


        } catch (error) {

            console.error(
                "CHAT ERROR:",
                error
            );


            return res
                .status(500)
                .json({

                    success: false,

                    error:
                        "AI жауап беру кезінде қате орын алды"

                });

        }

    }
);


/*
    HUMAN SUPPORT
*/

app.post(
    "/api/human-support",
    async (req, res) => {

        try {

            const {
                userId,
                question
            } = req.body;


            if (
                !userId ||
                !question
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        error:
                            "userId және question міндетті"

                    });

            }


            createUser(
                userId
            );


            await sendHumanQuestion({

                userId,

                question:
                    String(question)
                        .trim()
                        .slice(
                            0,
                            5000
                        )

            });


            return res.json({

                success: true,

                type:
                    "human",

                message:
                    "Сұрағыңыз адам кеңесшісіне жіберілді."

            });


        } catch (error) {

            console.error(
                "HUMAN SUPPORT ERROR:",
                error
            );


            return res
                .status(500)
                .json({

                    success: false,

                    error:
                        "Адам кеңесшісіне жіберу кезінде қате орын алды"

                });

        }

    }
);


/*
    USER INFO
*/

app.get(
    "/api/user/:userId",
    (req, res) => {

        const user =
            getUser(
                req.params.userId
            );


        if (!user) {

            return res
                .status(404)
                .json({

                    success: false,

                    error:
                        "Қолданушы табылмады"

                });

        }


        res.json({

            success: true,

            user

        });

    }
);


/*
    SPA fallback
*/

app.get(
    "*",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "index.html"
            )
        );

    }
);


/*
    SERVER START
*/

app.listen(
    PORT,
    () => {

        console.log(
            `
╔══════════════════════════════════════╗
║        ARUZHAN AI BACKEND            ║
╠══════════════════════════════════════╣
║ Server:
║ http://localhost:${PORT}
║
║ Health:
║ http://localhost:${PORT}/api/health
╚══════════════════════════════════════╝
            `
        );

    }
);

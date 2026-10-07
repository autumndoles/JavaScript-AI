const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;

const ROOT = __dirname;
const KNOWLEDGE_FILE = path.join(ROOT, "knowledge.json");


// --------------------------------------------------
// Make sure knowledge.json exists
// --------------------------------------------------

if (!fs.existsSync(KNOWLEDGE_FILE)) {
    fs.writeFileSync(
        KNOWLEDGE_FILE,
        JSON.stringify([], null, 2)
    );
}


// --------------------------------------------------
// Knowledge helpers
// --------------------------------------------------

function loadKnowledge() {
    try {
        const data = fs.readFileSync(
            KNOWLEDGE_FILE,
            "utf8"
        );

        const parsed = JSON.parse(data);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {
        console.error(
            "Could not read knowledge.json:",
            error
        );

        return [];
    }
}


function saveKnowledge(knowledge) {
    fs.writeFileSync(
        KNOWLEDGE_FILE,
        JSON.stringify(knowledge, null, 2)
    );
}


// --------------------------------------------------
// HTTP helpers
// --------------------------------------------------

function sendJSON(res, status, data) {

    const body =
        JSON.stringify(data);

    res.writeHead(
        status,
        {
            "Content-Type":
                "application/json; charset=utf-8",

            "Access-Control-Allow-Origin":
                "*",

            "Access-Control-Allow-Headers":
                "Content-Type",

            "Access-Control-Allow-Methods":
                "GET, POST, OPTIONS"
        }
    );

    res.end(body);
}


function sendFile(res, filePath) {

    fs.readFile(
        filePath,
        (error, data) => {

            if (error) {

                res.writeHead(404);

                res.end("Not found");

                return;
            }


            const extension =
                path.extname(filePath);


            const types = {
                ".html": "text/html",
                ".js": "text/javascript",
                ".css": "text/css",
                ".json": "application/json"
            };


            res.writeHead(
                200,
                {
                    "Content-Type":
                        types[extension] ||
                        "application/octet-stream"
                }
            );


            res.end(data);
        }
    );
}


function readBody(req) {

    return new Promise(
        (resolve, reject) => {

            let body = "";


            req.on(
                "data",
                chunk => {

                    body += chunk;


                    /*
                        Don't allow absurdly
                        large teaching requests.
                    */

                    if (
                        body.length >
                        100 * 1024
                    ) {

                        req.destroy();

                        reject(
                            new Error(
                                "Request body too large."
                            )
                        );
                    }
                }
            );


            req.on(
                "end",
                () => {

                    try {

                        resolve(
                            JSON.parse(body)
                        );

                    } catch {

                        reject(
                            new Error(
                                "Invalid JSON."
                            )
                        );
                    }
                }
            );


            req.on(
                "error",
                reject
            );
        }
    );
}


// --------------------------------------------------
// Normalize text
// --------------------------------------------------

function normalize(text) {

    return String(text)
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}


// --------------------------------------------------
// Server
// --------------------------------------------------

const server =
    http.createServer(
        async (req, res) => {

            /*
                CORS preflight
            */

            if (
                req.method === "OPTIONS"
            ) {

                res.writeHead(
                    204,
                    {
                        "Access-Control-Allow-Origin":
                            "*",

                        "Access-Control-Allow-Headers":
                            "Content-Type",

                        "Access-Control-Allow-Methods":
                            "GET, POST, OPTIONS"
                    }
                );

                res.end();

                return;
            }


            const url =
                new URL(
                    req.url,
                    `http://${req.headers.host}`
                );


            // --------------------------------------------------
            // API: health
            // --------------------------------------------------

            if (
                req.method === "GET" &&
                url.pathname === "/api/health"
            ) {

                sendJSON(
                    res,
                    200,
                    {
                        success: true,
                        name: "JS-AI Server",
                        version: "1.0.0"
                    }
                );

                return;
            }


            // --------------------------------------------------
            // API: get shared knowledge
            // --------------------------------------------------

            if (
                req.method === "GET" &&
                url.pathname === "/api/knowledge"
            ) {

                const knowledge =
                    loadKnowledge();


                sendJSON(
                    res,
                    200,
                    {
                        success: true,
                        knowledge
                    }
                );

                return;
            }


            // --------------------------------------------------
            // API: teach
            // --------------------------------------------------

            if (
                req.method === "POST" &&
                url.pathname === "/api/teach"
            ) {

                try {

                    const body =
                        await readBody(req);


                    const question =
                        String(
                            body.question || ""
                        ).trim();


                    const answer =
                        String(
                            body.answer || ""
                        ).trim();


                    if (
                        !question ||
                        !answer
                    ) {

                        sendJSON(
                            res,
                            400,
                            {
                                success: false,
                                error:
                                    "Question and answer are required."
                            }
                        );

                        return;
                    }


                    if (
                        question.length >
                        500
                    ) {

                        sendJSON(
                            res,
                            400,
                            {
                                success: false,
                                error:
                                    "Question is too long."
                            }
                        );

                        return;
                    }


                    if (
                        answer.length >
                        5000
                    ) {

                        sendJSON(
                            res,
                            400,
                            {
                                success: false,
                                error:
                                    "Answer is too long."
                            }
                        );

                        return;
                    }


                    const knowledge =
                        loadKnowledge();


                    const normalizedQuestion =
                        normalize(question);


                    /*
                        If this question already exists,
                        update it instead of creating
                        infinite duplicates.
                    */

                    const existing =
                        knowledge.find(
                            item =>
                                item.question ===
                                normalizedQuestion
                        );


                    if (existing) {

                        existing.answer =
                            answer;

                        existing.updatedAt =
                            new Date().toISOString();

                    } else {

                        knowledge.push({

                            id:
                                crypto
                                    .randomUUID(),

                            question:
                                normalizedQuestion,

                            answer,

                            createdAt:
                                new Date()
                                    .toISOString(),

                            updatedAt:
                                new Date()
                                    .toISOString()
                        });
                    }


                    saveKnowledge(
                        knowledge
                    );


                    sendJSON(
                        res,
                        200,
                        {
                            success: true,

                            message:
                                existing
                                    ? "Teaching updated."
                                    : "Teaching saved.",

                            question:
                                normalizedQuestion,

                            answer,

                            total:
                                knowledge.length
                        }
                    );


                } catch (error) {

                    console.error(
                        error
                    );


                    sendJSON(
                        res,
                        500,
                        {
                            success: false,
                            error:
                                "Could not save teaching."
                        }
                    );
                }


                return;
            }


            // --------------------------------------------------
            // Static files
            // --------------------------------------------------

            let requested =
                decodeURIComponent(
                    url.pathname
                );


            if (
                requested === "/" ||
                requested === ""
            ) {

                requested =
                    "/index.html";
            }


            /*
                Prevent ../ path traversal.
            */

            const filePath =
                path.resolve(
                    ROOT,
                    "." +
                    requested
                );


            if (
                !filePath.startsWith(
                    ROOT
                )
            ) {

                res.writeHead(403);

                res.end("Forbidden");

                return;
            }


            sendFile(
                res,
                filePath
            );
        }
    );


server.listen(
    PORT,
    () => {

        console.log(
            `JS-AI server running on port ${PORT}`
        );

        console.log(
            `http://localhost:${PORT}`
        );
    }
);

/*
    JAVASCRIPT AI
    --------------
    A completely local rule-based AI.

    No:
        - LLM
        - API
        - server
        - external libraries

    Features:
        - Intent recognition
        - Token matching
        - Memory
        - Learning
        - Math
        - Time/date
        - Knowledge
        - Conversation context
*/


class JavaScriptAI {

    constructor() {

        this.name = "JS-AI";

        this.version = "1.0";

        this.memory = this.loadMemory();

        this.learned = this.loadLearned();

        this.lastIntent = null;

        this.lastUserMessage = "";

        this.knowledge = {

            greetings: {
                patterns: [
                    "hello",
                    "hi",
                    "hey",
                    "hello there",
                    "hey there",
                    "yo",
                    "hiya",
                    "good morning",
                    "good afternoon",
                    "good evening"
                ],

                responses: [
                    "Hello!",
                    "Hey!",
                    "Hi there!",
                    "Hey! How's it going?",
                    "Hello. I'm ready."
                ]
            },


            goodbye: {
                patterns: [
                    "bye",
                    "goodbye",
                    "see you",
                    "see ya",
                    "later",
                    "good night"
                ],

                responses: [
                    "Goodbye!",
                    "See you later!",
                    "Later!",
                    "I'll be here if you need me."
                ]
            },


            thanks: {
                patterns: [
                    "thanks",
                    "thank you",
                    "thx",
                    "thank you so much"
                ],

                responses: [
                    "You're welcome!",
                    "No problem!",
                    "Anytime!",
                    "Glad I could help!"
                ]
            },


            identity: {
                patterns: [
                    "who are you",
                    "what are you",
                    "what is your name",
                    "your name",
                    "tell me about yourself",
                    "are you ai",
                    "are you an ai"
                ],

                responses: [
                    "I'm JS-AI, a browser-based artificial intelligence written entirely in JavaScript.",
                    "I'm a non-LLM AI. I use pattern recognition, scoring, memory, and rules.",
                    "I'm an AI running locally in your browser. No API or language model is involved."
                ]
            },


            capabilities: {
                patterns: [
                    "what can you do",
                    "what do you do",
                    "your abilities",
                    "your capabilities",
                    "what are your features",
                    "can you help me"
                ],

                responses: [
                    "I can chat, remember information, solve math problems, recognize intents, learn new responses, and answer questions from my knowledge base.",
                    "I can recognize patterns, calculate things, remember information, and learn responses."
                ]
            },


            creator: {
                patterns: [
                    "who made you",
                    "who created you",
                    "who built you",
                    "who programmed you"
                ],

                responses: [
                    "I was built with JavaScript.",
                    "My architecture is made from JavaScript code running in your browser."
                ]
            },


            thanks: {
                patterns: [
                    "thanks",
                    "thank you",
                    "thx"
                ],

                responses: [
                    "You're welcome!",
                    "No problem!",
                    "Anytime!"
                ]
            },


            feelings: {
                patterns: [
                    "how are you",
                    "how are you doing",
                    "are you okay",
                    "how do you feel"
                ],

                responses: [
                    "I'm functioning normally!",
                    "All systems are running.",
                    "I'm doing great for a bunch of JavaScript."
                ]
            },


            programming: {
                patterns: [
                    "javascript",
                    "programming",
                    "coding",
                    "code",
                    "program",
                    "html",
                    "css",
                    "website",
                    "computer programming"
                ],

                responses: [
                    "Programming is basically giving a computer extremely precise instructions.",
                    "JavaScript can run both in browsers and on servers.",
                    "HTML controls structure, CSS controls appearance, and JavaScript controls behavior."
                ]
            },


            ai: {
                patterns: [
                    "artificial intelligence",
                    "what is ai",
                    "what is artificial intelligence",
                    "machine learning",
                    "what is machine learning",
                    "neural network"
                ],

                responses: [
                    "Artificial intelligence is a broad field involving computer systems performing tasks that normally require some form of human intelligence.",
                    "Not all AI is an LLM. Rule-based systems, search algorithms, neural networks, and expert systems can all be considered forms of AI."
                ]
            },


            games: {
                patterns: [
                    "games",
                    "video games",
                    "gaming",
                    "game development",
                    "make a game"
                ],

                responses: [
                    "Game development combines programming, design, art, sound, and a suspicious amount of debugging.",
                    "JavaScript is capable of making surprisingly powerful browser games."
                ]
            }

        };


        this.intentKeywords = {

            greeting: [
                "hello",
                "hi",
                "hey",
                "yo"
            ],

            goodbye: [
                "bye",
                "goodbye",
                "later"
            ],

            math: [
                "calculate",
                "plus",
                "minus",
                "times",
                "multiply",
                "divide",
                "percent",
                "square",
                "root"
            ],

            identity: [
                "you",
                "your",
                "yourself"
            ],

            programming: [
                "javascript",
                "programming",
                "coding",
                "code",
                "html",
                "css"
            ],

            ai: [
                "ai",
                "artificial",
                "intelligence",
                "machine",
                "neural",
                "model"
            ]

        };
    }


    /*
        -------------------------
        MEMORY
        -------------------------
    */


    loadMemory() {

        try {

            return JSON.parse(
                localStorage.getItem("js_ai_memory")
            ) || {};

        } catch {

            return {};
        }
    }


    saveMemory() {

        localStorage.setItem(
            "js_ai_memory",
            JSON.stringify(this.memory)
        );
    }


    loadLearned() {

        try {

            return JSON.parse(
                localStorage.getItem("js_ai_learned")
            ) || [];

        } catch {

            return [];
        }
    }


    saveLearned() {

        localStorage.setItem(
            "js_ai_learned",
            JSON.stringify(this.learned)
        );
    }


    remember(key, value) {

        this.memory[key] = value;

        this.saveMemory();
    }


    recall(key) {

        return this.memory[key] ?? null;
    }


    /*
        -------------------------
        TEXT PROCESSING
        -------------------------
    */


    normalize(text) {

        return text
            .toLowerCase()
            .replace(/[^\w\s.%+\-*/()]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }


    tokenize(text) {

        return this.normalize(text)
            .split(" ")
            .filter(Boolean);
    }


    /*
        -------------------------
        SIMILARITY ENGINE
        -------------------------
    */


    similarity(input, pattern) {

        const inputWords = this.tokenize(input);

        const patternWords = this.tokenize(pattern);

        if (!inputWords.length || !patternWords.length) {
            return 0;
        }


        let matches = 0;


        for (const word of inputWords) {

            if (patternWords.includes(word)) {
                matches++;
            }
        }


        const wordScore =
            matches /
            Math.max(inputWords.length, patternWords.length);


        /*
            Bonus for exact phrase.
        */

        const normalizedInput = this.normalize(input);

        const normalizedPattern = this.normalize(pattern);


        if (normalizedInput === normalizedPattern) {
            return 1;
        }


        if (
            normalizedInput.includes(normalizedPattern) ||
            normalizedPattern.includes(normalizedInput)
        ) {

            return Math.min(
                0.95,
                wordScore + 0.35
            );
        }


        return wordScore;
    }


    /*
        -------------------------
        INTENT DETECTION
        -------------------------
    */


    detectIntent(input) {

        let bestIntent = null;

        let bestScore = 0;


        for (
            const [intent, keywords]
            of Object.entries(this.intentKeywords)
        ) {

            let score = 0;


            for (const keyword of keywords) {

                if (
                    this.normalize(input)
                        .includes(keyword)
                ) {

                    score++;
                }
            }


            score =
                score /
                Math.max(keywords.length, 1);


            if (score > bestScore) {

                bestScore = score;

                bestIntent = intent;
            }
        }


        return {
            intent: bestIntent,
            score: bestScore
        };
    }


    /*
        -------------------------
        KNOWLEDGE SEARCH
        -------------------------
    */


    searchKnowledge(input) {

        let best = null;

        let bestScore = 0;


        for (
            const [intent, data]
            of Object.entries(this.knowledge)
        ) {

            for (const pattern of data.patterns) {

                const score =
                    this.similarity(input, pattern);


                if (score > bestScore) {

                    bestScore = score;

                    best = {
                        intent,
                        data,
                        score
                    };
                }
            }
        }


        return best;
    }


    /*
        -------------------------
        LEARNING
        -------------------------
    */


    teach(question, answer) {

        question = this.normalize(question);

        answer = answer.trim();


        if (!question || !answer) {
            return false;
        }


        this.learned.push({
            question,
            answer
        });


        this.saveLearned();

        return true;
    }


    searchLearned(input) {

        let best = null;

        let bestScore = 0;


        for (const item of this.learned) {

            const score =
                this.similarity(
                    input,
                    item.question
                );


            if (score > bestScore) {

                bestScore = score;

                best = {
                    ...item,
                    score
                };
            }
        }


        return best;
    }


    /*
        -------------------------
        MEMORY COMMANDS
        -------------------------
    */


    processMemory(input) {

        const normalized =
            this.normalize(input);


        /*
            "remember my name is Austin"
        */

        const nameMatch =
            normalized.match(
                /(?:my name is|call me) (.+)/
            );


        if (nameMatch) {

            const name =
                nameMatch[1].trim();


            this.remember(
                "name",
                name
            );


            return `I'll remember that your name is ${name}.`;
        }


        /*
            "remember that I like games"
        */

        const rememberMatch =
            normalized.match(
                /remember (?:that )?i (.+)/
            );


        if (rememberMatch) {

            const fact =
                rememberMatch[1].trim();


            const key =
                "fact_" +
                Date.now();


            this.remember(
                key,
                fact
            );


            return "I'll remember that.";
        }


        /*
            "what is my name?"
        */

        if (
            normalized.includes("what is my name") ||
            normalized.includes("whats my name")
        ) {

            const name =
                this.recall("name");


            if (name) {

                return `Your name is ${name}.`;
            }


            return "I don't know your name yet.";
        }


        return null;
    }


    /*
        -------------------------
        MATH ENGINE
        -------------------------
    */


    solveMath(input) {

        let expression =
            input
                .toLowerCase()
                .replace(/what is/g, "")
                .replace(/calculate/g, "")
                .replace(/equals/g, "")
                .replace(/=/g, "")
                .replace(/plus/g, "+")
                .replace(/minus/g, "-")
                .replace(/times/g, "*")
                .replace(/multiplied by/g, "*")
                .replace(/divided by/g, "/")
                .replace(/÷/g, "/")
                .replace(/×/g, "*")
                .trim();


        /*
            Only permit mathematical characters.
            This prevents arbitrary JavaScript execution.
        */

        if (
            !/^[0-9+\-*/().%\s]+$/.test(expression)
        ) {

            return null;
        }


        if (!/[0-9]/.test(expression)) {
            return null;
        }


        try {

            /*
                Handle percentage.

                Example:
                50% -> 0.5
            */

            expression =
                expression.replace(
                    /(\d+(?:\.\d+)?)%/g,
                    "($1/100)"
                );


            /*
                Evaluate only after
                strict validation.
            */

            const result =
                Function(
                    `"use strict"; return (${expression})`
                )();


            if (
                typeof result !== "number" ||
                !Number.isFinite(result)
            ) {

                return null;
            }


            return result;

        } catch {

            return null;
        }
    }


    /*
        -------------------------
        DATE / TIME
        -------------------------
    */


    getDateTime(input) {

        const lower =
            input.toLowerCase();


        if (
            lower.includes("what time") ||
            lower.includes("current time") ||
            lower === "time"
        ) {

            return `The current time is ${new Date().toLocaleTimeString()}.`;
        }


        if (
            lower.includes("what date") ||
            lower.includes("todays date") ||
            lower.includes("today")
        ) {

            return `Today is ${new Date().toLocaleDateString()}.`;
        }


        return null;
    }


    /*
        -------------------------
        HELP
        -------------------------
    */


    help() {

        return `
Here's what I can do:

• Chat with you
• Recognize intents
• Remember information
• Learn new responses
• Solve math
• Tell you the date/time
• Answer built-in knowledge
• Store memory in your browser

Examples:

"Hello"

"What can you do?"

"What is JavaScript?"

"What is 25 times 4?"

"What time is it?"

"Remember my name is Alex"

"What is my name?"

Teach me:

teach: what is your favorite color = I don't have a favorite color.

The AI's memory is stored locally in your browser.
        `.trim();
    }


    /*
        -------------------------
        RESPONSE ENGINE
        -------------------------
    */


    respond(input) {

        if (!input || !input.trim()) {
            return "Say something and I'll try to understand it!";
        }


        this.lastUserMessage = input;


        /*
            Help command
        */

        if (
            this.normalize(input) === "help" ||
            this.normalize(input) === "commands"
        ) {

            return this.help();
        }


        /*
            Learning command
        */

        if (
            this.normalize(input).startsWith("teach:")
        ) {

            const teaching =
                input.substring(
                    input.indexOf(":") + 1
                );


            const parts =
                teaching.split("=");


            if (parts.length < 2) {

                return "Teaching format: teach: question = answer";
            }


            const question =
                parts.shift().trim();


            const answer =
                parts.join("=").trim();


            this.teach(
                question,
                answer
            );


            return `Learned a new response for "${question}".`;
        }


        /*
            Forget everything
        */

        if (
            this.normalize(input) ===
            "forget everything"
        ) {

            this.memory = {};

            this.learned = [];

            localStorage.removeItem(
                "js_ai_memory"
            );

            localStorage.removeItem(
                "js_ai_learned"
            );

            return "I've cleared my local memory and learned responses.";
        }


        /*
            Memory
        */

        const memoryResponse =
            this.processMemory(input);


        if (memoryResponse) {

            this.lastIntent = "memory";

            return memoryResponse;
        }


        /*
            Date/time
        */

        const dateResponse =
            this.getDateTime(input);


        if (dateResponse) {

            this.lastIntent = "time";

            return dateResponse;
        }


        /*
            Math
        */

        const mathResult =
            this.solveMath(input);


        if (mathResult !== null) {

            this.lastIntent = "math";

            return `The answer is ${mathResult}.`;
        }


        /*
            Learned responses
        */

        const learned =
            this.searchLearned(input);


        if (
            learned &&
            learned.score >= 0.55
        ) {

            this.lastIntent = "learned";

            return learned.answer;
        }


        /*
            Built-in knowledge
        */

        const knowledge =
            this.searchKnowledge(input);


        if (
            knowledge &&
            knowledge.score >= 0.35
        ) {

            this.lastIntent =
                knowledge.intent;


            const responses =
                knowledge.data.responses;


            return responses[
                Math.floor(
                    Math.random() *
                    responses.length
                )
            ];
        }


        /*
            Intent fallback
        */

        const intent =
            this.detectIntent(input);


        if (
            intent.intent === "math"
        ) {

            return "I detected a math-related question, but I couldn't understand the calculation.";
        }


        if (
            intent.intent === "programming"
        ) {

            return "That sounds like a programming question. Try asking me something specific about JavaScript, HTML, CSS, or programming.";
        }


        if (
            intent.intent === "ai"
        ) {

            return "I know some things about AI. Try asking me what artificial intelligence is.";
        }


        /*
            Generic fallback
        */

        const fallbacks = [

            "I'm not sure I understand that yet.",

            "I don't know how to answer that yet.",

            "That's outside my current knowledge base.",

            "I haven't learned how to respond to that yet.",

            "Interesting. I don't have an answer for that yet."

        ];


        return fallbacks[
            Math.floor(
                Math.random() *
                fallbacks.length
            )
        ];
    }
}


/*
    ========================================
    CHAT INTERFACE
    ========================================
*/


const ai = new JavaScriptAI();


const chat =
    document.getElementById("chat");


const input =
    document.getElementById("input");


const sendButton =
    document.getElementById("send");


function addMessage(
    text,
    type
) {

    const message =
        document.createElement("div");


    message.className =
        `message ${type}`;


    message.textContent =
        text;


    chat.appendChild(
        message
    );


    chat.scrollTop =
        chat.scrollHeight;
}


function sendMessage() {

    const text =
        input.value.trim();


    if (!text) {
        return;
    }


    addMessage(
        text,
        "user"
    );


    input.value = "";


    /*
        Small delay makes the AI
        feel like it is processing.
    */

    const typing =
        document.createElement("div");


    typing.className =
        "message ai typing";


    typing.textContent =
        "Thinking...";


    chat.appendChild(
        typing
    );


    chat.scrollTop =
        chat.scrollHeight;


    setTimeout(() => {

        typing.remove();


        const response =
            ai.respond(text);


        addMessage(
            response,
            "ai"
        );

    }, 250);
}


/*
    Button
*/

sendButton.addEventListener(
    "click",
    sendMessage
);


/*
    Enter key
*/

input.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            sendMessage();
        }
    }
);


/*
    Startup message
*/

addMessage(
    "JS-AI online. I'm a JavaScript AI running locally in your browser. Type \"help\" to see what I can do.",
    "ai"
);


/*
    Console information
*/

console.log(
    `%c${ai.name} v${ai.version}`,
    "font-size: 20px; font-weight: bold;"
);

console.log(
    "No LLM. No API. Just JavaScript."
);

console.log(
    "AI object:",
    ai
);

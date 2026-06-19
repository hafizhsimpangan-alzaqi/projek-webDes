const { createServer } = require("node:http");
const { URL } = require("node:url");
const fs = require("node:fs");
const path = require("node:path");

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
    });

    res.end(JSON.stringify(data));
}

function renderHtml(res, fileName) {
    const filePath = path.join(__dirname, "../html", fileName);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            sendJson(res, 404, {
                success: false,
                message: "Halaman tidak ditemukan",
            });
            return;
        }

        res.writeHead(200, {
            "Content-Type": "text/html",
        });

        res.end(data);
    });
}

const server = createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // HTML ROUTES
    if (req.method === "GET" && url.pathname === "/") {
        renderHtml(res, "home.html");
        return;
    }

    if (req.method === "GET" && url.pathname === "/about") {
        renderHtml(res, "about.html");
        return;
    }

    if (req.method === "GET" && url.pathname === "/contact") {
        renderHtml(res, "contact.html");
        return;
    }

    if (req.method === "GET" && url.pathname === "/course") {
        renderHtml(res, "courses.html");
        return;
    }

    if (req.method === "GET" && url.pathname === "/dashboard") {
        renderHtml(res, "dashboard.html");
        return;
    }

    if (req.method === "GET" && url.pathname === "/login") {
        renderHtml(res, "login.html");
        return;
    }

    // CSS
    if (req.method === "GET" && url.pathname.startsWith("/css/")) {
        const filePath = path.join(__dirname, "..", url.pathname);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.end("CSS Not Found");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/css",
            });

            res.end(data);
        });

        return;
    }

    // JS
    if (req.method === "GET" && url.pathname.startsWith("/js/")) {
        const filePath = path.join(__dirname, "..", url.pathname);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.end("JS Not Found");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "application/javascript",
            });

            res.end(data);
        });

        return;
    }

    // Assets
    if (req.method === "GET" && url.pathname.startsWith("/assets/")) {
        const filePath = path.join(__dirname, "..", url.pathname);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.end("Asset Not Found");
                return;
            }

            const ext = path.extname(filePath);

            let contentType = "application/octet-stream";

            if (ext === ".svg") {
                contentType = "image/svg+xml";
            }

            if (ext === ".png") {
                contentType = "image/png";
            }

            if (ext === ".jpg" || ext === ".jpeg") {
                contentType = "image/jpeg";
            }

            if (ext === ".webp") {
                contentType = "image/webp";
            }

            res.writeHead(200, {
                "Content-Type": contentType,
            });

            res.end(data);
        });

        return;
    }

    sendJson(res, 404, {
        success: false,
        message: "Halaman tidak ditemukan",
    });
});

server.listen(8080, "127.0.0.1", () => {
    console.log("Server berjalan di http://127.0.0.1:8080");
});

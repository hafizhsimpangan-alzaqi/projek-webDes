// backend/routes/auth.js

const conn = require("../config/db");
const crypto = require("node:crypto");

const {
    sendJson
} = require("../helpers/response");

const {
    sanitizeUser
} = require("../helpers/sanitizer");

const {
    getCookie
} = require("../helpers/auth");
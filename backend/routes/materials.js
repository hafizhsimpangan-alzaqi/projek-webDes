// backend/routers/materials.js

const conn = require("../config/db");

const {
    sendJson
} = require("../helpers/response");

const {
    sanitizeMaterial
} = require("../helpers/sanitizer");

const {
    getUserSession,
    requireTeacher
} = require("../helpers/auth");
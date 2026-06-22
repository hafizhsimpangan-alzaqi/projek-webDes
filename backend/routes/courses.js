// backend/routes/courses.js

const conn = require("../config/db");

const {
    sendJson
} = require("../helpers/response");

const {
    sanitizeCourse
} = require("../helpers/sanitizer");

const {
    getUserSession,
    requireTeacher
} = require("../helpers/auth");
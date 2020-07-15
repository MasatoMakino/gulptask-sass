"use strict";
const sass = require("./bin").get(["./sample/**/style.sass", "./sample/**/not_exist_file.sass"], "./dist");
exports.sass = sass;
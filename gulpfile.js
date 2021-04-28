"use strict";
const sass = require("./bin").generateTask({
  base: "./sample",
  entryPoints: ["./sample/**/style.sass", "./sample/**/not_exist_file.sass"],
  distDir: "./dist",
});
exports.sass = sass;

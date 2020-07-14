"use strict";
const { src, dest } = require("gulp");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const packageImporter = require("node-sass-package-importer");
const autoprefixer = require("gulp-autoprefixer");
const path = require("path");
/**
 * sassファイルをcssに変換、出力するgulpタスク。
 * @param {string | string[]}entryPoints 変換対象のsass e.g. ["./src/sass/style.sass"]
 * @param {string} destDir 出力ディレクトリ e.g. "./dist"
 * @return {function(): *}
 */
module.exports = (entryPoints, destDir) => {
    destDir = path.resolve(process.cwd(), destDir);
    const sassTask = () => {
        return src(entryPoints)
            .pipe(plumber())
            .pipe(sass({
            outputStyle: "compressed",
            importer: packageImporter(),
        }))
            .pipe(autoprefixer())
            .pipe(dest(destDir));
    };
    return sassTask;
};

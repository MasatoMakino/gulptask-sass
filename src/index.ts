"use strict";
const { src, dest } = require("gulp");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const packageImporter = require("node-sass-package-importer");
const autoprefixer = require("gulp-autoprefixer");
const path = require("path");

/**
 * sassファイルをcssに変換、出力するgulpタスク。
 * @param entryPoints 変換対象のsass e.g. ["./src/sass/style.sass"]
 * @param destDir 出力ディレクトリ e.g. "./dist"
 */
export function get(entryPoints: string | string[], destDir: string): Function {
  destDir = path.resolve(process.cwd(), destDir);

  return () => {
    return src(entryPoints)
      .pipe(plumber())
      .pipe(
        sass({
          outputStyle: "compressed",
          importer: packageImporter(),
        })
      )
      .pipe(autoprefixer())
      .pipe(dest(destDir));
  };
}

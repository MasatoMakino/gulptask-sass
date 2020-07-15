"use strict";
const { src, dest } = require("gulp");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const packageImporter = require("node-sass-package-importer");
const autoprefixer = require("gulp-autoprefixer");
const path = require("path");
const globby = require("globby");

/**
 * sassファイルをcssに変換、出力するgulpタスク。
 * @param entryPoints 変換対象のsass e.g. ["./src/sass/style.sass"]
 * @param destDir 出力ディレクトリ e.g. "./dist"
 */
export function get(entryPoints: string | string[], destDir: string): Function {
  destDir = path.resolve(process.cwd(), destDir);

  return () => {
    existsTarget(entryPoints);

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

const existsTarget = (entryPoints: string | string[]) => {
  const targets = globby.sync(entryPoints);
  if (targets == null || targets.length === 0) {
    console.error(
      "\x1b[31m%s\x1b[0m",
`gulptask-sass : Error no target files.
    The file specified by ${entryPoints} does not exist. The SASS conversion task exits without outputting anything.
    ${entryPoints}で指定されたファイルが存在しません。SASS変換タスクは何も出力せずに終了します。`
    );
  }
};

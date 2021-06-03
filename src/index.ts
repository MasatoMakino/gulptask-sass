"use strict";
const path = require("path");
const globby = require("globby");
import * as fs from "fs";
import * as dartSass from "sass";
import * as makeDir from "make-dir";

/**
 * @param base ソースファイルの入力基準パス e.g, "./src"
 * @param entryPoints 変換対象のsass e.g. ["./src/sass/style.sass"]
 * @param destDir 出力ディレクトリ e.g. "./dist"
 * @param includePaths 絶対パスを指定した場合の、パス解決の起点 e.g. ["./node_modules"]
 */
export interface InitOption {
  base: string;
  entryPoints: string | string[];
  distDir: string;
  includePaths?: string[];
}
/**
 * sassファイルをcssに変換、出力するgulpタスク。
 */
export function generateTask(option: InitOption): Function {
  option.distDir = path.resolve(process.cwd(), option.distDir);
  option.includePaths ??= [path.resolve(process.cwd(), "node_modules")];

  return async () => {
    existsTarget(option.entryPoints);

    const targets = globby.sync(option.entryPoints);
    targets.forEach((target: string) => {
      const outPath = resolveOutFilePath(option.distDir, option.base, target);
      const result = dartSass.renderSync({
        file: target,
        outFile: outPath,
        outputStyle: "compressed",
        includePaths: option.includePaths,
      });
      makeDir.sync(path.parse(outPath).dir);
      fs.writeFileSync(outPath, result.css);
    });
  };
}

/**
 * 出力ファイルパスを取得する
 * @param distDir
 * @param base
 * @param targetPath
 */
const resolveOutFilePath = (
  distDir: string,
  base: string,
  targetPath: string
): string => {
  existBaseDir(base);
  const outPath = path.resolve(distDir, path.relative(base, targetPath));
  const pathObj = path.parse(outPath);
  pathObj.ext = ".css";
  delete pathObj.base;
  return path.format(pathObj);
};

/**
 * ソースファイルの存在を確認する
 * @param entryPoints
 */
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

/**
 * baseパラメーターの存在を確認する
 * @param base
 */
const existBaseDir = (base: string) => {
  if (base == null || base === "") {
    console.error(
      `gulptask-sass : 
  baseパラメーターを指定してください。
  たとえば {
    base:"./src/sass",
    entryPoint : "./src/sass/style.scss",
    distDir : "./dist"
  } が指定された場合、"./dist/style.scss"が出力されます。
`
    );
  }
};

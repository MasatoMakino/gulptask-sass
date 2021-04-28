"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTask = void 0;
const path = require("path");
const globby = require("globby");
const fs = __importStar(require("fs"));
const dartSass = __importStar(require("sass"));
const makeDir = __importStar(require("make-dir"));
/**
 * sassファイルをcssに変換、出力するgulpタスク。
 */
function generateTask(option) {
    option.distDir = path.resolve(process.cwd(), option.distDir);
    return () => __awaiter(this, void 0, void 0, function* () {
        existsTarget(option.entryPoints);
        const targets = globby.sync(option.entryPoints);
        targets.forEach((target) => {
            const outPath = resolveOutFilePath(option.distDir, option.base, target);
            const result = dartSass.renderSync({
                file: target,
                outFile: outPath,
                outputStyle: "compressed",
            });
            makeDir.sync(path.parse(outPath).dir);
            fs.writeFileSync(outPath, result.css);
        });
    });
}
exports.generateTask = generateTask;
/**
 * 出力ファイルパスを取得する
 * @param distDir
 * @param base
 * @param targetPath
 */
const resolveOutFilePath = (distDir, base, targetPath) => {
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
const existsTarget = (entryPoints) => {
    const targets = globby.sync(entryPoints);
    if (targets == null || targets.length === 0) {
        console.error("\x1b[31m%s\x1b[0m", `gulptask-sass : Error no target files.
    The file specified by ${entryPoints} does not exist. The SASS conversion task exits without outputting anything.
    ${entryPoints}で指定されたファイルが存在しません。SASS変換タスクは何も出力せずに終了します。`);
    }
};
/**
 * baseパラメーターの存在を確認する
 * @param base
 */
const existBaseDir = (base) => {
    if (base == null || base === "") {
        console.error(`gulptask-sass : 
  baseパラメーターを指定してください。
  たとえば {
    base:"./src/sass",
    entryPoint : "./src/sass/style.scss",
    distDir : "./dist"
  } が指定された場合、"./dist/style.scss"が出力されます。
`);
    }
};

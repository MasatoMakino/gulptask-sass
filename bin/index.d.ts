/**
 * @param base ソースファイルの入力基準パス e.g, "./src"
 * @param entryPoints 変換対象のsass e.g. ["./src/sass/style.sass"]
 * @param destDir 出力ディレクトリ e.g. "./dist"
 */
export interface InitOption {
    base: string;
    entryPoints: string | string[];
    distDir: string;
}
/**
 * sassファイルをcssに変換、出力するgulpタスク。
 */
export declare function generateTask(option: InitOption): Function;
//# sourceMappingURL=index.d.ts.map
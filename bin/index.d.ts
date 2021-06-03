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
export declare function generateTask(option: InitOption): Function;
//# sourceMappingURL=index.d.ts.map
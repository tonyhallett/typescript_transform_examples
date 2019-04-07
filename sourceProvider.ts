import { readFileSync } from "fs"
import * as path from "path"
import * as ts from "typescript"

const sourcePath=path.join(__dirname,"source.ts");
export const sourceText=readFileSync(sourcePath).toString();

export function getSourceFileWithExports(){
    return ts.createSourceFile(sourcePath,sourceText,ts.ScriptTarget.ES3,true);
}
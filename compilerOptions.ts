import * as ts from "typescript"
export const compilerOptions:ts.CompilerOptions={
    module:ts.ModuleKind.None,
    target:ts.ScriptTarget.ES3,
    strict:true,
    removeComments:true
}
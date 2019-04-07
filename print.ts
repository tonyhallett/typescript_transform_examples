import * as ts from "typescript"
export function printWithoutComments(sourceFile:ts.SourceFile){
    const printer=ts.createPrinter({
        removeComments:true
    });
    return printer.printFile(sourceFile)
}
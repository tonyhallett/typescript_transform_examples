import * as ts from "typescript"

export function printBundleDoesCallbackForSourceFiles(){
    /**
    * Prints a bundle of source files as-is, without any emit transformations.
    */

    const bundle=ts.createBundle([ts.createSourceFile("","const c=5",ts.ScriptTarget.ES3)]);
    const printer=ts.createPrinter({},{
        onEmitNode:(hint,node)=>{
            if(node){
                switch(node.kind){
                    case ts.SyntaxKind.Bundle:
                        console.log("bundle");//this is not called
                        break;
                    case ts.SyntaxKind.SourceFile:
                        console.log("source file ");//this is 
                    default:
                        console.log(node.kind);
                }
            }
        }
    });
    printer.printBundle(bundle);
}
export function vistorDoesNotWorkWithBundle(){
    const bundle=ts.createBundle(
        [ts.createSourceFile("","const c=5",ts.ScriptTarget.ES3)]
    );
    let visitedNodeInBundle=false;
    /*
        default:
                // No need to visit nodes with no children.
                return node;
    */
    const updated=ts.visitEachChild(bundle,(n)=>{
        visitedNodeInBundle=true;
        return n;
    },null as any);//TransformationContext will not be used internally for this example
    console.log("Visited node in bundle: " + visitedNodeInBundle);
    
}
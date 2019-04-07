import * as ts from "typescript"
import {removeFunctionModifiers} from './astHelpers'
import {getSourceFileWithExports} from './sourceProvider'

export function transformWithPrinterSubstitution(){
    const printer=ts.createPrinter({removeComments:true},{
        substituteNode(hint:ts.EmitHint,node:ts.Node){
            if(ts.isFunctionDeclaration(node)){
                return removeFunctionModifiers(node);
                
            }
            return node;
        }
    })
    
    return printer.printFile(getSourceFileWithExports());
}
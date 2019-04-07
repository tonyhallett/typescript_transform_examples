import * as ts from "typescript"
import {SourceFileTransformerFactory} from './types'
export function removeFunctionModifiers(fd:ts.FunctionDeclaration):ts.FunctionDeclaration{
    return ts.updateFunctionDeclaration(fd,fd.decorators,[],fd.asteriskToken,
        fd.name,fd.typeParameters,fd.parameters,fd.type,fd.body);
}
//note that these filter as well
export function removeFunctionExportModifiersFromSourceFile(sourceFile:ts.SourceFile){
    //first callback will not get called
    return sourceFile.forEachChild<ts.SourceFile>(node=>undefined,(nodes)=>{
        const functionsWithExport=nodes.filter(n=>ts.isFunctionDeclaration(n)).map(n=>{
            return removeFunctionModifiers(n as ts.FunctionDeclaration);
        });
        return ts.updateSourceFileNode(sourceFile,functionsWithExport)
    }) as ts.SourceFile;
}
//alternative method
function removeFunctionExportModifiersFromSourceFile2(sourceFile:ts.SourceFile){
    var functionsWithoutExport=sourceFile.statements.reduce((fns,s)=>{
        if(ts.isFunctionDeclaration(s)){
            fns.push(removeFunctionModifiers(s));
        }
        return fns;
    },[] as Array<ts.FunctionDeclaration>);
    return ts.updateSourceFileNode(sourceFile,functionsWithoutExport);
}

export function getTransformerFactory(sourceFileCallback:(node:ts.SourceFile)=>void=(n)=>{}){
    const myTransformerFactory:SourceFileTransformerFactory=(context: ts.TransformationContext)=>{
        return (node:ts.SourceFile)=>{
            sourceFileCallback(node);
            const visitor:ts.Visitor=(node:ts.Node)=>{
                if(ts.isFunctionDeclaration(node)){
                    return ts.visitEachChild(node,visitor,context);
                }
                if(ts.isModifier(node)){
                    return undefined;
                }
                return node;
            };

            return ts.visitEachChild(node,visitor,context);
        }
    }
    return myTransformerFactory;
}
export const removeFunctionExportTransformerFactory=getTransformerFactory();
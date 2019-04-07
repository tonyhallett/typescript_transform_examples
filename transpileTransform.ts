import * as ts from "typescript"
import {compilerOptions} from './compilerOptions'
import {sourceText} from './sourceProvider'
import {getTransformerFactory,removeFunctionExportTransformerFactory} from './astHelpers'

const tsAny=ts as any;
export function getTransformersWithoutModule(compilerOptions: ts.CompilerOptions, customTransformers?: ts.CustomTransformers) {
    
    const jsx = compilerOptions.jsx;
    const languageVersion = (ts as any).getEmitScriptTarget(compilerOptions);
    //const moduleKind = (ts as any).getEmitModuleKind(compilerOptions);
    const transformers: ts.TransformerFactory<ts.SourceFile | ts.Bundle>[] = [];

    tsAny.addRange(transformers, customTransformers && customTransformers.before);

    transformers.push(tsAny.transformTypeScript);

    if (jsx === ts.JsxEmit.React) {
        transformers.push(tsAny.transformJsx);
    }

    if (languageVersion < ts.ScriptTarget.ESNext) {
        transformers.push(tsAny.transformESNext);
    }

    if (languageVersion < ts.ScriptTarget.ES2017) {
        transformers.push(tsAny.transformES2017);
    }

    if (languageVersion < ts.ScriptTarget.ES2016) {
        transformers.push(tsAny.transformES2016);
    }

    if (languageVersion < ts.ScriptTarget.ES2015) {
        transformers.push(tsAny.transformES2015);
        transformers.push(tsAny.transformGenerators);
    }

    //transformers.push(getModuleTransformer(moduleKind));

    // The ES5 transformer is last so that it can substitute expressions like `exports.default`
    // for ES3.
    if (languageVersion < ts.ScriptTarget.ES5) {
        transformers.push(tsAny.transformES5);
    }

    tsAny.addRange(transformers, customTransformers && customTransformers.after);

    return transformers;
}
function transpileWithoutModuleBuiltInTransformer(){
    const transformersOriginal=tsAny.getTransformers;
    tsAny.getTransformers=getTransformersWithoutModule;
    const output= ts.transpileModule(sourceText,{
        compilerOptions:compilerOptions,
        transformers:{
            before:[
                removeFunctionExportTransformerFactory
            ]
        }
    }).outputText;
    tsAny.getTransformers=transformersOriginal;
    return output;
}
function transpileRemovingExternalModuleIndicator(){

    return ts.transpileModule(sourceText,{
        compilerOptions:compilerOptions,
        transformers:{
            before:[
                getTransformerFactory((sf)=>{
                    (sf as any).externalModuleIndicator=undefined;
                })
            ]
        }
    }).outputText;
}
function transpileRemoving__esModule(){
    type SourceFileTransformerFactory= (context: ts.TransformationContext) => ts.Transformer<ts.SourceFile>;
    
    const remove__esModuleFactory:SourceFileTransformerFactory=(context: ts.TransformationContext)=>{
        
        const previousOnSubstituteNode=context.onSubstituteNode;
        context.enableSubstitution(ts.SyntaxKind.ExpressionStatement);
        context.onSubstituteNode=((hint,node)=>{
            node=previousOnSubstituteNode(hint,node);
            
            if(ts.isExpressionStatement(node)&&ts.isBinaryExpression(node.expression)&&ts.isPropertyAccessExpression(node.expression.left)){
                let pe:ts.PropertyAccessExpression=node.expression.left;
                if(pe.name.text==="__esModule"){
                    return ts.createEmptyStatement();
                }
            }
            return node;
        });
        return node=>node;
            
    }
    return ts.transpileModule(sourceText,{
        compilerOptions:compilerOptions,
        transformers:{
            before:[
                removeFunctionExportTransformerFactory,
            ],
            after:[remove__esModuleFactory]
        }
    }).outputText;
}
function transformWithTranspile(){
    /*
    this way get exports.__esModule = true; 
    
    */
    return ts.transpileModule(sourceText,{
        compilerOptions:compilerOptions,
        transformers:{
            before:[
                removeFunctionExportTransformerFactory
            ]
        }
    }).outputText;
    
}

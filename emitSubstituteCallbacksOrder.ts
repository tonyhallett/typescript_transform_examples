import * as ts from "typescript"
import {SourceFileTransformerFactory} from './types'

export function demoEmitSubstituteCallbacksOrder(){
    const source=`
        const someVar=5;
    `
    
    function createDemoFactory(factoryName:string):SourceFileTransformerFactory{
        return (context)=>{
            context.enableEmitNotification(ts.SyntaxKind.ConstKeyword);
            context.enableSubstitution(ts.SyntaxKind.ConstKeyword);
            const previousOnEmitNode=context.onEmitNode;
            const previousOnSubstituteNode=context.onSubstituteNode;
            context.onEmitNode=(hint,node,callback)=>{
                console.log(`${factoryName} onEmitNode`);
                previousOnEmitNode(hint,node,callback);
            }
            context.onSubstituteNode=(hint,node)=>{
                console.log(`${factoryName} onSubstituteNode`);
                node=previousOnSubstituteNode(hint,node);
                return node;
            }
            return (sourceFile)=>sourceFile;
        }
    }
    const factory1=createDemoFactory("factory1");
    const factory2=createDemoFactory("factory2");
    ts.transpileModule(source,{
        transformers:{
            before:[factory1,factory2]
        }
    })
}
import * as ts from "typescript"
export type SourceFileTransformerFactory= (context: ts.TransformationContext) => ts.Transformer<ts.SourceFile>;
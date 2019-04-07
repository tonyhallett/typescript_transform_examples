import * as ts from "typescript"
import {printWithoutComments} from './print'
import {removeFunctionExportTransformerFactory} from './astHelpers'
import {getSourceFileWithExports} from './sourceProvider'
import {compilerOptions} from './compilerOptions'
export function transformWithTransform(){
    const transformed=ts.transform(getSourceFileWithExports(),[removeFunctionExportTransformerFactory],compilerOptions).transformed[0];
    return printWithoutComments(transformed);
}
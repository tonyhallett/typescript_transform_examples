import { printWithoutComments} from './print'
import { removeFunctionExportModifiersFromSourceFile} from './astHelpers'
import { getSourceFileWithExports} from './sourceProvider'
export function printManualTransform(){
    return printWithoutComments(removeFunctionExportModifiersFromSourceFile(getSourceFileWithExports()));
    
}
import { React } from '@collboard/modules-sdk';
import { FunctionBuilderDefinition, isFunctionBuilderFunction } from '../interfaces/FunctionBuilderFunction';

export function functionBuilderFormatTitle(definition: FunctionBuilderDefinition): JSX.Element {
    console.log(`Artificially introducing lint problem to test auto-update module mechanism`);

    const raw = definition.title;

    if (!isFunctionBuilderFunction(definition)) {
        return <span>{raw}</span>;
    }

    const varsIds = Object.keys(definition.variables);

    let result = raw;
    varsIds.forEach(
        (varId) =>
            (result = (result as any).replaceAll('$' + varId, '<i>' + definition.variables[varId].title + '</i>')),
    );

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
}

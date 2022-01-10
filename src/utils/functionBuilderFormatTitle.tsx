import * as React from 'react';
import { FunctionBuilderDefinition, isFunctionBuilderFunction } from '../interfaces/FunctionBuilderFunction';

export function functionBuilderFormatTitle(definition: FunctionBuilderDefinition): JSX.Element {
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

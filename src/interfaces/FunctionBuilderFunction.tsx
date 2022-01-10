import { FunctionBuilderVariable } from './FunctionBuilderVariable';

export type FunctionBuilderDefinition = FunctionBuilderFunction | FunctionBuilderConstant;

export interface FunctionBuilderFunction {
    title: string;
    variables: { [key: string]: FunctionBuilderVariable };
    func: (x: number, variables: { [key: string]: number }) => number;
}

export interface FunctionBuilderConstant {
    title: string;
    constant: number;
}

export function isFunctionBuilderFunction(
    functionDefinition: FunctionBuilderDefinition,
): functionDefinition is FunctionBuilderFunction {
    if (
        (functionDefinition as FunctionBuilderFunction).func &&
        (functionDefinition as FunctionBuilderFunction).variables
    ) {
        return true;
    } else {
        return false;
    }
}

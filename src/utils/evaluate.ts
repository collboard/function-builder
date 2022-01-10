/* tslint:disable */
/* TODO: Enable TSLint */
import { ISystems, AbstractArt } from '@collboard/modules-sdk';
import { isFunctionBuilderFunction } from '../interfaces/FunctionBuilderFunction';
import { FunctionBuilderArt } from '../modules/FunctionBuilderArtModule';

// TODO: Probbably some better name like compose function
export function evaluate(
    art: FunctionBuilderArt,
    x: number,
    seenNodes: string[], // TODO: What this param menas
    systemsContainer: ISystems,
): number | null {
    if (seenNodes.includes(art.artId)) return null;
    if (!art.functionDefinition) return null;

    let sources: { [key: string]: FunctionBuilderArt | null } = {};
    Object.keys(art.connections).forEach((key) => {
        if (art.connections[key] === null) {
            sources[key] = null;
            return;
        }

        const foundArts = systemsContainer.materialArtVersioningSystem.arts.filter((art: AbstractArt) =>
            art.connections ? art.artId === art.connections[key] : false,
        );
        if (foundArts.length === 0) {
            sources[key] = null;
            return;
        }

        // TODO: What if more...

        sources[key] = foundArts[0] as FunctionBuilderArt;
    });

    let variables: { [key: string]: number | null } = {};
    Object.keys(sources).forEach((key) => {
        if (sources[key] === null) {
            variables[key] = 0;
            return;
        }

        variables[key] = sources[key]!.evaluate(x, [...seenNodes, art.artId], systemsContainer);
    });

    if (Object.values(variables).reduce((prev, curr) => prev || curr === null, false)) return null;

    return isFunctionBuilderFunction(art.functionDefinition)
        ? art.functionDefinition.func(x, variables as { [key: string]: number })
        : art.functionDefinition.constant;
}

import { declareModule, makeIconModuleOnModule, selectionToolBehavior, ToolbarName } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { observable } from 'mobx';
import * as React from 'react';
import { Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../../package.json';
import { functionBuilderDefinitions } from '../definitions/functionBuilderDefinitions';
import { FunctionBuilderConnectionArt } from '../utils/FunctionBuilderConnectionArt';
import { GraphStateHolder } from '../utils/GraphStateHolder';
import { FunctionBuilderArt } from './FunctionBuilderArtModule';
import { FunctionBuilderMenu } from './FunctionBuilderMenu';

export interface IFunctionBuilderToolInternalState {
    selectedFunction: string;
    manipulating: boolean;
}

/**
 *
 * Note: In future this file will we in independent repository as external state.
 *
 */

declareModule(() => {
    const state: IFunctionBuilderToolInternalState = observable({
        selectedFunction: Object.keys(functionBuilderDefinitions)[0],
        manipulating: true,
    });

    async function activateSelectionTool() {
        state.manipulating = true;
    }

    return makeIconModuleOnModule({
        manifest: {
            flags: { isDevelopment: true, isExperimental: true }, // ['development', 'experimental']
            name: 'FunctionBuilder',
            title: { en: 'Function Builder', cs: 'Nástroj na konstrukci funkcí' },
            /*description: {
            en: 'TODO',
            cs: 'TODO',
        },*/

            categories: ['Math', 'Experimental' /* TODO: Probbably experimental should be flag or some dev stage */],
            icon: 'http://localhost:9980/icons/group.svg', // TODO

            contributors,
            description,
            license,
            repository,
            version,
        },
        toolbar: ToolbarName.Tools,
        icon: {
            name: 'functionBuilder',
            order: 61,
            icon: 'group', // TODO
            boardCursor: 'default',
            menu: <FunctionBuilderMenu {...{ state }} />,
        },
        moduleActivatedByIcon: {
            async setup(systems) {
                const { touchController, virtualArtVersioningSystem, materialArtVersioningSystem, collSpace } =
                    await systems.request(
                        'touchController',
                        'virtualArtVersioningSystem',
                        'materialArtVersioningSystem',
                        'collSpace',
                    );

                return Registration.fromSubscription((registerAdditionalSubscription) =>
                    touchController.touches.subscribe(async (touch) => {
                        if (state.manipulating) {
                            // Dragging new connection
                            const overOutputs = materialArtVersioningSystem.artsPlaced.filter(
                                (art) =>
                                    art instanceof FunctionBuilderArt &&
                                    (art as FunctionBuilderArt).__pointerOverOutput,
                            );

                            if (overOutputs.length > 0) {
                                const source = overOutputs[0] as FunctionBuilderArt;

                                const arrow = new FunctionBuilderConnectionArt(
                                    source.getOutputPosition(collSpace),
                                    source.color,
                                );

                                const arrowAsVirtualArt = virtualArtVersioningSystem
                                    .createPrimaryOperation()
                                    .newArts(arrow);

                                touch.frames.subscribe({
                                    next: (touchFrame) => {
                                        arrow.end = collSpace.pickPoint(touchFrame.position).point;
                                        arrowAsVirtualArt.update(arrow);
                                    },
                                    complete: () => {
                                        const toUpdate = materialArtVersioningSystem.artsPlaced.filter(
                                            (art) => art instanceof FunctionBuilderArt,
                                        );

                                        materialArtVersioningSystem
                                            .createOperation('Connection updated')
                                            .takeArts(...toUpdate)
                                            .updateWithMutatingCallback((art) =>
                                                (art as FunctionBuilderArt).registerInputIfOver(
                                                    source.artId,
                                                    touch.frames.value.position,
                                                ),
                                            )
                                            .persist();

                                        arrowAsVirtualArt.destroy();
                                    },
                                });
                                return;
                            }

                            // Editing old connection
                            const overInputs = materialArtVersioningSystem.artsPlaced.filter(
                                (art) =>
                                    art instanceof FunctionBuilderArt &&
                                    Object.values((art as FunctionBuilderArt).__pointerOverInput).reduce(
                                        (prev, curr) => prev || curr,
                                        false,
                                    ),
                            );

                            if (overInputs.length > 0) {
                                const oldChild = overInputs[0] as FunctionBuilderArt;
                                const inputId = Object.keys(oldChild.__pointerOverInput).filter(
                                    (key) => oldChild.__pointerOverInput[key],
                                )[0]; // Must exist because filtering

                                // Nothing connected there
                                if (!oldChild.connections[inputId]) return;

                                const possibleSources = materialArtVersioningSystem.artsPlaced.filter(
                                    (art) => art.artId === oldChild.connections[inputId],
                                );

                                // Source no longer exists
                                if (possibleSources.length === 0) return;

                                oldChild.connections[inputId] = null;
                                GraphStateHolder.update();

                                const source = possibleSources[0];

                                const arrow = new FunctionBuilderConnectionArt(
                                    source.getOutputPosition(systems),
                                    source.color,
                                );

                                const arrowAsVirtualArt = virtualArtVersioningSystem
                                    .createPrimaryOperation()
                                    .newArts(arrow);
                                touch.frames.subscribe({
                                    next: (touchFrame) => {
                                        arrow.end = collSpace.pickPoint(touchFrame.position).point;
                                        arrowAsVirtualArt.update(arrow);
                                    },
                                    complete: () => {
                                        const toUpdate = materialArtVersioningSystem.artsPlaced.filter(
                                            (art) => art instanceof FunctionBuilderArt,
                                        );

                                        materialArtVersioningSystem
                                            .createOperation('Connection deleted')
                                            .takeArts(...toUpdate)
                                            .updateWithMutatingCallback((art) =>
                                                (art as FunctionBuilderArt).registerInputIfOver(
                                                    source.artId,
                                                    touch.frames.value.position,
                                                ),
                                            )
                                            .persist();

                                        arrowAsVirtualArt.destroy();
                                    },
                                });
                                return;
                            }

                            // Dragging whole boxes (supply selection tool)
                            await selectionToolBehavior({
                                registerAdditionalSubscription,
                                systems,
                                touch,
                            });
                            return;
                        } else {
                            const pointOnBoard = collSpace.pickPoint(touch.firstFrame.position).point;

                            const newArt = new FunctionBuilderArt(
                                pointOnBoard.subtract(new Vector(115, 140)),
                                state.selectedFunction,
                            );

                            const operation = materialArtVersioningSystem.createPrimaryOperation();
                            operation.newArts(newArt);
                            operation.persist();

                            activateSelectionTool();
                        }
                    }),
                );
            },
        },
    });
});

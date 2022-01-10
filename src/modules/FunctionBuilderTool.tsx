import {
    declareModule,
    Icon,
    makeIconModuleOnModule,
    ToolbarName,
    classNames,
    Registration,
    selectionToolDraggingBehavior,
    selectionToolSelectionBoxBehavior,
} from '@collboard/modules-sdk';
import { observable } from 'mobx';
import * as React from 'react';
import styled from 'styled-components';
import { Vector } from 'xyzt';
import { Authors } from '../authors';
import { functionBuilderDefinitions } from '../definitions/functionBuilderDefinitions';
import { FunctionBuilderConnectionArt } from '../utils/FunctionBuilderConnectionArt';
import { functionBuilderFormatTitle } from '../utils/functionBuilderFormatTitle';
import { GraphStateHolder } from '../utils/GraphStateHolder';
import { FunctionBuilderArt } from './FunctionBuilderArtModule';

const StyledTextIcon = styled.div`
    padding: 5px 10px;
    margin: 5px 5px;
    border: solid 2px rgba(0, 0, 0, 0);
    border-radius: 5px;
    font-size: 0.8em;
    cursor: pointer;
    white-space: nowrap;

    &.active {
        border-color: #4e4e4e;
    }
`;

declareModule(() => {
    const state: {
        selectedFunction: string;
        manipulating: boolean;
    } = observable({
        selectedFunction: Object.keys(functionBuilderDefinitions)[0],
        manipulating: true,
    });

    async function activateSelectionTool() {
        state.manipulating = true;
    }

    return makeIconModuleOnModule({
        manifest: {
            flags: ['development', 'experimental'],
            name: 'FunctionBuilder',
            title: { en: 'Function Builder', cs: 'Nástroj na konstrukci funkcí' },
            /*description: {
            en: 'TODO',
            cs: 'TODO',
        },*/
            keywords: [],
            categories: ['Math', 'Experimental' /* TODO: Probbably experimental should be flag or some dev stage */],
            icon: '/assets/icons/group.svg', // TODO
            screenshots: [
                /*TODO:*/
            ],
            contributors: [Authors.rosecky, Authors.firchova, Authors.hejny],
        },
        toolbar: ToolbarName.Tools,
        icon: {
            name: 'functionBuilder',
            autoSelect: true,

            order: 61,
            focusScope: 'tools',

            icon: 'group', // TODO
            boardCursor: 'default',
            menu: () => (
                <>
                    <Icon
                        icon="cursor"
                        active={state.manipulating}
                        onClick={() => {
                            state.manipulating = true;
                        }}
                    />

                    {/* TODO: add icons */}

                    {Object.keys(functionBuilderDefinitions).map((funct, i) => (
                        <StyledTextIcon
                            className={classNames(!state.manipulating && state.selectedFunction === funct && 'active')}
                            onClick={() => {
                                state.selectedFunction = funct;
                                state.manipulating = false;
                            }}
                            key={i}
                        >
                            {functionBuilderFormatTitle(functionBuilderDefinitions[funct])}
                        </StyledTextIcon>
                    ))}
                </>
            ),
        },
        moduleActivatedByIcon: {
            setup: (systemsContainer) => {
                const { touchController, virtualArtVersioningSystem, materialArtVersioningSystem, collSpace } =
                    systemsContainer;

                return Registration.fromSubscription((registerAdditionalSubscription) =>
                    touchController.touches.subscribe((touch) => {
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
                                    source.getOutputPosition(systemsContainer),
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
                                    source.getOutputPosition(systemsContainer),
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
                            //selectionToolBehavior({ registerAdditionalSubscription, systems: systemsContainer, touch });
                            selectionToolDraggingBehavior({
                                registerAdditionalSubscription,
                                systems: systemsContainer,
                                touch,
                            }) ||
                                selectionToolSelectionBoxBehavior({
                                    registerAdditionalSubscription,
                                    systems: systemsContainer,
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

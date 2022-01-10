/* tslint:disable */
/* TODO: Enable TSLint */
import {
    Abstract2dArt,
    AbstractArt,
    AsyncContentComponent,
    declareModule,
    ISystems,
    makeArtModule,
    promptDialogue,
} from '@collboard/modules-sdk';
import * as React from 'react';
import styled from 'styled-components';
import { forAnimationFrame } from 'waitasecond';
import { IVector, Vector } from 'xyzt';
import { CONNECTION_DOT_SNAPRADIUS, DEFAULT_PLOT_BOUNDINGBOX } from '../config';
import { functionBuilderDefinitions } from '../definitions/functionBuilderDefinitions';
import {
    FunctionBuilderConstant,
    FunctionBuilderDefinition,
    FunctionBuilderFunction,
    isFunctionBuilderFunction,
} from '../interfaces/FunctionBuilderFunction';
import { functionBuilderFormatTitle } from '../utils/functionBuilderFormatTitle';
import { GraphStateHolder } from '../utils/GraphStateHolder';
import { plot } from '../utils/plot';
import { renderPath } from '../utils/renderPath';

const StyledArt = styled.div`
    position: relative;
    border-radius: 10px;

    /* Graph */
    .graphWrapper {
        position: absolute;
        bottom: 7px;
        left: 7px;
        right: 7px;
        height: 180px;
        background: white;
        border-radius: 5px;
        padding: 7px;
    }

    .graphWrapper .graph {
        background: white;
    }

    /* Title */
    .functionTitle {
        width: 230px;
        text-align: center;
        font-size: 1.8em;
        font-weight: bold;
        height: 90px;
        vertical-align: middle;
        display: table-cell;
    }

    .functionTitle input {
        width: 110px;
        text-align: center;
        font-size: 1.2em;
        font-weight: bold;
        height: 90px;
        vertical-align: middle;
        display: table-cell;
    }

    /* I/O */
    .inputs,
    .outputs {
        position: absolute;
        top: 10px;
        display: flex;
        flex-direction: column;
        height: 70px;
        z-index: 1;
    }

    .inputs {
        left: -10px;
    }

    .outputs {
        right: -10px;
    }

    .inputs .connection,
    .outputs .connection {
        display: flex;
        margin: auto 0;
    }

    .inputs .connection {
        flex-direction: row;
    }

    .outputs .connection {
        flex-direction: row-reverse;
    }

    .connectionPoint {
        display: inline-block;
        width: 24px;
        height: 24px;
        background: #f2f2f2;
        border: solid 4px white;
        border-radius: 100%;
        pointer-events: all;
    }

    .functionBuilder-tool & .connectionPoint:hover {
        border: solid 3px white;
        cursor: pointer;
    }

    .connectionTitle {
        margin: 0 8px;
        line-height: 24px;
        font-size: 0.9em;
    }
`;

export class FunctionBuilderArt extends Abstract2dArt {
    // __Underscored variables don't get serialized
    public __pointerOverOutput: boolean = false;
    public __pointerOverInput: { [key: string]: boolean } = {};

    private __outputRef = React.createRef<HTMLDivElement>();
    private __inputRefs: { [key: string]: React.RefObject<HTMLDivElement> } = {};

    private __lastPlotted: number = -1;

    public connections: { [key: string]: string | null };
    private privateSize: IVector = new Vector(230, 280);
    public color: string;
    public constant: number | null = null;

    constructor(public shift: IVector, private funct: string) {
        super();

        this.color = GraphStateHolder.generateColor();

        this.connections = {};

        if (this.functionDefinition && isFunctionBuilderFunction(this.functionDefinition)) {
            Object.keys(this.functionDefinition.variables).forEach((variable) => {
                this.__pointerOverInput[variable] = false;
                this.connections[variable] = null;
                this.__inputRefs[variable] = React.createRef();
            });
        }
    }

    acceptedAttributes = [];

    // The size of BB is reduced because of the connection events (should be eventually fixed)
    get topLeftCorner() {
        if (!this.functionDefinition || isFunctionBuilderFunction(this.functionDefinition)) {
            return Vector.add(this.shift, Vector.box(10));
        } else {
            return Vector.add(this.shift, Vector.box(10), new Vector(0, 90));
        }
    }
    get bottomRightCorner() {
        return Vector.subtract(Vector.add(this.shift, this.privateSize), Vector.box(10));
    }

    public get functionDefinition(): FunctionBuilderDefinition | null {
        return functionBuilderDefinitions[this.funct];
    }

    public registerInputIfOver(sourceId: string, position: Vector) {
        this.recountPointerOverInputByPosition(position);
        Object.keys(this.__pointerOverInput)
            .filter((key) => this.__pointerOverInput[key])
            .forEach((key) => {
                this.connections[key] = sourceId;
                GraphStateHolder.update();
                this.__pointerOverInput[key] = false;
                //console.log('Created connection from ' + sourceId + ' to ' + this.artId + ' (input ' + key + ')');
            });
    }

    private recountPointerOverInputByPosition(position: Vector) {
        Object.entries(this.__inputRefs)
            .map(([key, ref]) => ({ key, current: ref.current }))
            .filter(({ current }) => current)
            .map(({ key, current }) => {
                const { x, y, width, height } = current!.getBoundingClientRect();
                const refPosition = new Vector(x + width / 2, y + height / 2);
                return {
                    key,
                    current,
                    distance: Vector.distance(refPosition, position),
                };
            })
            .filter(({ distance }) => distance < CONNECTION_DOT_SNAPRADIUS)
            .sort(({ distance: a }, { distance: b }) => (a > b ? 1 : -1))
            .slice(0, 1)
            .forEach(({ key }) => {
                this.clearAllPointerOverInputs();
                this.__pointerOverInput[key] = true;
            });
    }

    private clearAllPointerOverInputs() {
        for (const key in this.__pointerOverInput) {
            this.__pointerOverInput[key] = false;
        }
    }

    private locateRef(target: React.RefObject<HTMLDivElement>, systemsContainer: ISystems) {
        if (target && target.current) {
            const bb = target.current.getBoundingClientRect();
            return systemsContainer.collSpace.pickPoint(new Vector(bb.x, bb.y)).point.add(Vector.box(12)); // 12 is radius of circle
        }
        return Vector.add(this.shift, Vector.scale(this.privateSize, 0.5));
    }

    public getOutputPosition(systemsContainer: ISystems) {
        return this.locateRef(this.__outputRef, systemsContainer);
    }

    public getInputPosition(key: string, systemsContainer: ISystems) {
        return this.locateRef(this.__inputRefs[key], systemsContainer);
    }

    public evaluate(x: number, seenNodes: string[], systemsContainer: ISystems): number | null {
        if (seenNodes.includes(this.artId)) return null;
        if (!this.functionDefinition) return null;

        let sources: { [key: string]: FunctionBuilderArt | null } = {};
        Object.keys(this.connections).forEach((key) => {
            if (this.connections[key] === null) {
                sources[key] = null;
                return;
            }

            const foundArts = systemsContainer.materialArtVersioningSystem.arts.filter(
                (art: AbstractArt) => art.artId === this.connections[key],
            );
            if (foundArts.length === 0) {
                sources[key] = null;
                return;
            }

            sources[key] = foundArts[0] as FunctionBuilderArt;
        });

        let variables: { [key: string]: number | null } = {};
        Object.keys(sources).forEach((key) => {
            if (sources[key] === null) {
                variables[key] = 0;
                return;
            }

            variables[key] = sources[key]!.evaluate(x, [...seenNodes, this.artId], systemsContainer);
        });

        if (Object.values(variables).reduce((prev, curr) => prev || curr === null, false)) return null;

        if (isFunctionBuilderFunction(this.functionDefinition)) {
            return this.functionDefinition.func(x, variables as { [key: string]: number });
        } else {
            return this.constant || this.functionDefinition.constant;
        }
    }

    render(_selected: boolean, systemsContainer: ISystems) {
        if (Object.keys(this.connections).length !== Object.keys(this.__inputRefs).length) {
            if (this.functionDefinition && isFunctionBuilderFunction(this.functionDefinition)) {
                Object.keys(this.functionDefinition.variables).forEach((variable) => {
                    this.__inputRefs[variable] = React.createRef();
                });
            }
        }

        let sources: { [key: string]: FunctionBuilderArt | null } = {};
        Object.keys(this.connections).forEach((key) => {
            if (this.connections[key] === null) {
                sources[key] = null;
                return;
            }

            const foundArts = systemsContainer.materialArtVersioningSystem.arts.filter(
                (art: AbstractArt) => art.artId === this.connections[key],
            );
            if (foundArts.length === 0) {
                // Object got deleted
                sources[key] = null;
                this.connections[key] = null;
                GraphStateHolder.update();
                return;
            }

            sources[key] = foundArts[0] as FunctionBuilderArt;
        });

        return (
            <StyledArt
                className="block"
                style={{
                    width: this.privateSize.x || 0,
                    height: this.privateSize.y || 0,
                    position: 'absolute',
                    left: this.shift.x || 0,
                    top: this.shift.y || 0,
                    transform: 'rotate(' + this.rotation + 'deg)',
                }}
            >
                <div className="functionTitle">
                    {!this.functionDefinition ? (
                        'Error'
                    ) : isFunctionBuilderFunction(this.functionDefinition) ? (
                        functionBuilderFormatTitle(this.functionDefinition)
                    ) : (
                        <span
                            onClick={async (event) => {
                                // TODO: I just do not figure out how to do it with input so I am using this quickhack with prompt
                                event.stopPropagation();
                                const value = await promptDialogue({
                                    defaultValue: (
                                        this.constant || (this.functionDefinition as FunctionBuilderConstant).constant
                                    ).toString(),
                                });

                                if (!value) return;
                                if (isNaN(+value)) return;

                                // TODO: Creating opertions in arts (art is changing itself) should have nicer API
                                systemsContainer.materialArtVersioningSystem
                                    .createOperation('Change value of constant')
                                    .takeArts(this)
                                    .updateWithMutatingCallback((art) => {
                                        art.constant = +value;
                                    })
                                    .persist();

                                GraphStateHolder.update();
                            }}
                        >
                            {
                                !this.constant || this.constant === this.functionDefinition.constant
                                    ? // Constants - if the constant value is same as definition show the title
                                      functionBuilderFormatTitle(this.functionDefinition)
                                    : Math.round(this.constant * 100000) /
                                      100000 /* TODO: Do some global util to show numbers  */
                            }
                        </span>
                    )}
                </div>
                <div className="inputs">
                    {this.functionDefinition &&
                        isFunctionBuilderFunction(this.functionDefinition) &&
                        Object.keys(this.functionDefinition.variables).map((key) => (
                            <div className="connection" key={key}>
                                <div
                                    className="connectionPoint"
                                    onPointerOver={() => {
                                        this.__pointerOverInput[key] = true;
                                    }}
                                    onPointerOut={() => {
                                        this.__pointerOverInput[key] = false;
                                    }}
                                    style={sources[key] ? { background: sources[key]!.color } : {}}
                                    ref={this.__inputRefs[key]}
                                />
                                <div className="connectionTitle">
                                    {systemsContainer.translationsSystem.translate(
                                        'FunctionBuilderArt / Input',
                                        'Vstup',
                                    ) + ' '}
                                    <i>
                                        {(this.functionDefinition as FunctionBuilderFunction).variables[key].title}{' '}
                                        {(this.functionDefinition as FunctionBuilderFunction).variables[key].note &&
                                            `(${
                                                (this.functionDefinition as FunctionBuilderFunction).variables[key].note
                                            })`}
                                    </i>
                                </div>
                            </div>
                        ))}
                </div>
                <div className="outputs">
                    <div className="connection">
                        <div
                            className="connectionPoint"
                            onPointerOver={() => {
                                this.__pointerOverOutput = true;
                            }}
                            onPointerOut={() => {
                                this.__pointerOverOutput = false;
                            }}
                            ref={this.__outputRef}
                            style={{ background: this.color }}
                        />
                        <div className="connectionTitle">
                            {systemsContainer.translationsSystem.translate('FunctionBuilderArt / Output', 'Výstup')}
                        </div>
                    </div>
                </div>
                <div className="graphWrapper">
                    <canvas
                        className="graph"
                        width={202}
                        height={166}
                        id={this.artId}
                        ref={(canvas) => {
                            if (canvas) {
                                if (!this.functionDefinition) return;
                                if (GraphStateHolder.lastPlotted === this.__lastPlotted) return;

                                this.__lastPlotted = GraphStateHolder.lastPlotted;
                                plot({
                                    canvas,
                                    func: (x) => this.evaluate(x, [], systemsContainer),
                                    // func: (x) => Math.sin(x),
                                    boundingBox: DEFAULT_PLOT_BOUNDINGBOX,
                                    // TODO: objects: {},
                                });
                            }
                        }}
                    />
                </div>
                <AsyncContentComponent
                    content={async () => {
                        // Note: this is tiny hack to get connections in correct positions on initial load
                        await forAnimationFrame();
                        return (
                            <>
                                {Object.keys(sources)
                                    .filter((key) => sources[key] !== null)
                                    .map((key) => {
                                        return renderPath(
                                            sources[key]!.getOutputPosition(systemsContainer),
                                            this.getInputPosition(key, systemsContainer),
                                            sources[key]!.color,
                                            undefined, // Here can be label
                                            this.shift,
                                            key,
                                        );
                                    })}
                            </>
                        );
                    }}
                />
            </StyledArt>
        );
    }
}

declareModule(makeArtModule({ name: 'SampleFunctionBuilder', class: FunctionBuilderArt }));

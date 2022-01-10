import { Abstract2dArt } from '@collboard/modules-sdk';
import { IVector, Vector } from 'xyzt';
import { renderPath } from './renderPath';

export class FunctionBuilderConnectionArt extends Abstract2dArt {
    public end: IVector;

    constructor(public start: IVector, private color: string) {
        super();
        this.end = start;
    }

    acceptedAttributes = [];

    defaultZIndex = 9;

    // Just to extend correctly, this is unnecessary
    get topLeftCorner() {
        return new Vector(Math.min(this.start.x!, this.end.x!), Math.min(this.start.y!, this.end.y!));
    }
    get bottomRightCorner() {
        return new Vector(Math.max(this.start.x!, this.end.x!), Math.max(this.start.y!, this.end.y!));
    }

    render() {
        return renderPath(this.start, this.end, this.color);
    }
}

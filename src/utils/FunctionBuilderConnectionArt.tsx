import { Abstract2dArt } from '@collboard/modules-sdk';
import { IVectorData, Vector } from 'xyzt';
import { renderPath } from './renderPath';

export class FunctionBuilderConnectionArt extends Abstract2dArt {
    public static serializeName = 'FunctionBuilderConnection';
    public static manifest = {
        // Note+TODO: All modules should be in format @collboard/module-name but we started with art modules
        name: '@collboard/function-builder-connection-art',
    };

    public end: IVectorData;

    constructor(public start: IVectorData, private color: string) {
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

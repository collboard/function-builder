import { BoundingBox } from 'xyzt';

export type IPlotColor = string;

export interface IPlotObject {
    color?: IPlotColor;
    width?: number;
}
export interface IPlotObjects {
    func?: IPlotObject;
    axis?: IPlotObject;
    grid?: IPlotObject;
    labels?: IPlotObject;
}
export interface IPlotOptions {
    canvas: HTMLCanvasElement;
    func: (x: number) => number | null;
    boundingBox: BoundingBox;
    objects?: IPlotObjects;
}

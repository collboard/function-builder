import { functionBuilderColors } from './colors';

export class GraphStateHolder {
    static lastPlotted: number = 0;
    static lastColor: number = Math.floor(Math.random() * functionBuilderColors.length);

    static update() {
        this.lastPlotted++;
    }

    static generateColor() {
        this.lastColor++;
        return functionBuilderColors[this.lastColor % functionBuilderColors.length];
    }
}

// TODO: Probbably do singleton with singleton instance not with static method (which has a bit different purpose)

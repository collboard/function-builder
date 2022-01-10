/* tslint:disable */
/* TODO: Enable TSLint */
import { IPlotOptions } from '../interfaces/IPlotOptions';

const SCALE = 10;

export function plot({ canvas, func, boundingBox, objects }: IPlotOptions) {
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 3;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // X axis
    ctx.beginPath();
    ctx.strokeStyle = '#F2F2F2';
    ctx.moveTo(0, centerY);
    ctx.lineTo(500, centerY);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.strokeStyle = '#F2F2F2';
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, 500);
    ctx.stroke();

    // Function plot
    ctx.beginPath();
    ctx.strokeStyle = '#4E4E4E';

    for (let x = 0; x <= canvas.width; x += 1) {
        const result = func((x - centerX) / SCALE);

        if (result !== null) {
            ctx.lineTo(x, centerY - result * SCALE);
        } else {
            ctx.stroke();
            ctx.font = '15px comenia-sans-web';
            ctx.fillStyle = '#4E4E4E';
            ctx.textAlign = 'center';
            ctx.fillText('Rekurzivní výpočet!', centerX, centerY - 10, canvas.width);
            break;
        }
    }
    ctx.stroke();
}

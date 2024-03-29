import { React } from '@collboard/modules-sdk';
import { IVectorData, Vector } from 'xyzt';
import { FunctionBuilderConnectionStyle } from '../styles/FunctionBuilderConnectionStyle';

const PADDING = 30;

function getTopLeftCorner(point1: IVectorData, point2: IVectorData) {
    return new Vector(Math.min(point1.x!, point2.x!), Math.min(point1.y!, point2.y!));
}
function getBottomRightCorner(point1: IVectorData, point2: IVectorData) {
    return new Vector(Math.max(point1.x!, point2.x!), Math.max(point1.y!, point2.y!));
}

// Recalculated relative points
function getPointRelative(main: IVectorData, additional: IVectorData) {
    return Vector.subtract(main, getTopLeftCorner(main, additional)).add(Vector.square(PADDING));
}

function getPath(point1: IVectorData, point2: IVectorData) {
    const point1Relative = getPointRelative(point1, point2);
    const point2Relative = getPointRelative(point2, point1);

    return [
        'M',
        point1Relative.x,
        point1Relative.y,
        'C',
        (point1Relative.x + point2Relative.x) / 2,
        point1Relative.y,
        (point1Relative.x + point2Relative.x) / 2,
        point2Relative.y,
        point2Relative.x,
        point2Relative.y,
    ].join(' ');
}

export function renderPath(
    point1: IVectorData,
    point2: IVectorData,
    color: string,
    label?: string,
    unshift: IVectorData = Vector.zero(),
    key?: string | number,
) {
    const path = getPath(point1, point2);
    const topLeft = getTopLeftCorner(point1, point2);
    const bottomRight = getBottomRightCorner(point1, point2);

    return (
        <FunctionBuilderConnectionStyle
            style={{
                width: bottomRight.subtract(topLeft).x + 2 * PADDING,
                height: bottomRight.subtract(topLeft).y + 2 * PADDING,
                left: topLeft.x - unshift.x! - PADDING,
                top: topLeft.y - unshift.y! - PADDING,
            }}

            key={key}
        >
            <path d={path} style={{ stroke: color }} />
            {label &&
                (point1.y! > point2.y! ? (
                    <text
                        x={bottomRight.subtract(topLeft).x / 2 - 10 + PADDING}
                        y={bottomRight.subtract(topLeft).y / 2 - 10 + PADDING}
                        style={{
                            stroke: 'none',
                            fill: color,
                            fontWeight: 'bold',
                            fontSize: '15px',
                            textAnchor: 'end',
                            lineHeight: '15px',
                            dominantBaseline: 'middle',
                        }}
                    >
                        {label}
                    </text>
                ) : (
                    <text
                        x={bottomRight.subtract(topLeft).x / 2 + 10 + PADDING}
                        y={bottomRight.subtract(topLeft).y / 2 - 10 + PADDING}
                        style={{
                            stroke: 'none',
                            fill: color,
                            fontWeight: 'bold',
                            fontSize: '15px',
                            textAnchor: 'start',
                            lineHeight: '15px',
                            dominantBaseline: 'middle',
                        }}
                    >
                        {label}
                    </text>
                ))}
        </FunctionBuilderConnectionStyle>
    );
}

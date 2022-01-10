import * as React from 'react';
import styled from 'styled-components';
import { IVectorObject, Vector } from 'xyzt';

const PADDING = 30;

function getTopLeftCorner(point1: IVectorObject, point2: IVectorObject) {
    return new Vector(Math.min(point1.x!, point2.x!), Math.min(point1.y!, point2.y!));
}
function getBottomRightCorner(point1: IVectorObject, point2: IVectorObject) {
    return new Vector(Math.max(point1.x!, point2.x!), Math.max(point1.y!, point2.y!));
}

// Recalculated relative points
function getPointRelative(main: IVectorObject, additional: IVectorObject) {
    return Vector.subtract(main, getTopLeftCorner(main, additional)).add(Vector.box(PADDING));
}

function getPath(point1: IVectorObject, point2: IVectorObject) {
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

const StyledConnection = styled.svg`
    position: absolute;
    pointer-events: none;
    z-index: 1;

    * {
        stroke-width: 3px;
        stroke: black;
        fill: none;
        pointer-events: none;
    }
`;

export function renderPath(
    point1: IVectorObject,
    point2: IVectorObject,
    color: string,
    label?: string,
    unshift: IVectorObject = Vector.zero(),
    key?: string | number,
) {
    const path = getPath(point1, point2);
    const topLeft = getTopLeftCorner(point1, point2);
    const bottomRight = getBottomRightCorner(point1, point2);

    return (
        <StyledConnection
            style={{
                width: bottomRight.subtract(topLeft).x + 2 * PADDING,
                height: bottomRight.subtract(topLeft).y + 2 * PADDING,
                left: topLeft.x - unshift.x! - PADDING,
                top: topLeft.y - unshift.y! - PADDING,
            }}
            className="functionBuilderConnection"
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
        </StyledConnection>
    );
}

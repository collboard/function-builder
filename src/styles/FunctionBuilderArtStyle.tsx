import { styled } from '@collboard/modules-sdk';

export const FunctionBuilderArtStyle = styled.div`
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

    .connectionTitle {
        margin: 0 8px;
        line-height: 24px;
        font-size: 0.9em;
    }
`;

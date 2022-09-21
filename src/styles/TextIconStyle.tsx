import { styled } from '@collboard/modules-sdk';

export const TextIconStyle = styled.div`
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

import { classNames, Icon } from '@collboard/modules-sdk';
import { observer } from 'mobx-react';
import * as React from 'react';
import { functionBuilderDefinitions } from '../definitions/functionBuilderDefinitions';
import { functionBuilderFormatTitle } from '../utils/functionBuilderFormatTitle';
import { IFunctionBuilderToolInternalState } from './FunctionBuilderTool';

@observer
export class FunctionBuilderMenu extends React.Component<{ state: IFunctionBuilderToolInternalState }> {
    render() {
        const { state } = this.props;
        return (
            <>
                <Icon
                    icon="cursor"
                    active={state.manipulating}
                    onClick={() => {
                        state.manipulating = true;
                    }}
                />

                {/* TODO: add icons */}

                {Object.keys(functionBuilderDefinitions).map((funct) => (
                    <div
                        key={funct}
                        className={classNames(
                            'textIcon',
                            !state.manipulating && state.selectedFunction === funct && 'active',
                        )}
                        onClick={() => {
                            state.selectedFunction = funct;
                            state.manipulating = false;
                        }}
                    >
                        {functionBuilderFormatTitle(functionBuilderDefinitions[funct])}
                    </div>
                ))}
            </>
        );
    }
}

/**
 * TODO: This is not module but a component - move to other folder
 */

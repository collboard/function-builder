import { classNames, Icon, ObservableContentComponent, React } from '@collboard/modules-sdk';
import { map, Subject } from 'rxjs';
import { functionBuilderDefinitions } from '../definitions/functionBuilderDefinitions';
import { TextIconStyle } from '../styles/TextIconStyle';
import { functionBuilderFormatTitle } from '../utils/functionBuilderFormatTitle';
import { IFunctionBuilderToolInternalState } from './FunctionBuilderTool';

interface IFunctionBuilderMenuProps {
    state: Subject<IFunctionBuilderToolInternalState>;
}

export function FunctionBuilderMenu({ state }: IFunctionBuilderMenuProps) {
    return (
        <ObservableContentComponent
            alt="Function Builder Menu"
            content={(state as any).pipe(
                map((stateValue: IFunctionBuilderToolInternalState) => (
                    <>
                        <Icon
                            icon="cursor"
                            active={stateValue.manipulating}
                            onClick={() => {
                                state.next({ ...stateValue, manipulating: true });
                            }}
                        />
                        {/* TODO: add icons */}
                        {Object.keys(functionBuilderDefinitions).map((funct) => (
                            <TextIconStyle
                                key={funct}
                                className={classNames(
                                    !stateValue.manipulating && stateValue.selectedFunction === funct && 'active',
                                )}
                                onClick={() => {
                                    state.next({ ...stateValue, selectedFunction: funct, manipulating: false });
                                }}
                            >
                                {functionBuilderFormatTitle(functionBuilderDefinitions[funct])}
                            </TextIconStyle>
                        ))}
                    </>
                )),
            )}
        />
    );
}

/**
 * TODO: This is not module but a component - move to other folder
 * TODO: @hejny -> @rosecky Fix design of menu
 */

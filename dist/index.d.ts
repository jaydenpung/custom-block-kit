import { Client } from '@microsoft/microsoft-graph-client';

declare const FIELD_TYPES: {
    BUTTON: string;
    DROPDOWN: string;
    LIST: string;
    NUMBER: string;
    PARA: string;
    TEXT: string;
    RAD: string;
    DATE: string;
    SLDR: string;
    CBX: string;
    COMP: string;
    LOOP_SET: string;
    LOOP_VALUE: string;
    LOOP_INDEX: string;
    LOOP_SIZE: string;
    FILE: string;
    DOC: string;
    USERPICKER: string;
    DOCUSIGN_STATUS: string;
    TXT: string;
    NUM: string;
};

interface BaseSchema {
    key?: string;
    name?: string;
    color?: string;
    toggleName?: string;
    blockType: blockType;
    icon?: string;
    stencil?: Stencil;
    studioShape?: StudioShape;
    editor?: Editor;
    runtime?: (cbk: BackendCBK) => Promise<void>;
}
interface Stencil {
    group: string;
    fontSize: number;
}
interface StudioShape {
    fontSize: number;
}
interface Editor {
    elements: EditorField[];
}
interface OutputProps {
    as?: keyof typeof FIELD_TYPES;
    ref?: string;
}
interface EditorField {
    ref: string;
    label?: string;
    component: string;
    componentProps: ComponentProps;
    showIf?: string | ((cbk: FrontendCBK) => boolean);
    validators?: ValidatorProps[];
    children?: EditorField[];
    output?: OutputProps;
}
interface FrontendCBK {
    api: {
        get: <T extends object>(url: string, params?: Record<string, unknown>) => Promise<T>;
    };
    getElementValue(ref: string): string | Record<string, string>[];
    setElementValue(ref: string, value: string | undefined): void;
    getVariableType(name: string): string;
    getAllVars(): VariableOption[];
    getRadioOptions(ref: string): string[];
}
interface VariableOption {
    label: string;
    value: string;
    type: string;
}
interface BackendCBK {
    library: any;
    apiClient: {
        msgraph: () => Promise<Client>;
        openai: () => Promise<any>;
        checkbox: () => Promise<any>;
    };
    getIsPreview(): boolean;
    getUser(): {
        userNumber: number;
        userUUID: string;
        accountUUID: string;
    };
    getElementValue(ref: string): string;
    getVariable(name: string): any;
    getVariableDocValue(name: string): string;
    setOutput(name: string, value: any): void;
    downloadFile(fileKey: string): Promise<any>;
    log(...message: any[]): void;
    getVariableType(name: string): string;
    hasInput(name: string): boolean;
    overwriteInput(name: string, value: any): void;
}
type CustomOptionString = "getDateVariables" | "getExistingVariables" | "getFileVariables" | "getFormattableListVariables" | "getTextVariables" | "getRadioVariables" | "getRadioOptions" | "getOnlyDocVariables";
interface ComponentProps {
    label?: string;
    icon?: string;
    placeholder?: string;
    options?: ComponentOptionProps[] | ((cbk: FrontendCBK, optionState?: OptionState) => Promise<ComponentOptionProps[]>) | CustomOptionString;
    inputComponent?: EditorField;
    keyValueComponents?: (cbk: FrontendCBK) => Promise<KeyValueOptionProp[]>;
    isSearchable?: boolean;
    format?: string;
    whenChanged?: (cbk: FrontendCBK, value?: any) => void | string;
    variableAutoComplete?: boolean;
    includeEmptyErrorPlaceholder?: boolean;
    optionsRef?: string;
}
interface KeyValueOptionProp {
    left: EditorField;
    right: EditorField;
}
interface OptionState {
    searchTerm?: string;
    selectedValue?: string;
}
interface ComponentOptionProps {
    label: string;
    value: string | number;
    defaultChecked?: boolean;
}
interface ValidatorProps {
    method: string;
    value?: string;
    message: string;
}
type blockType = "functional" | "frontend";

declare class DateCalc {
    schema: BaseSchema;
}

declare class SetVariable {
    schema: BaseSchema;
}

declare class Sharepoint {
    schema: BaseSchema;
}

declare class Triage {
    schema: BaseSchema;
}

declare class Ticket {
    schema: BaseSchema;
}

export { DateCalc, SetVariable, Sharepoint, Ticket, Triage };

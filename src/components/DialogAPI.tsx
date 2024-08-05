import { EventEmitter } from 'events';
import React, { createContext, ReactNode, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export enum DialogType {
    ALERT = "ALERT",
    CONFIRM = "CONFIRM",
    PROMPT = "PROMPT",
    CONTENT = "CONTENT"
}

export enum DialogResponseType {
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}

export type DialogAPIInputData = {
    type: DialogType.ALERT,
    icon?: IconSource,
    title: string,
    description: string,
    dismissable?: boolean
} | {
    type: DialogType.CONFIRM,
    icon?: IconSource,
    title: string,
    description: string,
    cancelTitle?: string,
    confirmTitle?: string,
    dismissable?: boolean
} | {
    type: DialogType.PROMPT,
    promptType?: "text" | "number",
    promptMode?: "flat" | "outlined",
    icon?: IconSource,
    title?: string,
    description?: string,
    label?: string,
    defaultValue?: string,
    cancelTitle?: string,
    confirmTitle?: string,
    dismissable?: boolean
} | {
    type: DialogType.CONTENT,
    icon?: IconSource,
    title: string,
    content: ReactNode,
    buttons?: ReactNode,
    dismissable?: boolean
}

export interface DialogAPI {
    on(event: 'new', listener: () => void): this;
    on(event: 'close', listener: () => void): this;
}

let ctx = createContext({
    closeWithData: (value?: string) => { value },
    setButtons: () => { },
    closeDialog: () => { }
})
export const useDialogCTX = () => React.useContext(ctx);


function ConstructedDialog(props: {
    data: DialogAPIInputData;
    callback: (value?: string) => void;
}) {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(true);
    const [value, setValue] = React.useState(props.data.type === DialogType.PROMPT ? ((props.data as any).defaultValue ?? '') : '');
    const [buttonList, setButtonList] = React.useState<JSX.Element[]>([]);

    const closeWithData = useCallback((value?: string) => {
        props.callback(value);
        setOpen(false);
    }, []);

    const setButtons = useCallback((button?: JSX.Element[]) => {
        setButtonList(button ?? []);
    }, []);

    const closeDialog = () => {
        closeWithData();
    }

    const ctxData = React.useMemo(() => ({
        closeWithData,
        setButtons,
        closeDialog
    }), [closeWithData, props]);

    return (
        <ctx.Provider value={ctxData}>
            <Portal>
                <Dialog style={{ maxHeight: 0.6 * Dimensions.get('window').height }} visible={open} onDismiss={() => closeDialog()} dismissable={props.data.dismissable}>
                    {props.data.icon ? <>
                        <Dialog.Icon icon={props.data.icon ?? "alert"} />
                        <Dialog.Title style={{ textAlign: "center" }}>{props.data.title}</Dialog.Title>
                    </> : props.data.title ? <Dialog.Title>{props.data.title}</Dialog.Title> : <Dialog.Title>Alert</Dialog.Title>}
                    {(props.data.type === DialogType.ALERT || props.data.type === DialogType.CONFIRM) ? <>
                        <Dialog.Content>
                            <Text variant="bodyMedium">{props.data.description}</Text>
                        </Dialog.Content>
                    </> : props.data.type === DialogType.PROMPT ? <>
                        <Dialog.Content>
                            {props.data.description && <Text variant="bodyMedium">{props.data.description}</Text>}
                            <TextInput
                                label={props.data.label}
                                style={{ marginTop: 10 }}
                                mode={props.data.promptMode ?? "outlined"}
                                inputMode={props.data.promptType === "number" ? "numeric" : "text"}
                                value={value}
                                onChangeText={(text) => setValue(text)}
                            />
                        </Dialog.Content>
                    </> : props.data.type === DialogType.CONTENT ? <>
                        <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                                {props.data.content}
                            </ScrollView>
                        </Dialog.ScrollArea>
                    </> : null}
                    <Dialog.Actions>
                        {props.data.type === DialogType.ALERT ? (
                            <Button onPress={() => closeDialog()}>{t('ok')}</Button>
                        ) : (props.data.type === DialogType.CONFIRM || props.data.type === DialogType.PROMPT) ? (
                            <>
                                <Button onPress={() => closeWithData(DialogResponseType.CANCELLED)}>{props.data.cancelTitle ?? t('cancel')}</Button>
                                <Button onPress={() => closeWithData(props.data.type === DialogType.PROMPT ? value : DialogResponseType.CONFIRMED)}>{props.data.confirmTitle ?? t('confirm')}</Button>
                            </>
                        ) : (props.data.type === DialogType.CONTENT && props.data.buttons) ? props.data.buttons : <Button onPress={() => closeWithData(DialogResponseType.CANCELLED)}>{t('ok')}</Button>}
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ctx.Provider>
    )
}

export class DialogAPI extends EventEmitter {
    dialogQueue: { data: DialogAPIInputData, callback: (value?: string) => void }[] = [];

    constructor() {
        super();
    }

    show(data: DialogAPIInputData) {
        return new Promise<string | undefined>((resolve) => {
            this.dialogQueue.push({ data, callback: resolve });
            this.emit('new');
        });
    }

    close() {
        this.dialogQueue.shift();
        this.emit('close');
    }

    constructElement(data: DialogAPIInputData, callback: (value?: string) => void) {
        return <ConstructedDialog data={data} callback={callback} key={"dialogapi-" + Math.random()} />;
    }
}

const api = new DialogAPI();
export default api;


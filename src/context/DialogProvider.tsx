import { ReactNode, useEffect, useState } from "react";
import DialogAPI, { DialogAPIInputData } from "../components/DialogAPI";

export function DialogProvider({ children }: { children: ReactNode }) {
    const [dialogDisplay, setDialogDisplay] = useState<React.ReactNode>(null);

    useEffect(() => {
        let dialogRunning = false;
        DialogAPI.on('new', async () => {
            if (dialogRunning) return;
            dialogRunning = true;

            let data: { data: DialogAPIInputData, callback: (value?: string) => void } | undefined;
            while (data = DialogAPI.dialogQueue.shift()) {
                setDialogDisplay(null);

                let promiseResolve: (value?: string) => void,
                    promise = new Promise<string | undefined>(resolve => promiseResolve = resolve);
                const element = DialogAPI.constructElement(data.data, (value?: string) => {
                    promiseResolve(value);
                });

                setDialogDisplay(element);

                const result = await promise;

                data.callback(result);
            }

            dialogRunning = false;
        });

        DialogAPI.on('close', () => {
            setDialogDisplay(null);
            dialogRunning = false;
        });
    }, []);

    return (
        <>
            {children}
            {dialogDisplay}
        </>
    )
}
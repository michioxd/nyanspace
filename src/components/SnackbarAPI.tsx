import { createContext, ReactNode, useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { Props, Snackbar } from "react-native-paper";
import { $RemoveChildren } from "react-native-paper/lib/typescript/types";
import { ForwardRefComponent } from "react-native-paper/lib/typescript/utils/forwardRef";
import { SnackbarContext } from "../context/SnackbarContext";

export interface SnackbarDataType {
    content: string,
    duration?: number,
    action?: ($RemoveChildren<ForwardRefComponent<View, Props>> & {
        label: string;
    })
}

export default function SnackbarContainer({ children }: { children: ReactNode }) {

    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarData, setSnackbarData] = useState<SnackbarDataType>({
        content: "",
        duration: 7000,
        action: undefined
    })

    const props = {
        show: useCallback((ct: SnackbarDataType) => {
            if (showSnackbar) setShowSnackbar(false);
            setSnackbarData(ct);
            setShowSnackbar(true);
        }, [showSnackbar]),
        hide: () => setShowSnackbar(false)
    }

    return (
        <>
            <SnackbarContext.Provider value={props}>
                {children}
                <Snackbar
                    visible={showSnackbar}
                    duration={snackbarData.duration ?? 7000}
                    onDismiss={() => setShowSnackbar(false)}
                    action={snackbarData.action}
                >
                    {snackbarData.content}
                </Snackbar>
            </SnackbarContext.Provider>
        </>
    )
}
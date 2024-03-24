import { createContext, useContext } from "react";
import { SnackbarDataType } from "../components/SnackbarAPI";

export const SnackbarContext = createContext<{
    show: (ct: SnackbarDataType) => void;
    hide: () => void;
} | null>(null);

export const useSnackbar = () => useContext(SnackbarContext);
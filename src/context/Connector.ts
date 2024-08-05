import type SSHClient from "@dylankenneally/react-native-ssh-sftp";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export interface ConnectorType {
    client: SSHClient | null;
    connected: boolean;
    connecting: boolean;
    closeClient: () => void;
    serverSelected: string | null;
    setServerSelected: Dispatch<SetStateAction<string | null>>
}

export const ConnectorContext = createContext<ConnectorType | null>(null);

export const useConnector = () => useContext(ConnectorContext);

export const nulledServerSelect = "_-null-_";
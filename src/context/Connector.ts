import type SSHClient from "@dylankenneally/react-native-ssh-sftp";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const ConnectorContext = createContext<{
    client: SSHClient | null;
    connected: boolean;
    connecting: boolean;
    serverSelected: string | null;
    setServerSelected: Dispatch<SetStateAction<string | null>>
} | null>(null);

export const useConnector = () => useContext(ConnectorContext);

export const nulledServerSelect = "_-null-_";
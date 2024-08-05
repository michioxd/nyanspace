import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ConnectorContext, nulledServerSelect } from "../context/Connector";
import SSHClient, { PtyType } from "@dylankenneally/react-native-ssh-sftp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LISTING_KEY, SELECTED_KEY } from "../utils/def";
import { useSnackbar } from "../context/SnackbarContext";
import { useTranslation } from "react-i18next";
import { initialCommand } from "../utils/initialCommand";

export default function ConnectorContainer({ children }: { children: ReactNode }) {
    const [connected, setConnected] = useState(false);
    const snackbar = useSnackbar();
    const { t } = useTranslation();
    const [serverSelected, setServerSelected] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(true);
    const client = useRef<SSHClient | null>(null);

    useEffect(() => {
        (async () => {
            const lastData = await AsyncStorage.getItem(SELECTED_KEY);
            setServerSelected(lastData === nulledServerSelect ? null : lastData);
        })();
    }, []);

    const closeClient = useCallback(() => {
        if (client.current !== null) {
            client.current.closeShell();
            client.current.disconnect();
            client.current = null;

        }
        setConnected(false);
    }, [client.current]);

    useEffect(() => {
        (async () => {
            closeClient();

            if (serverSelected === null) return;
            setConnecting(true);

            const lastData = await AsyncStorage.getItem(LISTING_KEY);
            const listing = (JSON.parse(lastData ?? "{}") ?? {}) as ServerList;

            if (listing[serverSelected]) {
                const selected = listing[serverSelected];
                try {
                    if (selected.privateKey.length > 10) {
                        client.current = await SSHClient.connectWithKey(
                            selected.address,
                            selected.port,
                            selected.username,
                            selected.privateKey
                        )
                    } else {
                        client.current = await SSHClient.connectWithPassword(
                            selected.address,
                            selected.port,
                            selected.username,
                            selected.password
                        )
                    }
                    console.log("Connected to " + selected.address, client.current);
                    const checkShell = await client.current.execute(`echo $0`);
                    console.log(checkShell);
                    if (/bash/g.test(checkShell) === false) {
                        snackbar?.show({ content: t('shell_not_supported') + ` (yourShell: ${checkShell.trim()})` });
                        setServerSelected(null);
                        return;
                    }
                    await client.current.startShell(PtyType.VANILLA);
                    await client.current.execute(initialCommand);
                    setConnected(true);
                } catch (e) {
                    console.error(e);
                    snackbar?.show({ content: t('cannot_connect_to_server') });
                } finally {
                    setConnecting(false);
                }
            } else {
                setConnecting(false);
                snackbar?.show({ content: t('invalid_saved_server') });
                setServerSelected(null);
            }
        })();

        (async () => {
            try {
                await AsyncStorage.setItem(SELECTED_KEY, serverSelected === null ? nulledServerSelect : serverSelected);
            } catch (e) {

            }
        })();
    }, [serverSelected]);

    const exportValue = {
        client: client.current,
        connected: connected,
        connecting: connecting,
        closeClient: closeClient,
        serverSelected: serverSelected,
        setServerSelected: setServerSelected
    }

    return (
        <>
            <ConnectorContext.Provider value={exportValue}>
                {children}
            </ConnectorContext.Provider>
        </>
    )
}
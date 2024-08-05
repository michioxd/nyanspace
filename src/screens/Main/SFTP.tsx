import { Header } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, View } from "react-native";
import { ActivityIndicator, IconButton, List, ProgressBar, Text, useTheme } from "react-native-paper";
import { useConnector } from "../../context/Connector";
import ConnectorState from "../../components/ConnectorState";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LsResult } from "@dylankenneally/react-native-ssh-sftp";
import { fileTypeIcon, formatData } from "../../utils/utils";
import DialogAPI, { DialogType, useDialogCTX } from "../../components/DialogAPI";
import { useSnackbar } from "../../context/SnackbarContext";

const FileActionDialog = ({ rename }: { rename: () => void }) => {
    const { t } = useTranslation();
    return (
        <List.Section>
            <List.Item
                title={t('download_file')}
                left={() => <List.Icon icon="download" />}
                onPress={() => {
                    DialogAPI.close();
                }}
            />
            <List.Item
                title={t('open_with_text_editor')}
                left={() => <List.Icon icon="code-tags" />}
                onPress={() => {

                }}
            />
            <List.Item
                title={t('rename_file')}
                left={() => <List.Icon icon="folder-edit" />}
                onPress={() => {
                    DialogAPI.close();
                    rename();
                }}
            />
        </List.Section>
    )
}


export default function ScreenMainSFTP() {
    const { t } = useTranslation();
    const snackbar = useSnackbar();
    const theme = useTheme();
    const conn = useConnector();
    const [currentPath, setCurrentPath] = useState("/");
    const [fetchedCurrentPath, setFetchedCurrentPath] = useState("/");
    const [ls, setLs] = useState<LsResult[]>([]);
    const [fetching, setFetching] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(0);

    const handleRenameFIle = useCallback(async (path: string, currentName: string, isDir: boolean) => {
        const newName = await DialogAPI.show({
            type: DialogType.PROMPT,
            title: isDir ? t('rename_folder') : t('rename_file'),
            defaultValue: currentName
        })
    }, []);

    const handleFilePress = useCallback((file: LsResult) => {
        DialogAPI.show({
            type: DialogType.CONTENT,
            title: t('file_options'),
            content: <FileActionDialog rename={() => {
                handleRenameFIle(currentPath, file.filename.replace(/\/$/, ''), file.isDirectory);
            }} />
        })
    }, []);

    useEffect(() => {
        if (!conn?.client || !conn?.connected) {
            setLs([]);
            setCurrentPath("/");
            setFetchedCurrentPath("/");
            return;
        };

        (async () => {
            if (!conn?.client) return;

            try {
                setFetching(true);
                const lsRef = await conn.client.sftpLs(currentPath || '/');
                setLs(lsRef);
                setFetchedCurrentPath(currentPath);
            } catch (e) {
                snackbar?.show({ content: t('cannot_fetch_files') + ": " + e });
            } finally {
                setFetching(false);
            }
        })();

    }, [conn, currentPath, forceRefresh]);

    const sortedLs = useMemo(() => {
        return ls.sort((a, b) => {
            if (a.isDirectory && !b.isDirectory) return -1;
            if (!a.isDirectory && b.isDirectory) return 1;
            if (a.filename < b.filename) return -1;
            if (a.filename > b.filename) return 1;
            return 0;
        });
    }, [ls]);

    return (
        <>
            <Header title={t('files')} headerStyle={{ backgroundColor: theme.colors.elevation.level2 }}
                headerRight={() => <>
                    {fetching ? <ActivityIndicator size="small" style={{ marginRight: 15 }} /> : <IconButton onPress={() => setForceRefresh(i => i + 1)} icon="refresh" />}
                </>}
            />

            <ConnectorState dataDone={true}>
                <ScrollView style={{ width: '100%', height: '100%', backgroundColor: theme.colors.background, flex: 1 }}
                    refreshControl={
                        <RefreshControl refreshing={fetching} onRefresh={() => {
                            setFetching(true);
                            setForceRefresh(p => p + 1)
                        }} />
                    }
                >
                    <List.Section>
                        {(fetchedCurrentPath !== '/') && <List.Item
                            title="..."
                            left={() => <List.Icon style={{ marginLeft: 15 }} icon="folder-outline" />}
                            onPress={() => {
                                setCurrentPath(currentPath.split('/').slice(0, -1).join('/') || "/");
                            }}
                        />}
                        {sortedLs.map((item, index) => (
                            <List.Item
                                key={index}
                                title={item.filename.replace(/\/$/, '')}
                                description={
                                    <Text style={{ fontSize: 10, color: 'gray' }}>
                                        {formatData(item.fileSize)} - {(new Date(parseInt(item.lastAccess) * 1000)).toLocaleString()}
                                    </Text>
                                }
                                left={() => <List.Icon style={{ marginLeft: 15 }} icon={item.isDirectory ? "folder" : fileTypeIcon(item.filename)} />}
                                onPress={() => {
                                    if (item.isDirectory) setCurrentPath((currentPath !== '/' ? currentPath : '') + '/' + item.filename.replace(/\/$/, ''));
                                    else handleFilePress(item);
                                }}
                            />
                        ))}
                    </List.Section>
                </ScrollView>
            </ConnectorState>
        </>
    )
}
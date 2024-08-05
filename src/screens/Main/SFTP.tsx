import { Header } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, View } from "react-native";
import { ActivityIndicator, IconButton, List, ProgressBar, Text, TouchableRipple, useTheme } from "react-native-paper";
import { useConnector } from "../../context/Connector";
import ConnectorState from "../../components/ConnectorState";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LsResult } from "@dylankenneally/react-native-ssh-sftp";
import { crPath, fileTypeIcon, formatData, validateFileName } from "../../utils/utils";
import DialogAPI, { DialogResponseType, DialogType, useDialogCTX } from "../../components/DialogAPI";
import { useSnackbar } from "../../context/SnackbarContext";

const FileActionDialog = ({ rename, remove }: { rename: () => void, remove: () => void }) => {
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
                title={t('rename')}
                left={() => <List.Icon icon="file-edit" />}
                onPress={() => {
                    DialogAPI.close();
                    rename();
                }}
            />
            <List.Item
                title={t('remove_file')}
                left={() => <List.Icon icon="trash-can" />}
                onPress={() => {
                    DialogAPI.close();
                    remove();
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

    const handleOpenFileTree = useCallback(() => {
        DialogAPI.show({
            type: DialogType.CONTENT,
            title: t('file_tree'),
            content: <List.Section>
                <List.Item
                    title={'/'}
                    onPress={() => setCurrentPath(
                        '/'
                    )}
                    left={() => <List.Icon icon="home" />}
                />
                {currentPath.split('/').map((item, index) => item && (
                    <List.Item
                        key={index}
                        title={item}
                        left={() => <List.Icon icon={(index + 1 === currentPath.split('/').length) ? "folder" : "folder-outline"} />}
                        onPress={() => {
                            setCurrentPath(currentPath.split('/').slice(0, index + 1).join('/'))
                            DialogAPI.close();
                        }}
                    />
                ))}
            </List.Section>
        })
    }, [currentPath]);

    const handleRenameFile = useCallback(async (path: string, currentName: string, isDir: boolean) => {
        const newName = await DialogAPI.show({
            type: DialogType.PROMPT,
            title: t('rename'),
            defaultValue: currentName
        });

        if (newName === DialogResponseType.CANCELLED) return;

        if (!newName) return;

        if (newName === currentName) return

        if (!validateFileName(newName)) {
            snackbar?.show({ content: t('invalid_file_name') });
            return;
        }

        try {
            setFetching(true);
            await conn?.client?.sftpRename(crPath(path, currentName), crPath(path, newName));
        } catch (e) {
            snackbar?.show({ content: t('cannot_rename_file') + ": " + e });
        } finally {
            setForceRefresh(p => p + 1);
        }

    }, []);

    const handleDeleteFile = useCallback(async (path: string, currentName: string, isDir: boolean) => {
        const res = await DialogAPI.show({
            type: DialogType.CONFIRM,
            icon: 'trash-can',
            title: t('remove_file'),
            description: t('remove_file_confirm') + ' (' + currentName + ')'
        });

        if (res !== DialogResponseType.CONFIRMED) return;

        try {
            setFetching(true);
            await conn?.client?.sftpRm(crPath(path, currentName));
        } catch (e) {
            snackbar?.show({ content: t('cannot_remove_file') + ": " + e });
        } finally {
            setForceRefresh(p => p + 1)
            snackbar?.show({ content: t('file_removed') });
        }
    }, []);

    const handleFilePress = useCallback((file: LsResult) => {
        DialogAPI.show({
            type: DialogType.CONTENT,
            title: t('file_options'),
            content: <FileActionDialog
                rename={() => {
                    handleRenameFile(fetchedCurrentPath, file.filename.replace(/\/$/, ''), file.isDirectory);
                }}
                remove={async () => {
                    handleDeleteFile(fetchedCurrentPath, file.filename.replace(/\/$/, ''), file.isDirectory);
                }}
            />
        })
    }, [fetchedCurrentPath]);

    useEffect(() => {
        console.log("useEffect", conn?.client, currentPath, forceRefresh);
        if (!conn?.client || !conn?.connected) {
            return;
        };

        (async () => {
            if (!conn?.client) return;

            try {
                setFetching(true);
                await conn.client.connectSFTP();
                const lsRef = await conn.client.sftpLs(currentPath || '/');
                setLs(lsRef);
                setFetchedCurrentPath(currentPath);
            } catch (e) {
                snackbar?.show({ content: t('cannot_fetch_files') + ": " + e });
            } finally {
                setFetching(false);
            }
        })();

    }, [currentPath, forceRefresh]);

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
                headerRight={() => <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <IconButton disabled={fetching} onPress={() => handleOpenFileTree()} icon="file-tree" />
                    <IconButton disabled={fetching} onPress={() => setForceRefresh(i => i + 1)} icon="magnify" />
                </View>}
            />
            <ConnectorState dataDone={true}>
                <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
                    <TouchableRipple onPress={handleOpenFileTree}>
                        <Text style={{ padding: 5, paddingBottom: 0 }} variant="bodySmall">{currentPath}</Text>
                    </TouchableRipple>
                    <ScrollView style={{ flex: 1 }}
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
                                        if (item.isDirectory) setCurrentPath(crPath(fetchedCurrentPath, item.filename.replace(/\/$/, '')));
                                        else handleFilePress(item);
                                    }}
                                />
                            ))}
                        </List.Section>
                    </ScrollView>
                </View>
            </ConnectorState>
        </>
    )
}
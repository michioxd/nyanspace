import { Header } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
import { BackHandler, RefreshControl, ScrollView, ToastAndroid, View } from "react-native";
import { IconButton, List, Text, TouchableRipple, useTheme } from "react-native-paper";
import { useConnector } from "../../context/Connector";
import ConnectorState from "../../components/ConnectorState";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LsResult } from "@dylankenneally/react-native-ssh-sftp";
import { crPath, fileTypeIcon, formatData, validateFileName } from "../../utils/utils";
import DialogAPI, { DialogResponseType, DialogType } from "../../components/DialogAPI";
import { useSnackbar } from "../../context/SnackbarContext";
import { useScrollToTop } from "@react-navigation/native";
import notifee, { EventType } from '@notifee/react-native';
import Notification from "../../core/notify";
import RNFS from 'react-native-fs';

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
    const lsRef = useRef<ScrollView>(null);
    const [downloading, setDownloading] = useState(false);
    useScrollToTop(lsRef);

    const handleFileDownload = useCallback(async (path: string, fileName: string) => {
        if (!conn?.client || !conn?.connected) {
            snackbar?.show({ content: t('not_connected_please_reconnect') });
            return;
        };

        if (await RNFS.exists('/storage/emulated/0/Download/' + fileName)) {
            const res = await DialogAPI.show({
                type: DialogType.CONFIRM,
                icon: 'alert',
                title: t('download_file'),
                description: t('file_already_exists_continue') + ' (' + fileName + ')'
            });

            if (res !== DialogResponseType.CONFIRMED) return;
        }

        const channelId = await Notification();

        notifee.displayNotification({
            title: t('downloading'),
            body: '/storage/emulated/0/Download/' + fileName,
            android: {
                channelId,
                asForegroundService: true,
                actions: [
                    {
                        title: t('cancel'),
                        pressAction: {
                            id: 'cancel_download',
                        },
                    },
                ],
                progress: {
                    indeterminate: true
                }
            },
        });


        notifee.registerForegroundService((notification) => {
            return new Promise(() => {
                (async () => {
                    if (!conn?.client || !conn?.connected) {
                        await notifee.stopForegroundService();
                        return;
                    }
                    setDownloading(true);
                    ToastAndroid.showWithGravity(
                        t('downloading') + ' ' + fileName,
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                    );
                    conn.client.sftpDownload(path, '/storage/emulated/0/Download/' + fileName).then(async () => {
                        await notifee.stopForegroundService();
                        notifee.displayNotification({
                            title: t('download_completed'),
                            body: t('downloaded_to') + ' /storage/emulated/0/Download/' + fileName,
                            android: {
                                channelId,
                            }
                        });
                    }).catch(async e => {
                        setDownloading(false);
                        await notifee.displayNotification({
                            title: t('download_failed'),
                            body: t('cannot_download_file') + ' ' + fileName,
                            android: {
                                channelId,
                            }
                        });
                        snackbar?.show({ content: t('cannot_download_file') });
                    });

                    conn.client.on('DownloadProgress', (progress) => {
                        notifee.displayNotification({
                            id: notification.id,
                            title: notification.title,
                            body: notification.body,
                            android: {
                                ...notification.android,
                                progress: {
                                    indeterminate: false,
                                    max: 100,
                                    current: parseInt(progress),
                                },
                            },
                        });
                    });

                    notifee.onForegroundEvent(async ({ type, detail }) => {
                        if (!detail.pressAction) return;

                        if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'cancel_download') {
                            conn.client?.sftpCancelDownload();
                            await notifee.stopForegroundService();
                        }
                    });
                })();
            });
        });

    }, [conn?.client, conn?.connected]);

    const handleOpenFileTree = useCallback(() => {
        DialogAPI.show({
            type: DialogType.CONTENT,
            title: t('file_tree'),
            content: <List.Section>
                <List.Item
                    title={'/'}
                    onPress={() => {
                        setCurrentPath('/');
                        DialogAPI.close();
                    }}
                    left={() => <List.Icon icon="home" />}
                />
                {fetchedCurrentPath.split('/').map((item, index) => item && (
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
    }, [fetchedCurrentPath]);

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
            content: <List.Section>
                <List.Item
                    title={t('download_file')}
                    left={() => <List.Icon icon="download" />}
                    description={downloading ? t('wait_for_another_download_finish') : null}
                    disabled={downloading}
                    onPress={() => {
                        DialogAPI.close();
                        handleFileDownload(crPath(fetchedCurrentPath, file.filename.replace(/\/$/, '')), file.filename.replace(/\/$/, ''));
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
                        handleRenameFile(fetchedCurrentPath, file.filename.replace(/\/$/, ''), file.isDirectory);
                    }}
                />
                <List.Item
                    title={t('remove_file')}
                    left={() => <List.Icon icon="trash-can" />}
                    onPress={() => {
                        DialogAPI.close();
                        handleDeleteFile(fetchedCurrentPath, file.filename.replace(/\/$/, ''), file.isDirectory);
                    }}
                />
            </List.Section>
        })
    }, [fetchedCurrentPath]);

    const handleFolderPress = useCallback((folder: LsResult) => {

    }, []);



    useEffect(() => {
        if (!conn?.client || !conn?.connected) {
            return;
        };

        (async () => {
            if (!conn?.client) return;

            try {
                setFetching(true);
                await conn.client.connectSFTP();
                const lsRes = await conn.client.sftpLs(currentPath || '/');
                setLs(lsRes);
                lsRef.current?.scrollTo({ y: 0 });
                setFetchedCurrentPath(currentPath);
            } catch (e) {
                snackbar?.show({ content: t('cannot_fetch_files') + ": " + e });
            } finally {
                setFetching(false);
            }
        })();

    }, [currentPath, forceRefresh]);

    const handleBackDir = useCallback(() => {
        setCurrentPath(fetchedCurrentPath.split('/').slice(0, -1).join('/') || "/");
        return true;
    }, [fetchedCurrentPath]);

    useEffect(() => {
        if (fetchedCurrentPath === '/') return;
        const backHdl = BackHandler.addEventListener('hardwareBackPress', handleBackDir);

        return () => backHdl.remove();
    }, [fetchedCurrentPath]);

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
                        <Text style={{ padding: 5, paddingBottom: 0 }} variant="bodySmall">{fetchedCurrentPath}</Text>
                    </TouchableRipple>
                    <ScrollView style={{ flex: 1 }}
                        ref={lsRef}
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
                                    handleBackDir();
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
                                    onLongPress={() => {
                                        if (item.isDirectory) handleFolderPress(item);
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
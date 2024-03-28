import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Divider, FAB, Icon, IconButton, List, Portal, RadioButton, Text } from "react-native-paper";
import { navigate, useNavigation } from "../utils/navigate";
import { useCallback, useEffect, useState } from "react";
import { LISTING_KEY } from "../utils/def";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import DialogAPI, { DialogResponseType, DialogType } from "../components/DialogAPI";
import { useSnackbar } from "../context/SnackbarContext";
import { useFocusEffect } from "@react-navigation/native";
import useDidMountEffect from "../hooks/firstRender";
import { nulledServerSelect, useConnector } from "../context/Connector";

export default function ScreenSelectServer() {
    const navi = useNavigation();
    const conn = useConnector();
    const [listServer, setListServer] = useState<ServerList>({});
    const [forceUpdate, setForceUpdate] = useState(0);
    const snackbar = useSnackbar();
    const { t } = useTranslation();

    const handleDeleteServer = useCallback(async (i: string) => {
        if (!listServer[i]) return;

        const ask = await DialogAPI.show({
            type: DialogType.CONFIRM,
            title: t('delete_this_server'),
            description: t('delete_this_server_desc') + ` (${listServer[i].name})`,
            icon: "alert"
        });

        if (ask === DialogResponseType.CONFIRMED) {
            try {
                const lastData = await AsyncStorage.getItem(LISTING_KEY);
                const data = (JSON.parse(lastData ?? "{}") ?? {}) as ServerList;

                if (!data[i]) return;
                delete data[i];
                await AsyncStorage.setItem(LISTING_KEY, JSON.stringify(data));

                snackbar?.show({ content: t('deleted_server') });
                setForceUpdate(i => i + 1);
            } catch (e) {
                console.error(e);
                snackbar?.show({ content: t('cannot_delete_server') });
            }
        }
    }, [listServer]);

    const handleUpdateList = async () => {
        const lastData = await AsyncStorage.getItem(LISTING_KEY);
        setListServer((JSON.parse(lastData ?? "{}") ?? {}) as ServerList);
    };

    const handleSelectServer = (s: string | null) => {
        conn?.setServerSelected(s);
        navi.goBack();
    }

    useDidMountEffect(() => {
        handleUpdateList();
    }, [forceUpdate]);

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = handleUpdateList();
            return () => unsubscribe;
        }, [])
    );

    return (
        <>
            <ScrollView style={{ width: '100%', height: '100%' }}>
                <List.Section>
                    <List.Item
                        title={t('none')}
                        onPress={() => handleSelectServer(null)}
                        style={conn?.serverSelected === null && { backgroundColor: "rgba(128,128,128,0.1)" }}
                    />
                    {Object.entries(listServer).map((d, i) => (
                        <List.Item
                            key={i}
                            title={d[1].name}
                            style={conn?.serverSelected === d[0] && { backgroundColor: "rgba(128,128,128,0.1)" }}
                            description={d[0] + " - " + d[1].address}
                            onLongPress={() => handleDeleteServer(d[0])}
                            onPress={() => handleSelectServer(d[0])}
                            right={(prop) => <IconButton onPress={() => {
                                navigate('AddServer', { serverEditData: d })
                            }} icon="pencil" {...prop} />}
                        />
                    ))}
                </List.Section>
                <Divider />
                <View style={{ flex: 1, flexDirection: 'row', margin: 8 }}>
                    <Icon color="gray" size={30} source="information-outline" />
                    <Text variant="bodySmall" style={{ color: "gray", margin: 8 }}>{t('hold_an_item_to_delete')}</Text>
                </View>
            </ScrollView>
            <FAB onPress={() => navigate('AddServer')} style={styles.fabStyle} icon="plus" />
        </>
    )
}

const styles = StyleSheet.create({
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
    },
});
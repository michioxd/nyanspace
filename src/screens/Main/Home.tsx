import { Header } from "@react-navigation/elements";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { navigate } from "../../utils/navigate";

import NoServerSelected from "./components/NoServerSelected";
import MainConnecting from "./components/Connecting";
import { useConnector } from "../../context/Connector";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabScreen, TabsProvider } from "react-native-paper-tabs";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { INTERVAL_KEY } from "../../utils/def";
import HomeDashboard from "./components/Home/Dashboard";
import { ServerStats } from "../../types/Stats";
import HomeCPU from "./components/Home/CPU";

export default function ScreenMainHome() {
    const theme = useTheme();
    const conn = useConnector();
    const { t } = useTranslation();
    const [data, setData] = useState<ServerStats | null>(null);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollViewContainer: {
            padding: 16,
            flex: 1,
            backgroundColor: theme.colors.background
        }
    }), [theme]);

    useEffect(() => {
        if (conn?.client && conn.connected) {
            conn?.client.on('Shell', (event) => {
                if (event) {
                    const s = String(event);
                    if (s.substring(0, 36) == "|__BEGIN_NYANSPACE_SERVER_CONTENT__|" && s.substring(s.length - 35) == "|__END_NYANSPACE_SERVER_CONTENT__|\n") {
                        const phase1 = s.slice(36);
                        const final = phase1.substring(0, phase1.length - 35);
                        setData(JSON.parse(final) as ServerStats);
                    }
                }
            });
            (async () => {
                const interval = await AsyncStorage.getItem(INTERVAL_KEY);
                if (conn.client && conn.connected)
                    conn?.client.writeToShell(" /bin/bash ~/.nyanspace/.nyanspace.sh " + (interval ?? "1") + "\n");
            })();
        } else {
            setData(null);
        }
    }, [conn?.connected]);

    return (
        <>
            <Header title="nyanspace" headerRight={() => <IconButton onPress={() => navigate("SelectServer")} icon="server" />} />
            <View style={{ flex: 1 }}>
                {conn?.serverSelected === null ? <View style={styles.container}>
                    <NoServerSelected />
                </View> : (conn?.connecting || data === null) ? <View style={styles.container}>
                    <MainConnecting />
                </View> : <>
                    <TabsProvider
                        defaultIndex={0}
                    >
                        <Tabs
                            uppercase={true}
                            style={{ backgroundColor: "transparent" }}
                            mode="scrollable"
                        >
                            <TabScreen label={t('dashboard')}>
                                <ScrollView style={styles.scrollViewContainer}>
                                    <HomeDashboard d={data} />
                                </ScrollView>
                            </TabScreen>
                            <TabScreen label={t('cpu')}>
                                <ScrollView style={styles.scrollViewContainer}>
                                    <HomeCPU d={data} />
                                </ScrollView>
                            </TabScreen>
                            <TabScreen label={t('storage')}>
                                <ScrollView style={styles.scrollViewContainer}>
                                    <Text>storage</Text>
                                </ScrollView>
                            </TabScreen>
                            <TabScreen label={t('network')}>
                                <ScrollView style={styles.scrollViewContainer}>
                                    <Text>Network</Text>
                                </ScrollView>
                            </TabScreen>
                            <TabScreen label={t('temperature')}>
                                <ScrollView style={styles.scrollViewContainer}>
                                    <Text>temperature</Text>
                                </ScrollView>
                            </TabScreen>
                            <TabScreen label={t('summary')}>
                                <ScrollView style={styles.scrollViewContainer}>
                                    <Text>Summary</Text>
                                </ScrollView>
                            </TabScreen>
                        </Tabs>
                    </TabsProvider>
                </>}
            </View >
        </>
    )
}


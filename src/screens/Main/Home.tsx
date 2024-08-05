import { Header } from "@react-navigation/elements";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { navigate } from "../../utils/navigate";

import NoServerSelected from "./components/NoServerSelected";
import MainConnecting from "./components/Connecting";
import { useConnector } from "../../context/Connector";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabScreen, TabsProvider } from "react-native-paper-tabs";
import { useTranslation } from "react-i18next";
import HomeDashboard from "./components/Home/Dashboard";
import { ServerStats } from "../../types/Stats";
import HomeCPU from "./components/Home/CPU";
import HomeStorage from "./components/Home/Storage";
import HomeNetwork from "./components/Home/Network";
import HomeTemperature from "./components/Home/Temperature";
import ConnectorState from "../../components/ConnectorState";

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
        },
        scrollViewContainerNoPadding: {
            padding: 0,
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
            conn?.client.writeToShell(" /bin/bash ~/.nyanspace/.nyanspace.sh 1\n");
        } else {
            setData(null);
        }
    }, [conn?.connected]);

    return (
        <>
            <Header title="nyanspace" headerRight={() => <IconButton onPress={() => navigate("SelectServer")} icon="server" />} headerStyle={{ backgroundColor: theme.colors.elevation.level2 }} />
            <View style={{ flex: 1 }}>
                <ConnectorState dataDone={data !== null}>
                    {data !== null &&
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
                                        <HomeStorage d={data} />
                                    </ScrollView>
                                </TabScreen>
                                <TabScreen label={t('network')}>
                                    <ScrollView style={styles.scrollViewContainerNoPadding}>
                                        <HomeNetwork d={data} />
                                    </ScrollView>
                                </TabScreen>
                                <TabScreen label={t('temperature')}>
                                    <ScrollView style={styles.scrollViewContainerNoPadding}>
                                        <HomeTemperature d={data} />
                                    </ScrollView>
                                </TabScreen>
                            </Tabs>
                        </TabsProvider>
                    }
                </ConnectorState>
            </View >
        </>
    )
}


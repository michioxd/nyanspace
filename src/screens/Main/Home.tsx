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

const test: ServerStats = {
    hostname: "neko01-rpi",
    distro_name: "Ubuntu",
    distro_version: "22.04",
    kernel_version: "6.6.16-current-bcm2711",
    uptime: 190746.78,
    cpu: {
        name: "ARMv8 Processor rev 4 (v8l)",
        physical_cores: "0",
        logical_cores: "4",
        speed: "",
        architecture: "aarch64",
        cache_size: "",
        flags: ""
    },
    network: {
        ips: "10.0.0.227 10.168.1.1 fd14:cc6f:3072:0:78e8:95b6:c5a4:d514 2001:ee0:4552:c790::fa6 2001:ee0:4552:c790:c973:65a1:c0a9:7e18 2001:ee0:4552:c790:f746:bc85:7408:ea44 fd14:cc6f:3072:0:5c28:91ce:7ab5:93fb fd14:cc6f:3072::fa6 fd14:cc6f:3072:0:8cb7:a0de:e1ad:ecc2 fd14:cc6f:3072:0:b9a0:ae0b:2cb8:fe97 ",
        interfaces: [
            {
                name: "lo",
                state: "unknown",
                tx: 5193115,
                rx: 5193115
            },
            {
                name: "enxb827eb0252e1",
                state: "up",
                tx: 62191308,
                rx: 269107350
            },
            {
                name: "tap0",
                state: "unknown",
                tx: 4716,
                rx: 0
            }
        ]
    },
    stats: {
        cpu_usage: 0.746269,
        mem_total: 862020,
        mem_free: 264592,
        mem_buffers: 3708,
        mem_cached: 204368,
        mem_used: 389352
    },
    partitions: [
        {
            source: "tmpfs",
            fstype: "tmpfs",
            size: 88272896,
            used: 10047488,
            target: "/run"
        },
        {
            source: "/dev/mmcblk0p2",
            fstype: "ext4",
            size: 30760824832,
            used: 5448884224,
            target: "/"
        },
        {
            source: "tmpfs",
            fstype: "tmpfs",
            size: 441352192,
            used: 4096,
            target: "/dev/shm"
        },
        {
            source: "tmpfs",
            fstype: "tmpfs",
            size: 5242880,
            used: 0,
            target: "/run/lock"
        },
        {
            source: "tmpfs",
            fstype: "tmpfs",
            size: 441352192,
            used: 0,
            target: "/tmp"
        },
        {
            source: "/dev/mmcblk0p1",
            fstype: "vfat",
            size: 264288256,
            used: 70244864,
            target: "/boot/firmware"
        },
        {
            source: "/dev/sda1",
            fstype: "btrfs",
            size: 320070483968,
            used: 48144384,
            target: "/mnt/neko"
        },
        {
            source: "/dev/zram1",
            fstype: "ext4",
            size: 49111040,
            used: 23691264,
            target: "/var/log"
        },
        {
            source: "tmpfs",
            fstype: "tmpfs",
            size: 88268800,
            used: 4096,
            target: "/run/user/0"
        }
    ],
    temperatures: [
        {
            component: "hwmon0",
            temperature: 40
        }
    ]
}

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
                    conn?.client.writeToShell(" ~/.nyanspace/.nyanspace.sh " + (interval ?? "1") + "\n");
            })();
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
                                    <Text>system</Text>
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


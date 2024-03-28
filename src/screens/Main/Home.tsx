import { Header } from "@react-navigation/elements";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, TextInput, useTheme } from "react-native-paper";
import { navigate } from "../../utils/navigate";

import NoServerSelected from "./components/NoServerSelected";
import MainConnecting from "./components/Connecting";
import { useConnector } from "../../context/Connector";
import { useEffect, useState } from "react";

export default function ScreenMainHome() {
    const theme = useTheme();
    const conn = useConnector();

    const [input, setInput] = useState(" ~/.nyanspace/.nyanspace.sh 2");

    useEffect(() => {
        if (conn?.client && conn.connected) {
            conn?.client.on('Shell', (event) => {
                if (event) {
                    const s = String(event);
                    if (s.substring(0, 36) == "|__BEGIN_NYANSPACE_SERVER_CONTENT__|" && s.substring(s.length - 35) == "|__END_NYANSPACE_SERVER_CONTENT__|\n") {
                        const phase1 = s.slice(36);
                        const final = phase1.substring(0, phase1.length - 35);

                        console.log(final);
                    }
                }
            });
        }
    }, [conn?.connected]);

    return (
        <>
            <View style={{ flex: 1 }}>
                <Header title="nyanspace" headerRight={() => <IconButton onPress={() => navigate("SelectServer")} icon="server" />} />
                {conn?.serverSelected === null ? <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: theme.colors.background }}>
                    <NoServerSelected />
                    {/* <MainConnecting /> */}
                </View> : conn?.connecting ? <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: theme.colors.background }}>
                    <MainConnecting />
                </View> : <ScrollView style={{ flex: 1, width: '100%', height: '100%', backgroundColor: theme.colors.background }}>
                    <TextInput
                        value={input}
                        onChangeText={(text) => setInput(text)}
                        mode="outlined"
                    />
                    <Button onPress={() => conn?.client?.writeToShell(input + "\n")} mode="contained-tonal">write to shell</Button>
                </ScrollView>}

            </View >
        </>
    )
}
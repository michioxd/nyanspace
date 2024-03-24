import { Header } from "@react-navigation/elements";
import { Image, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { navigate } from "../../utils/navigate";


import { ScrollView } from "react-native-gesture-handler";
import NoServerSelected from "./components/NoServerSelected";

export default function ScreenMainHome() {
    const theme = useTheme();
    return (
        <>
            <View style={{ flex: 1 }}>
                <Header title="nyanspace" headerRight={() => <IconButton onPress={() => navigate("SelectServer")} icon="server" />} />
                <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: theme.colors.background }}>
                    <NoServerSelected />
                </View>
            </View >
        </>
    )
}
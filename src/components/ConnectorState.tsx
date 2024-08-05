import { ReactNode } from "react";
import { ConnectorType, useConnector } from "../context/Connector";
import NoServerSelected from "../screens/Main/components/NoServerSelected";
import { View } from "react-native";
import MainConnecting from "../screens/Main/components/Connecting";
import { useTheme } from "react-native-paper";

export default function ConnectorState({ children, dataDone }: { children: ReactNode, dataDone: boolean }) {
    const theme = useTheme();
    const conn = useConnector();

    return (
        <>
            {conn?.serverSelected === null ? <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
                <NoServerSelected />
            </View> : (conn?.connecting || !dataDone) ? <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
                <MainConnecting gatheringData={conn?.connecting === false && !dataDone} />
            </View> : children}
        </>
    )
}
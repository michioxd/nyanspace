import { Header } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useConnector } from "../../context/Connector";
import ConnectorState from "../../components/ConnectorState";

export default function ScreenMainSFTP() {
    const { t } = useTranslation();
    const theme = useTheme();
    const conn = useConnector();
    return (
        <>
            <Header title={t('files')} headerStyle={{ backgroundColor: theme.colors.elevation.level2 }} />

            <ConnectorState dataDone={true}>
                <ScrollView style={{ width: '100%', height: '100%', backgroundColor: theme.colors.background, flex: 1 }}>
                    <Text>{t('files')}</Text>
                </ScrollView>
            </ConnectorState>
        </>
    )
}
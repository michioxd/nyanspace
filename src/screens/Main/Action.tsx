import { Header } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function ScreenMainAction() {
    const { t } = useTranslation();
    const theme = useTheme();
    return (
        <>
            <Header title={t('action')} headerStyle={{ backgroundColor: theme.colors.elevation.level2 }} />
            <ScrollView style={{ width: '100%', height: '100%', backgroundColor: theme.colors.background }}>
                <Text>still hard working :)</Text>
            </ScrollView>
        </>
    )
}
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function MainConnecting() {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <>
            <View style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size={70} style={{ marginBottom: 20 }} color={theme.colors.primary} />
                <Text>{t('connecting')}</Text>
            </View>
        </>
    )
}
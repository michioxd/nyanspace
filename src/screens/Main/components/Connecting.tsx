import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function MainConnecting() {
    const { t } = useTranslation();

    return (
        <>
            <View style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator style={{ marginBottom: 20 }} animating={true} size={70} />
                <Text>{t('connecting')}</Text>
            </View>

        </>
    )
}
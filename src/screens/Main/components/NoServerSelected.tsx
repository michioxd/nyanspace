import { Image, View } from "react-native";
import NoImg from "./../../../assets/no.webp";
import { Button, Text } from "react-native-paper";
import { navigate } from "../../../utils/navigate";
import { useTranslation } from "react-i18next";

export default function NoServerSelected() {
    const { t } = useTranslation();
    return (
        <View style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Image source={NoImg} style={{ width: 120, height: 120, marginBottom: 20, marginLeft: 15 }} />
            <Text>{t('no_server_selected')}</Text>
            <Button style={{ marginTop: 5 }} onPress={() => navigate("SelectServer")}>{t('select_or_add_a_server')}</Button>
        </View>
    )
}
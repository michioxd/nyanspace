import { Header } from "@react-navigation/elements";
import { View } from "react-native";
import * as Linking from 'expo-linking';
import * as Application from 'expo-application';
import { List, RadioButton, Text, useTheme } from "react-native-paper";
import { UserThemeType } from "../../utils/def";
import { useContext, useEffect, useState } from "react";
import { ConfigurationContext } from "../../context/Configuration";
import { navigate } from "../../utils/navigate";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { SupportedLanguage } from "../../i18n/resources";

export default function ScreenMainSettings() {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const cfg = useContext(ConfigurationContext);
    const [themeSelect, setThemeSelect] = useState<UserThemeType>(cfg?.currentUserTheme ?? "system");

    useEffect(() => {
        cfg?.changeTheme(themeSelect);
    }, [themeSelect]);

    return (
        <>
            <View style={{ flex: 1 }}>
                <Header title={t('settings')} headerStyle={{ backgroundColor: theme.colors.elevation.level2 }} />
                <ScrollView style={{ width: '100%', height: '100%', backgroundColor: theme.colors.background }}>
                    <List.Section>
                        <List.Subheader>{t('theme')}</List.Subheader>
                        <List.Item
                            title={t('theme_system_defined')}
                            left={(props) => <List.Icon {...props} icon="brightness-auto" />}
                            onPress={() => setThemeSelect('system')}
                            right={(props) => <RadioButton
                                status={themeSelect === "system" ? "checked" : 'unchecked'}
                                value="system" onPress={() => setThemeSelect('system')} {...props} />}
                        />
                        <List.Item
                            title={t('theme_light')}
                            left={(props) => <List.Icon {...props} icon="brightness-7" />}
                            onPress={() => setThemeSelect('light')}
                            right={(props) => <RadioButton
                                status={themeSelect === "light" ? "checked" : 'unchecked'}
                                value="light" onPress={() => setThemeSelect('light')} {...props} />}
                        />
                        <List.Item
                            title={t('theme_dark')}
                            left={(props) => <List.Icon {...props} icon="brightness-2" />}
                            onPress={() => setThemeSelect('dark')}
                            right={(props) => <RadioButton
                                status={themeSelect === "dark" ? "checked" : 'unchecked'}
                                value="dark" onPress={() => setThemeSelect('dark')} {...props} />}
                        />
                        <List.Subheader>{t('general')}</List.Subheader>
                        <List.Item
                            title={t('language')}
                            description={t('current_language') + SupportedLanguage[(String(i18n.language) ?? "en") as keyof typeof SupportedLanguage].label}
                            left={(props) => <List.Icon {...props} icon="translate" />}
                            onPress={() => navigate("SelectLanguage")}
                        />
                        <List.Subheader>{t('about')}</List.Subheader>
                        <List.Item
                            title={t('version')}
                            description={Application.nativeApplicationVersion}
                            left={(props) => <List.Icon {...props} icon="information" />}
                        />
                        <List.Item
                            title={t('GitHub')}
                            description={"https://github.com/michioxd/nyanspace"}
                            onPress={() => Linking.openURL("https://github.com/michioxd/nyanspace")}
                            left={(props) => <List.Icon {...props} icon="github" />}
                        />
                        <Text style={{ color: 'gray', marginLeft: 16 }} variant="labelSmall">From neko with love by michioxd and all contributors!</Text>
                    </List.Section>
                </ScrollView>
            </View>
        </>
    )
}
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { List, RadioButton } from "react-native-paper";
import { STORE_LANGUAGE_KEY } from "../utils/def";
import { allLanguageList, SupportedLanguage } from "../i18n/resources";
import useFirstRender from "../hooks/firstRender";
import useDidMountEffect from "../hooks/firstRender";

export default function ScreenSelectLanguage() {
    const { t, i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState<string>("SYSTEM");


    useEffect(() => {
        (async () => {
            setCurrentLanguage(await AsyncStorage.getItem(STORE_LANGUAGE_KEY) ?? "SYSTEM");
            if (currentLanguage !== "SYSTEM") {
                setCurrentLanguage(i18n.language);
            }
        })()
    }, []);

    useDidMountEffect(() => {
        (async () => {
            await AsyncStorage.setItem(STORE_LANGUAGE_KEY, currentLanguage);

            if (currentLanguage === 'SYSTEM') {
                const cb = Localization.getLocales();
                await i18n.changeLanguage(cb[0].languageCode ?? "en");
            } else {
                await i18n.changeLanguage(currentLanguage);
            }
        })();
    }, [currentLanguage]);

    return (
        <>
            <View style={{ flex: 1 }}>
                <ScrollView style={{ width: '100%', height: '100%' }}>
                    <List.Section>
                        <List.Item
                            title={t('language_same_as_device')}
                            description={`${allLanguageList[Localization.getLocales()[0].languageCode ?? "en"]} ${(!SupportedLanguage[Localization.getLocales()[0].languageCode ?? "en"] ? "(" + t('not_supported') + ")" : "")}`}
                            onPress={() => setCurrentLanguage('SYSTEM')}
                            right={(props) => <RadioButton
                                status={currentLanguage === "SYSTEM" ? "checked" : 'unchecked'}
                                value="SYSTEM"
                                onPress={() => setCurrentLanguage('SYSTEM')}
                                {...props}
                            />}
                        />
                        {Object.entries(SupportedLanguage).map((d, i) => <List.Item
                            key={i}
                            title={d[1].label}
                            description={d[1].en}
                            onPress={() => setCurrentLanguage(d[0])}
                            right={(props) => <RadioButton
                                status={currentLanguage === d[0] ? "checked" : 'unchecked'}
                                value={d[0]}
                                onPress={() => setCurrentLanguage(d[0])}
                                {...props}
                            />}
                        />)}
                    </List.Section>
                </ScrollView>
            </View>
        </>
    )
}
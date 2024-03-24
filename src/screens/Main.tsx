import { useMemo, useState } from "react";
import { Easing, StyleSheet, View } from "react-native";
import { BottomNavigation, BottomNavigationRoute } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenMainHome from "./Main/Home";
import ScreenMainSFTP from "./Main/SFTP";
import ScreenMainSettings from "./Main/Settings";
import ScreenMainAction from "./Main/Action";
import { useTranslation } from "react-i18next";

export default function ScreenMain() {
    const { t } = useTranslation();

    const insets = useSafeAreaInsets();
    const [index, setIndex] = useState(0);

    const routes = useMemo<BottomNavigationRoute[]>(() => {
        return [
            {
                key: 'home',
                title: t('home'),
                focusedIcon: 'home',
            },
            {
                key: 'sftp',
                title: t('sftp'),
                focusedIcon: 'folder',
            },
            {
                key: 'action',
                title: t('action'),
                focusedIcon: 'power-cycle',
            },
            {
                key: 'settings',
                title: t('settings'),
                focusedIcon: 'cog'
            },
        ]
    }, [t]);

    return (
        <>
            <View style={st.screen}>
                <BottomNavigation
                    safeAreaInsets={{ bottom: insets.bottom }}
                    navigationState={{ index, routes }}
                    onIndexChange={setIndex}
                    labelMaxFontSizeMultiplier={2}
                    renderScene={BottomNavigation.SceneMap({
                        home: ScreenMainHome,
                        sftp: ScreenMainSFTP,
                        settings: ScreenMainSettings,
                        action: ScreenMainAction
                    })}
                    sceneAnimationEnabled={true}
                    sceneAnimationType={"opacity"}
                    sceneAnimationEasing={Easing.ease}
                />
            </View>
        </>
    )
}

const st = StyleSheet.create({
    screen: {
        flex: 1
    }
});
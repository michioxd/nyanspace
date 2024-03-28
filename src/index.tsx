import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { PERSISTENCE_KEY, PREFERENCES_KEY, UserThemeType } from './utils/def';
import {
    InitialState,
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { navigationRef } from './utils/navigate';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ConfigurationContext } from './context/Configuration';
import Root from './root';
import SnackbarContainer from './components/SnackbarAPI';
import { DialogProvider } from './context/DialogProvider';
import ConnectorContainer from './components/Connector';

export default function App() {

    const [initialState, setInitialState] = useState<
        InitialState | undefined
    >();
    const { LightTheme, DarkTheme } = adaptNavigationTheme({
        reactNavigationLight: NavigationDefaultTheme,
        reactNavigationDark: NavigationDarkTheme,
    });

    const [userThemeMode, setUserThemeMode] = useState<UserThemeType>("system");

    const colorScheme = Appearance.getColorScheme();
    const { theme } = useMaterial3Theme();

    const isDarkTheme = userThemeMode === "system" ? colorScheme === "dark" ? true : false : userThemeMode === "dark" ? true : false;

    const paperTheme = useMemo(
        () =>
            isDarkTheme ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light },
        [colorScheme, theme, userThemeMode]);

    const preferences = useMemo(
        () => ({
            changeTheme: (mode: UserThemeType) => setUserThemeMode(mode),
            currentUserTheme: userThemeMode
        }), [theme, userThemeMode]);

    const CombinedDefaultTheme = {
        ...MD3LightTheme,
        ...LightTheme,
        colors: {
            ...MD3LightTheme.colors,
            ...LightTheme.colors,
        },
    };

    const CombinedDarkTheme = {
        ...MD3DarkTheme,
        ...DarkTheme,
        colors: {
            ...MD3DarkTheme.colors,
            ...DarkTheme.colors,
        },
    };

    const combinedTheme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme;

    useEffect(() => {
        (async () => {
            try {
                const prefString = await AsyncStorage.getItem(PREFERENCES_KEY);
                const preferences = JSON.parse(prefString || '');

                if (preferences) {
                    setUserThemeMode(preferences.theme as UserThemeType);
                }
            } catch (e) { }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                await AsyncStorage.setItem(
                    PREFERENCES_KEY,
                    JSON.stringify({
                        theme: userThemeMode,
                    })
                );
            } catch (e) { }
        })();
    }, [userThemeMode]);

    return (
        <I18nextProvider i18n={i18n} defaultNS={'translation'}>
            <PaperProvider theme={paperTheme} settings={{
                rippleEffectEnabled: true
            }}>
                <StatusBar style={isDarkTheme ? 'light' : 'dark'} translucent />
                <ConfigurationContext.Provider value={preferences}>
                    <NavigationContainer
                        theme={combinedTheme}
                        initialState={initialState}
                        ref={navigationRef}
                        onStateChange={(state) =>
                            AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
                        }
                    >
                        <ConnectorContainer>
                            <SnackbarContainer>
                                <DialogProvider>
                                    <Root />
                                </DialogProvider>
                            </SnackbarContainer>
                        </ConnectorContainer>
                    </NavigationContainer>
                </ConfigurationContext.Provider>
            </PaperProvider>
        </I18nextProvider>

    );
}

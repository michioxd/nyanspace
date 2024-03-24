import * as React from 'react';
import { Platform } from 'react-native';
import { getHeaderTitle } from '@react-navigation/elements';
import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import { Appbar, IconButton } from 'react-native-paper';
import ScreenSelectServer from './screens/SelectServer';
import ScreenAbout from './screens/About';
import ScreenMain from './screens/Main';
import { useTranslation } from 'react-i18next';
import ScreenSelectLanguage from './screens/SelectLanguage';
import ScreenAddServer from './screens/AddServer';


const Stack = createStackNavigator();

export default function Root() {
    const { t } = useTranslation();
    const cardStyleInterpolator =
        Platform.OS === 'android'
            ? CardStyleInterpolators.forFadeFromBottomAndroid
            : CardStyleInterpolators.forHorizontalIOS;
    return (
        <>
            <Stack.Navigator
                screenOptions={({ navigation }) => {
                    return {
                        detachPreviousScreen: !navigation.isFocused(),
                        cardStyleInterpolator,
                        header: ({ navigation, route, options, back }) => {
                            const title = getHeaderTitle(options, route.name);
                            return (
                                <Appbar.Header elevated>
                                    {back ? (
                                        <Appbar.BackAction onPress={() => navigation.goBack()} />
                                    ) : null}
                                    <Appbar.Content title={title} />

                                </Appbar.Header>
                            );
                        },
                    };
                }}
            >
                <Stack.Screen
                    name="Main"
                    component={ScreenMain}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="SelectServer"
                    component={ScreenSelectServer}
                    options={{
                        title: t('select_server')
                    }}
                />
                <Stack.Screen
                    name="AddServer"
                    component={ScreenAddServer}
                    options={{
                        title: t('add_server')
                    }}
                />
                <Stack.Screen
                    name="SelectLanguage"
                    component={ScreenSelectLanguage}
                    options={{
                        title: t('language')
                    }}
                />
                <Stack.Screen
                    name="About"
                    component={ScreenAbout}
                    options={{
                        title: t('about_nyanspace')
                    }}
                />
            </Stack.Navigator>
        </>
    );
}
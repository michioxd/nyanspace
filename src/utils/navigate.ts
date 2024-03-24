import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
    if (navigationRef.isReady()) {
        //@ts-expect-error bruh
        navigationRef.navigate(name, params);
    }
}

export function goBack() {
    navigationRef.goBack();
}
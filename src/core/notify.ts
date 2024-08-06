import notifee from '@notifee/react-native';

export default async function Notification() {
    return await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });
} 
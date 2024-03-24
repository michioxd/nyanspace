import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FAB, List, Portal } from "react-native-paper";
import { navigate } from "../utils/navigate";

export default function ScreenSelectServer() {
    return (
        <>
            <ScrollView style={{ width: '100%', height: '100%' }}>
                <List.Section>
                    <List.Item
                        title="None" />
                </List.Section>
            </ScrollView>
            <FAB onPress={() => navigate('AddServer')} style={styles.fabStyle} icon="plus" />
        </>
    )
}

const styles = StyleSheet.create({
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
    },
});
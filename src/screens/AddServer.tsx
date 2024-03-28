import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Text, TextInput, ToggleButton } from "react-native-paper";
import { useSnackbar } from "../context/SnackbarContext";
import SSHClient from "@dylankenneally/react-native-ssh-sftp";
import { goBack } from "../utils/navigate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LISTING_KEY } from "../utils/def";

//@ts-expect-error bruh
export default function ScreenAddServer({ route, navigation }) {
    const { t } = useTranslation();
    const snackbar = useSnackbar();

    let editData: [string, ServerTypes];
    if (route.params) {
        const { serverEditData } = route.params;
        editData = serverEditData;
    }
    const [isEdit, setIsEdit] = useState(false);
    const [serverName, setServerName] = useState("");
    const [serverAddress, setServerAddress] = useState("");
    const [serverPort, setServerPort] = useState(22);
    const [serverUsername, setServerUsername] = useState("");
    const [serverPassword, setServerPassword] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const serverCodename = useMemo(() => serverName.normalize("NFD").replace(/[^A-Za-z0-9]/g, ""), [serverName]);

    const checkInput = useCallback(() => {
        const hasEmptyStringInput = [serverName, serverAddress, serverUsername]
            .some(input => input.trim() === '');
        if (hasEmptyStringInput || serverPassword.trim() === "" && privateKey.trim() === "") {
            snackbar?.show({ content: t('some_details_cannot_be_empty') });
            return false;
        }
        const isServerPortValid = Number.isInteger(serverPort) && serverPort >= 0 && serverPort <= 65535;
        if (!isServerPortValid) {
            snackbar?.show({ content: t('port_invalid_range') });
        }

        return !hasEmptyStringInput && isServerPortValid;
    }, [serverName, serverAddress, serverPassword, serverPort, serverUsername, privateKey]);

    const handleCheckConnection = useCallback(async () => {
        if (!checkInput()) return;
        const time = Date.now();
        setIsLoading(true);
        console.log(`Attemping to connect to ${serverAddress}...`)
        try {
            let client: SSHClient;

            if (privateKey.length > 10) {
                client = await SSHClient.connectWithKey(
                    serverAddress,
                    serverPort,
                    serverUsername,
                    privateKey
                )
            } else {
                client = await SSHClient.connectWithPassword(
                    serverAddress,
                    serverPort,
                    serverUsername,
                    serverPassword
                )
            }
            console.log(`Trying to execute command...`);
            const res = await client.execute("echo \"OK\"");
            console.log(res.trim());
            if (res.trim() == "OK") {
                snackbar?.show({ content: t('test_connection_successful') + ` (${Date.now() - time} ms)` })
            } else {
                snackbar?.show({ content: t('test_connection_error_execute_command') });
            }

            client.disconnect();
        } catch (e) {
            console.error(e);
            snackbar?.show({ content: t('test_connection_error') });
        } finally {
            setIsLoading(false);
        }
    }, [serverName, serverAddress, serverPassword, serverPort, serverUsername, privateKey]);

    const handleAddServer = useCallback(async () => {
        if (!checkInput()) return;
        setIsLoading(true);
        try {
            const lastData = await AsyncStorage.getItem(LISTING_KEY);
            let data: ServerList = JSON.parse(lastData ?? "{}") ?? {};

            if (isEdit) {
                if (!data[editData[0]]) return;

                data[editData[0]] = {
                    name: serverName,
                    address: serverAddress,
                    password: serverPassword,
                    username: serverUsername,
                    port: serverPort,
                    privateKey: privateKey
                };
            } else {
                if (data[serverCodename]) {
                    snackbar?.show({ content: t('server_name_existed') });
                    return;
                }

                data[serverCodename] = {
                    name: serverName,
                    address: serverAddress,
                    password: serverPassword,
                    username: serverUsername,
                    port: serverPort,
                    privateKey: privateKey
                }
            }

            await AsyncStorage.setItem(LISTING_KEY, JSON.stringify(data));
            goBack();
        } catch (e) {
            snackbar?.show({ content: t(isEdit ? 'cannot_edit_server' : 'cannot_add_server') });
        } finally {
            setIsLoading(false);
        }
    }, [isEdit, serverName, serverAddress, serverPassword, serverPort, serverUsername, privateKey]);

    useEffect(() => {
        if (editData) {
            const d = editData[1];
            setPrivateKey(d.privateKey);
            setServerAddress(d.address);
            setServerName(d.name);
            setServerPassword(d.password);
            setServerPort(d.port);
            setServerUsername(d.username);
            setIsEdit(true);

            navigation.setOptions({ title: t('edit_server') })
        }
    }, []);

    return (
        <>
            <ScrollView>
                <View style={{ margin: 16 }}>
                    <Text style={{ marginBottom: 8 }}>{t('add_server_notice')}</Text>
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        label={t('server_name')}
                        placeholder={"awesome neko server nyan~,..."}
                        left={
                            <TextInput.Icon
                                icon="pen"
                            />
                        }
                        value={serverName}
                        onChangeText={(text) => setServerName(text)}
                        maxLength={50}
                        disabled={isLoading}
                    />
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        label={t('server_address')}
                        placeholder={"192.168.0.1, example.com,..."}
                        left={
                            <TextInput.Icon
                                icon="server"
                            />
                        }
                        value={serverAddress}
                        onChangeText={(text) => setServerAddress(text)}
                        disabled={isLoading}
                    />
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        label={t('server_port')}
                        placeholder={"22"}
                        left={
                            <TextInput.Icon
                                icon="application-export"
                            />
                        }
                        value={String(serverPort)}
                        onChangeText={(text) => setServerPort(parseInt(text.normalize("NFD").replace(/[^0-9]/g, "")))}
                        maxLength={5}
                        inputMode="numeric"
                        disabled={isLoading}
                    />
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        label={t('server_username')}
                        placeholder={"root"}
                        left={
                            <TextInput.Icon
                                icon="account-circle"
                            />
                        }
                        value={serverUsername}
                        onChangeText={(text) => setServerUsername(text)}
                        disabled={isLoading}
                    />
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        label={t('server_password')}
                        placeholder={"admin :)"}
                        secureTextEntry
                        left={
                            <TextInput.Icon
                                icon="lock"
                            />
                        }
                        value={serverPassword}
                        onChangeText={(text) => setServerPassword(text)}
                        disabled={isLoading}
                    />
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        label={t('server_private_key')}
                        placeholder={"-----BEGIN RSA..."}
                        multiline
                        left={
                            <TextInput.Icon
                                icon="file-certificate"
                            />
                        }
                        value={privateKey}
                        onChangeText={(text) => setPrivateKey(text)}
                        disabled={isLoading}
                    />
                    <Text variant="bodySmall" style={{ color: "gray", marginBottom: 8 }}>{t('add_server_privatekey_notice')}</Text>

                    <Button loading={isLoading} disabled={isLoading} style={{ marginBottom: 8, marginTop: 8 }} mode="outlined" onPress={handleCheckConnection}>
                        {t('test_connection')}
                    </Button>

                    <Button disabled={isLoading} loading={isLoading} style={{ marginBottom: 8, marginTop: 8 }} mode="contained-tonal" onPress={handleAddServer}>
                        {t(isEdit ? 'edit_server' : 'add_server')}
                    </Button>
                </View>

            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 8
    }
})
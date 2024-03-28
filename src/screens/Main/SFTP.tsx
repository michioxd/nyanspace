import { Button, Text } from "react-native-paper";
import DialogAPI, { DialogType } from "../../components/DialogAPI";
import { useSnackbar } from "../../context/SnackbarContext";

export default function ScreenMainSFTP() {
    const snackbar = useSnackbar();
    return (
        <>
            <Button onPress={async () => {
                const r = await DialogAPI.show({
                    type: DialogType.CONTENT,
                    title: "Hello world",
                    content: <><Text>hello world</Text></>
                })

                snackbar?.show({ content: r ?? "empty data" });
            }} mode="contained-tonal">test dialog</Button>
        </>
    )
}
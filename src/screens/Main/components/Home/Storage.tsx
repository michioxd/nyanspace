import { View } from "react-native";
import { ServerStats } from "../../../../types/Stats";
import { Checkbox, ProgressBar, Text } from "react-native-paper";
import { formatData } from "../../../../utils/utils";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_SHOW_TMPFS } from "../../../../utils/def";

export default function HomeStorage({ d }: { d: ServerStats }) {
    const [showTmpfs, setShowTmpfs] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            const showTmp = await AsyncStorage.getItem(STORAGE_SHOW_TMPFS);
            setShowTmpfs(showTmp === "1");
        })();
    }, []);

    useEffect(() => {
        (async () => {
            await AsyncStorage.setItem(STORAGE_SHOW_TMPFS, showTmpfs ? "1" : "0");
        })();
    }, [showTmpfs]);

    return (
        <View style={{ display: 'flex', gap: 10, marginBottom: 35 }}>
            {d.partitions.sort((a, b) => {
                if (a.source < b.source) return -1;
                if (a.source > b.source) return 1;
                return 0;
            }).filter(p => p.fstype === "tmpfs" ? showTmpfs : true).map((p, i) => (
                <View key={i} style={{ flex: 1 }}>
                    <Text style={{ margin: 0 }} variant="titleMedium">{p.source}</Text>
                    <Text variant="bodySmall">{t('mounted')}: {p.target} {`(${p.fstype})`}</Text>
                    <Text variant="bodySmall">{t('disk_space')}: {formatData(p.used) + "/" + formatData(p.size)}</Text>
                    <ProgressBar style={{ flex: 1, marginTop: 5 }} progress={p.used / p.size} />
                </View>
            ))}
            <Checkbox.Item onPress={() => setShowTmpfs(!showTmpfs)} label={t('show_tmpfs')} status={showTmpfs ? "checked" : "unchecked"} />
        </View>
    )
}
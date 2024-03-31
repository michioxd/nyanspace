import { List, Text } from "react-native-paper";
import { ServerStats } from "../../../../types/Stats";
import { formatData, isIPv4, isIPv6 } from "../../../../utils/utils";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function HomeNetwork({ d }: { d: ServerStats }) {
    const { t } = useTranslation();
    return (
        <>
            <List.Section>
                <List.Subheader>{t('ipv4_address')}</List.Subheader>
                <View style={{ marginLeft: 16, marginRight: 16 }}>
                    {d.network.ips.split(" ").filter(ip => isIPv4(ip)).map((ip, i) => (
                        <Text key={i}>{ip}</Text>
                    ))}
                </View>
                <List.Subheader>{t('ipv6_address')}</List.Subheader>
                <View style={{ marginLeft: 16, marginRight: 16 }}>
                    {d.network.ips.split(" ").filter(ip => isIPv6(ip)).map((ip, i) => (
                        <Text key={i}>{ip}</Text>
                    ))}
                </View>
                <List.Subheader>{t('interface')}</List.Subheader>
                {d.network.interfaces.map((n, i) => (
                    <List.Item
                        key={i}
                        title={n.name}
                        description={
                            <>
                                <Text style={{ color: "gray" }} variant="bodySmall">TX: {formatData(n.tx)}{"\n"}</Text>
                                <Text style={{ color: "gray" }} variant="bodySmall">RX: {formatData(n.rx)}</Text>
                            </>
                        }
                        left={props => <>
                            <List.Icon {...props} icon="arrow-up-bold" color={n.state === "up" ? "#2ed933" : "#2ed93355"} />
                            <List.Icon icon="arrow-down-bold" color={n.state === "down" ? "#d92e2e" : "#d92e2e44"} />
                        </>}
                    />
                ))}
            </List.Section>

        </>
    )
}
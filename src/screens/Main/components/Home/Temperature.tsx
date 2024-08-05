import { List, Text } from "react-native-paper";
import { ServerStats } from "../../../../types/Stats";
import { useTranslation } from "react-i18next";

export default function HomeTemperature({ d }: { d: ServerStats }) {
    const { t } = useTranslation();
    return (
        <>
            <List.Section>
                {d.temperatures.length == 0 ? <List.Item title={t("no_temperature_sensors_found")} /> : d.temperatures.map((t, i) => (
                    <List.Item
                        key={i}
                        title={t.name}
                        description={t.component}
                        left={props => <Text {...props} variant="titleLarge" style={{ fontWeight: "bold", color: t.temperature < 65 ? "#2bb324" : t.temperature < 85 ? "#b37c24" : "#b32424", ...props.style }}>{Math.round(t.temperature)}℃</Text>}
                    />
                ))}
            </List.Section>

        </>
    )
}
import { List, Text } from "react-native-paper";
import { ServerStats } from "../../../../types/Stats";

export default function HomeTemperature({ d }: { d: ServerStats }) {
    return (
        <>
            <List.Section>
                {d.temperatures.map((t, i) => (
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
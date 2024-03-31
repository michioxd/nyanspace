import { Icon, Surface, Text } from "react-native-paper";
import { ServerStats } from "../../../../types/Stats";
import { Dimensions, StyleSheet, View } from "react-native";
import { ReactNode, useMemo } from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { formatData } from "../../../../utils/utils";
import { useTranslation } from "react-i18next";

const screenWidth = Dimensions.get("window").width;

const SurfaceItem = ({ children }: { children: ReactNode }) => {
    return (
        <Surface mode="flat" elevation={2} style={styles.surface}>
            {children}
        </Surface>
    );
}

const CircleItem = ({ percent, secondText, icon, color, primaryText, customValue }: { percent: number, secondText?: string, icon: any, color: string, primaryText?: string, customValue?: string }) => {
    return (
        <SurfaceItem>
            <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {primaryText && <Text style={{ marginBottom: 8 }} variant="titleSmall">{primaryText}</Text>}
                <AnimatedCircularProgress
                    width={10}
                    backgroundWidth={3}
                    fill={percent}
                    size={120}
                    tintColor={color}
                    backgroundColor="rgba(128,128,128,0.4)"
                    arcSweepAngle={240}
                    rotation={240}
                    lineCap="round"
                >
                    {prop => <Icon source={icon} size={50} />}
                </AnimatedCircularProgress>
            </View>
            <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold' }} variant="titleLarge">{percent}{customValue ?? "%"}</Text>
                {secondText && <Text variant="labelMedium">{secondText}</Text>}
            </View>
        </SurfaceItem>
    )
}

export default function HomeDashboard({ d }: { d: ServerStats }) {
    const { t } = useTranslation();

    const networkState = useMemo(() => {
        let statusUp = 0, statusDown = 0, upAvg = 0, downAvg = 0;
        d.network.interfaces.forEach(item => {
            if (item.state === "up") statusUp++;
            if (item.state === "down") statusDown++;
            upAvg += item.tx;
            downAvg += item.rx;
        });

        return {
            upAvg: upAvg,
            downAvg: downAvg,
            statusUp: statusUp > 0,
            statusDown: statusDown > 0
        }
    }, [d.network.interfaces]);

    return (
        <View style={{ flex: 1, marginBottom: 30, }}>
            <Text variant="titleLarge">{d.hostname}</Text>
            <Text variant="titleSmall" style={{ color: "gray" }}>{d.distro_name + " " + d.distro_version}</Text>
            <View style={{ flex: 1, marginTop: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
                <CircleItem primaryText={t('cpu')} color="#117dbb" icon="memory" percent={Math.round(d.stats.cpu_usage)} />
                <CircleItem primaryText={t('ram')} color="#b01eae" icon="chip" percent={Math.round(d.stats.mem_used / d.stats.mem_total * 100)} secondText={formatData(d.stats.mem_used, true) + "/" + formatData(d.stats.mem_total, true)} />
                {d.partitions.filter(d => d.target == "/" || d.source.startsWith("/dev/sd")).map((d, i) => (
                    <CircleItem key={i} color="#00b884" primaryText={d.source} icon="harddisk" percent={Math.round(d.used / d.size * 100)} secondText={formatData(d.used) + "/" + formatData(d.size)} />
                ))}
                <SurfaceItem>
                    <Text style={{ marginBottom: 8 }} variant="titleSmall">{t('network')}</Text>
                    <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                        <Icon source="arrow-up-bold" color={networkState.statusUp ? "#2ed933" : "#2ed93355"} size={60} />
                        <Icon source="arrow-down-bold" color={networkState.statusDown ? "#d92e2e" : "#d92e2e44"} size={60} />
                    </View>
                    <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text variant="bodyMedium">TX: {formatData(networkState.upAvg)}</Text>
                        <Text variant="bodyMedium">RX: {formatData(networkState.downAvg)}</Text>
                    </View>
                </SurfaceItem>
                {d.temperatures.map((d, i) => (
                    <CircleItem key={i} primaryText={t('temperature')} color={d.temperature < 65 ? "#2bb324" : d.temperature < 85 ? "#b37c24" : "#b32424"} icon="coolant-temperature" percent={Math.round(d.temperature / 100 * 100)} customValue="℃" secondText={d.name} />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    surface: {
        width: screenWidth / 2 - 8 * 4,
        borderRadius: 8,
        margin: 8,
        padding: 8,
        alignItems: 'center',
        position: 'relative'
    },
});
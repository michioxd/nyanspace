import { Text } from "react-native-paper";
import { ServerStats } from "../../../../types/Stats";

import LogoIntel from "./../../../../assets/cpu_vendor_logo/intel.svg";
import LogoAmd from "./../../../../assets/cpu_vendor_logo/amd.png";
import LogoArm from "./../../../../assets/cpu_vendor_logo/arm.png";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";

export default function HomeCPU({ d }: { d: ServerStats }) {
    const { t } = useTranslation();
    return (
        <>
            {d.cpu.name.startsWith("Intel") ? <LogoIntel width={150} height={80} />
                : d.cpu.name.startsWith("AMD") ? <Image source={LogoAmd} style={{ objectFit: "contain", width: 150, height: 80 }} width={150} height={80} />
                    : d.cpu.name.startsWith("ARM") ? <Image source={LogoArm} style={{ objectFit: "contain", width: 150, height: 80 }} width={150} height={80} /> : null}
            <View style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
                <View>
                    <Text variant="labelLarge" style={{ color: 'gray' }}>{t('name')}</Text>
                    <Text>{d.cpu.name}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text variant="labelLarge" style={{ color: 'gray' }}>{t('cpu_clock')}</Text>
                        <Text>{d.cpu.speed} MHz</Text>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text variant="labelLarge" style={{ color: 'gray' }}>{t('architecture')}</Text>
                        <Text>{d.cpu.architecture}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text variant="labelLarge" style={{ color: 'gray' }}>{t('cache_size')}</Text>
                        <Text>{d.cpu.cache_size}</Text>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text variant="labelLarge" style={{ color: 'gray' }}>{t('logical_cores')}</Text>
                        <Text>{d.cpu.logical_cores}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text variant="labelLarge" style={{ color: 'gray' }}>{t('physical_cores')}</Text>
                        <Text>{d.cpu.physical_cores}</Text>
                    </View>
                </View>
                <Text variant="labelLarge" style={{ color: 'gray' }}>{t('flags')}</Text>
                <Text>{d.cpu.flags}</Text>
            </View>
        </>
    )
}
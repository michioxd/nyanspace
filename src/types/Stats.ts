export interface ServerStats {
    hostname: string;
    distro_name: string;
    distro_version: string;
    kernel_version: string;
    uptime: number;
    cpu: CPU;
    network: Network;
    stats: SystemStats;
    partitions: Partition[];
    temperatures: Temperature[];
}

export interface CPU {
    name: string;
    physical_cores: string;
    logical_cores: string;
    speed: string;
    architecture: string;
    cache_size: string;
    flags: string;
}

export interface Network {
    ips: string;
    interfaces: NetworkInterface[];
}

export interface NetworkInterface {
    name: string;
    state: "up" | "down" | "unknown";
    tx: number;
    rx: number;
}

export interface Partition {
    source: string;
    fstype: string;
    size: number;
    used: number;
    target: string;
}

export interface SystemStats {
    cpu_usage: number;
    mem_total: number;
    mem_free: number;
    mem_buffers: number;
    mem_cached: number;
    mem_used: number;
}

export interface Temperature {
    name: string;
    component: string;
    temperature: number;
}

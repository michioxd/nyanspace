export const initialCommand: string = String.raw` mkdir ~/.nyanspace | printf "#!/bin/bash\n\n# Generated by nyanspace, please do not edit, If you have an idea, please create a PR in https://github.com/michioxd/nyanspace/pulls\n# License: https://github.com/michioxd/nyanspace/LICENSE\n\nset -e\n\nif ! [[ \$1 =~ ^[0-9]+\$ ]]; then\n    echo \\\"nyanspace.sh error: Argument must be a number\\\"\n    exit 1\nfi\n\nwhile :\ndo\n    # Initial JSON part\n    json_output=\\\"{\\\"\n\n    # Get system hostname\n    hostname=\$(hostname)\n    json_output+=\\\"\\\\\"hostname\\\\\": \\\\\"\$hostname\\\\\",\\\"\n\n    # Get Distro information\n    if [ -f /etc/os-release ]; then\n        . /etc/os-release\n        OS=\$NAME\n        VER=\$VERSION_ID\n    elif type lsb_release >/dev/null 2>&1; then\n        OS=\$(lsb_release -si)\n        VER=\$(lsb_release -sr)\n    elif [ -f /etc/lsb-release ]; then\n        . /etc/lsb-release\n        OS=\$DISTRIB_ID\n        VER=\$DISTRIB_RELEASE\n    elif [ -f /etc/debian_version ]; then\n        OS=Debian\n        VER=\$(cat /etc/debian_version)\n    elif [ -f /etc/SuSE-release ]; then\n        OS=\$(cat /etc/SuSE-release | head -n 1 | awk \'{print \$1}\')\n        VER=\$(cat /etc/SuSE-release | grep \\\"VERSION\\\" | awk \'{print \$3}\')\n    elif [ -f /etc/redhat-release ]; then\n        OS=\$(cat /etc/redhat-release | awk \'{print \$1}\')\n        VER=\$(cat /etc/redhat-release | awk \'{print \$4}\')\n    else\n        OS=\$(uname -s)\n        VER=\$(uname -r)\n    fi\n\n    json_output+=\\\"\\\\\"distro_name\\\\\": \\\\\"\$OS\\\\\",\\\"\n    json_output+=\\\"\\\\\"distro_version\\\\\": \\\\\"\$VER\\\\\",\\\"\n\n    # Get kernel version\n    kernel_version=\$(awk \'{print \$3}\' /proc/version)\n    json_output+=\\\"\\\\\"kernel_version\\\\\": \\\\\"\$kernel_version\\\\\",\\\"\n\n    # Get uptime\n    uptime=\$(awk \'{print \$1}\' /proc/uptime)\n    json_output+=\\\"\\\\\"uptime\\\\\": \$uptime,\\\"\n\n    # Get cpu info\n    cpu_name=\$(grep -m1 \'model name\' /proc/cpuinfo | awk -F\': \' \'{print \$2}\')\n    cpu_physical_cores=\$(grep \'core id\' /proc/cpuinfo | sort -u | wc -l)\n    cpu_logical_cores=\$(grep \'processor\' /proc/cpuinfo | wc -l)\n    cpu_speed=\$(grep -m1 \'cpu MHz\' /proc/cpuinfo | awk -F\': \' \'{print \$2}\')\n    cpu_architecture=\$(uname -m)\n    cpu_cache_size=\$(grep -m1 \'cache size\' /proc/cpuinfo | awk -F\': \' \'{print \$2}\')\n    cpu_flags=\$(grep -m1 \'flags\' /proc/cpuinfo | awk -F\': \' \'{print \$2}\')\n\n    json_output+=\\\"\\\\\"cpu\\\\\":{\\\\\"name\\\\\":\\\\\"\$cpu_name\\\\\",\\\\\"physical_cores\\\\\":\\\\\"\$cpu_physical_cores\\\\\",\\\\\"logical_cores\\\\\":\\\\\"\$cpu_logical_cores\\\\\",\\\\\"speed\\\\\":\\\\\"\$cpu_speed\\\\\",\\\\\"architecture\\\\\":\\\\\"\$cpu_architecture\\\\\",\\\\\"cache_size\\\\\":\\\\\"\$cpu_cache_size\\\\\",\\\\\"flags\\\\\":\\\\\"\$cpu_flags\\\\\"},\\\"\n\n    json_output+=\\\"\\\\\"network\\\\\":{\\\\\"ips\\\\\":\\\\\"\$(hostname -I)\\\\\",\\\\\"interfaces\\\\\":[\\\"\n\n    # Get network interface\n    readarray -t interfaces <<< \\\"\$(ip -o link show | awk -F\': \' \'{print \$2}\')\\\"\n\n    for interface in \\\"\${interfaces[@]}\\\"; do\n        if [[ \$interface != \${interfaces[0]} ]]; then\n            json_output+=\\\",\\\"\n        fi\n        state=\$(cat \\\"/sys/class/net/\$interface/operstate\\\")\n        tx_bytes=\$(cat \\\"/sys/class/net/\$interface/statistics/tx_bytes\\\")\n        rx_bytes=\$(cat \\\"/sys/class/net/\$interface/statistics/rx_bytes\\\")\n        json_output+=\\\"{\\\\\"name\\\\\": \\\\\"\$interface\\\\\", \\\\\"state\\\\\": \\\\\"\$state\\\\\", \\\\\"tx\\\\\": \$tx_bytes, \\\\\"rx\\\\\": \$rx_bytes}\\\"\n    done\n\n    json_output+=\\\"]},\\\"\n\n    # Get cpu usage\n    cpu_usage=\$(cat <(grep \'cpu \' /proc/stat) <(sleep 1 && grep \'cpu \' /proc/stat) | awk -v RS=\\\"\\\" \'{print (\$13-\$2+\$15-\$4)*100/(\$13-\$2+\$15-\$4+\$16-\$5)}\')\n\n    # Get memory details\n    mem_total=\$(grep MemTotal /proc/meminfo | awk \'{print \$2}\')\n    mem_free=\$(grep MemFree /proc/meminfo | awk \'{print \$2}\')\n    mem_buffers=\$(grep Buffers /proc/meminfo | awk \'{print \$2}\')\n    mem_cached=\$(grep \\\"^Cached\\\" /proc/meminfo | awk \'{print \$2}\')\n    mem_used=\$((mem_total - mem_free - mem_buffers - mem_cached))\n\n    json_output+=\\\"\\\\\"stats\\\\\": {\\\\\"cpu_usage\\\\\": \$cpu_usage,\\\\\"mem_total\\\\\": \$mem_total,\\\\\"mem_free\\\\\": \$mem_free,\\\\\"mem_buffers\\\\\": \$mem_buffers,\\\\\"mem_cached\\\\\": \$mem_cached,\\\\\"mem_used\\\\\": \$mem_used},\\\"\n\n    # Process partitions\n    partitions=\$(df -B1 --output=source,fstype,size,used,target | awk \'NR>1 {\n        gsub(/ /, \\\"_\\\", \$5);\n        printf \\\"{\\\\\"source\\\\\":\\\\\"%%s\\\\\", \\\\\"fstype\\\\\":\\\\\"%%s\\\\\", \\\\\"size\\\\\":%%s, \\\\\"used\\\\\":%%s, \\\\\"target\\\\\":\\\\\"%%s\\\\\"}\\\", \$1, \$2, \$3, \$4, \$5;\n        if (NR < NR_OF_LINES) printf \\\", \\\";\n    }\' NR_OF_LINES=\$(df --output=source,fstype,size,used,target | wc -l))\n    json_output+=\\\"\\\\\"partitions\\\\\":[\$partitions],\\\\\"temperatures\\\\\":[\\\"\n\n    # Process temperatures, if applicable\n    if [ -d \\\"/sys/class/hwmon\\\" ]; then\n        temp_entries=()\n        while read -r hwmon; do\n            if [ -f \\\"\$hwmon/temp1_input\\\" ]; then\n                temperature=\$(cat \\\"\$hwmon/temp1_input\\\")\n                temp_entries+=(\\\"\$(printf \'{\\\"component\\\": \\\"%%s\\\", \\\"temperature\\\": %%d}\' \\\"\${hwmon##*/}\\\" \\\"\$((temperature / 1000))\\\")\\\")\n            fi\n        done < <(ls -d /sys/class/hwmon/hwmon*)\n        if [ \${#temp_entries[@]} -gt 0 ]; then\n            IFS=\',\'; temperatures=\\\"\${temp_entries[*]}\\\"\n            json_output+=\$temperatures\n        fi\n    fi\n\n    json_output+=\\\"]}\\\"\n\n    echo \\\"|__BEGIN_NYANSPACE_SERVER_CONTENT__|\$json_output|__END_NYANSPACE_SERVER_CONTENT__|\\\"\n\n    sleep \\\"\$1\\\"\n\ndone" > ~/.nyanspace/.nyanspace.sh | chmod +x ~/.nyanspace/.nyanspace.sh`
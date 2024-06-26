# Generated by nyanspace, please do not edit, If you have an idea, please create a PR in https://github.com/michioxd/nyanspace/pulls
# License: https://github.com/michioxd/nyanspace/LICENSE

set -e

if ! [[ $1 =~ ^[0-9]+$ ]]; then
    echo "nyanspace.sh error: Argument must be a number"
    exit 1
fi

while :
do
    # Initial JSON part
    json_output="{"

    # Get system hostname
    hostname=$(hostname)
    json_output+="\"hostname\": \"$hostname\","

    # Get Distro information
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    elif type lsb_release >/dev/null 2>&1; then
        OS=$(lsb_release -si)
        VER=$(lsb_release -sr)
    elif [ -f /etc/lsb-release ]; then
        . /etc/lsb-release
        OS=$DISTRIB_ID
        VER=$DISTRIB_RELEASE
    elif [ -f /etc/debian_version ]; then
        OS=Debian
        VER=$(cat /etc/debian_version)
    elif [ -f /etc/SuSE-release ]; then
        OS=$(cat /etc/SuSE-release | head -n 1 | awk '{print $1}')
        VER=$(cat /etc/SuSE-release | grep "VERSION" | awk '{print $3}')
    elif [ -f /etc/redhat-release ]; then
        OS=$(cat /etc/redhat-release | awk '{print $1}')
        VER=$(cat /etc/redhat-release | awk '{print $4}')
    else
        OS=$(uname -s)
        VER=$(uname -r)
    fi

    json_output+="\"distro_name\": \"$OS\","
    json_output+="\"distro_version\": \"$VER\","

    # Get kernel version
    kernel_version=$(awk '{print $3}' /proc/version)
    json_output+="\"kernel_version\": \"$kernel_version\","

    # Get uptime
    uptime=$(awk '{print $1}' /proc/uptime)
    json_output+="\"uptime\": $uptime,"

    # Get cpu info
    cpu_name=$(grep -m1 'model name' /proc/cpuinfo | awk -F': ' '{print $2}')
    cpu_physical_cores=$(grep 'core id' /proc/cpuinfo | sort -u | wc -l)
    cpu_logical_cores=$(grep 'processor' /proc/cpuinfo | wc -l)
    cpu_speed=$(grep -m1 'cpu MHz' /proc/cpuinfo | awk -F': ' '{print $2}')
    cpu_architecture=$(uname -m)
    cpu_cache_size=$(grep -m1 'cache size' /proc/cpuinfo | awk -F': ' '{print $2}')
    cpu_flags=$(grep -m1 'flags' /proc/cpuinfo | awk -F': ' '{print $2}')

    json_output+="\"cpu\":{\"name\":\"$cpu_name\",\"physical_cores\":\"$cpu_physical_cores\",\"logical_cores\":\"$cpu_logical_cores\",\"speed\":\"$cpu_speed\",\"architecture\":\"$cpu_architecture\",\"cache_size\":\"$cpu_cache_size\",\"flags\":\"$cpu_flags\"},"

    json_output+="\"network\":{\"ips\":\"$(hostname -I)\",\"interfaces\":["

    # Get network interface
    readarray -t interfaces <<< "$(ip -o link show | awk -F': ' '{print $2}')"

    for interface in "${interfaces[@]}"; do
        if [[ $interface != ${interfaces[0]} ]]; then
            json_output+=","
        fi
        interface="${interface%@*}"
        state=$(cat "/sys/class/net/$interface/operstate")
        tx_bytes=$(cat "/sys/class/net/$interface/statistics/tx_bytes")
        rx_bytes=$(cat "/sys/class/net/$interface/statistics/rx_bytes")
        json_output+="{\"name\": \"$interface\", \"state\": \"$state\", \"tx\": $tx_bytes, \"rx\": $rx_bytes}"
    done

    json_output+="]},"

    # Get cpu usage
    cpu_usage=$(cat <(grep 'cpu ' /proc/stat) <(sleep 1 && grep 'cpu ' /proc/stat) | awk -v RS="" '{print ($13-$2+$15-$4)*100/($13-$2+$15-$4+$16-$5)}')

    # Get memory details
    mem_total=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    mem_free=$(grep MemFree /proc/meminfo | awk '{print $2}')
    mem_buffers=$(grep Buffers /proc/meminfo | awk '{print $2}')
    mem_cached=$(grep "^Cached" /proc/meminfo | awk '{print $2}')
    mem_used=$((mem_total - mem_free - mem_buffers - mem_cached))

    json_output+="\"stats\": {\"cpu_usage\": $cpu_usage,\"mem_total\": $mem_total,\"mem_free\": $mem_free,\"mem_buffers\": $mem_buffers,\"mem_cached\": $mem_cached,\"mem_used\": $mem_used},"

    # Process partitions
    partitions=$(df -B1 --output=source,fstype,size,used,target | awk 'NR>1 {
        gsub(/ /, "_", $5);
        printf "{\"source\":\"%s\", \"fstype\":\"%s\", \"size\":%s, \"used\":%s, \"target\":\"%s\"}", $1, $2, $3, $4, $5;
        if (NR < NR_OF_LINES) printf ", ";
    }' NR_OF_LINES=$(df --output=source,fstype,size,used,target | wc -l))
    json_output+="\"partitions\":[$partitions],\"temperatures\":["

    # Process temperatures, if applicable
    if [ -d "/sys/class/hwmon" ]; then
        temp_entries=()
        while read -r hwmon; do
            if [ -f "$hwmon/temp1_input" ]; then
                temperature=$(cat "$hwmon/temp1_input")
                temp_name=$(cat "$hwmon/name")
                temp_entries+=("$(printf '{"name": "%s", "component": "%s", "temperature": %d}' $temp_name "${hwmon##*/}" "$((temperature / 1000))")")
            fi
        done < <(ls -d /sys/class/hwmon/hwmon*)
        if [ ${#temp_entries[@]} -gt 0 ]; then
            IFS=','; temperatures="${temp_entries[*]}"
            json_output+=$temperatures
        fi
    fi

    json_output+="]}"

    echo "|__BEGIN_NYANSPACE_SERVER_CONTENT__|$json_output|__END_NYANSPACE_SERVER_CONTENT__|"

    sleep "$1"

done
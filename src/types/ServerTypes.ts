interface ServerTypes {
    name: string,
    address: string,
    port: number,
    username: string,
    password: string,
    privateKey: string
}

interface ServerList {
    [codename: string]: ServerTypes
}
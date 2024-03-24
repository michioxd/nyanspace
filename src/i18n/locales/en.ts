import type { ResourceLanguage } from "i18next";

const locale: ResourceLanguage = {
    translation: {
        "select_server": "Select server",
        "theme": "Theme",
        "theme_system_defined": "System defined (Auto)",
        "theme_light": "Light",
        "theme_dark": "Dark",
        "general": "General",
        "language": "Language",
        "current_language": "Current language: ",
        "language_same_as_device": "Same as device",
        "home": "Home",
        "sftp": "SFTP",
        "action": "Action",
        "settings": "Settings",
        "no_server_selected": "No server selected!",
        "select_or_add_a_server": "Select or add a server",
        "add_server": "Add server",
        "add_server_notice": "Make sure your server supported SSH and running GNU Bash or zsh. Currently we only support Bash and zsh.",
        "server_name": "Server name",
        "server_address": "Address",
        "server_port": "Port",
        "server_username": "Username",
        "server_password": "Password",
        "server_private_key": "Private key",
        "add_server_privatekey_notice": "If Private key provided, we will use it to authenticate with your server first.",
        "test_connection": "Test connection",
        "some_details_cannot_be_empty": "Some details are empty, please check again!",
        "port_invalid_range": "Invalid port (0 to 65535)",
        "test_connection_successful": "Test connection successful",
        "test_connection_error": "Cannot connect to server.",
        "test_connection_error_execute_command": "Cannot execute command on this server."
    }
}

export default locale;
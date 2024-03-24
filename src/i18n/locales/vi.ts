import type { ResourceLanguage } from "i18next";

const locale: ResourceLanguage = {
    translation: {
        "select_server": "Lựa chọn máy chủ",
        "theme": "Chủ đề",
        "theme_system_defined": "Theo hệ thống",
        "theme_light": "Sáng",
        "theme_dark": "Tối",
        "general": "Chung",
        "language": "Ngôn ngữ",
        "current_language": "Ngôn ngữ hiện tại: ",
        "language_same_as_device": "Theo thiết bị",
        "home": "Trang chủ",
        "sftp": "SFTP",
        "action": "Hành động",
        "settings": "Cài đặt",
        "no_server_selected": "Chưa chọn máy chủ!",
        "select_or_add_a_server": "Chọn hoặc thêm một máy chủ",
        "add_server": "Thêm máy chủ",
        "add_server_notice": "Hãy chắc chắn máy chủ của bạn có SSH và đang sử dụng GNU Bash hoặc zsh. Hiện tại chỉ đang hỗ trợ Bash và zsh.",
        "server_name": "Tên máy chủ",
        "server_address": "Địa chỉ",
        "server_port": "Cổng",
        "server_username": "Tên người dùng",
        "server_password": "Mật khẩu",
        "server_private_key": "Private key",
        "add_server_privatekey_notice": "Nếu có private key, sẽ dùng nó để xác thực với server trước.",
        "test_connection": "Kiểm tra kết nối",
        "some_details_cannot_be_empty": "Một số thông tin đang để trống, vui lòng kiểm tra lại!",
        "port_invalid_range": "Cổng không đúng định dạng (0 đến 65535)",
        "test_connection_successful": "Kiểm tra kết nối thành công",
        "test_connection_error": "Không thể kết nối tới server.",
        "test_connection_error_execute_command": "Không thể thực thi lệnh trên server này."
    }
}

export default locale;
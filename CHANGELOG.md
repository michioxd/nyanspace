# Change log

Currently nyanspace still in cutting-edge state.

## 0.1-cuttingedge.31032024 (2024-03-31)

- Added Storage, Network, Temperature section.
- Fixed header did not sync color with Android 12+ monet engine.
- Resized app icon (again).
- Added System uptime in CPU section.
- Added `Gathering data` after established connection to SSH and waiting for crawler script response in `Connecting`.
- Used `ActivityIndicator` from `react-native` instead `react-native-paper`.

## 0.1-cuttingedge.30032024 (2024-03-30)

- Added a CPU page in the home section.
- Display the name of the current temperature component (`/sys/class/hwmon/hwmon*/name`), rather than the component pathname.
- Used `Math.round` instead `Math.ceil` for percent rounding.
- Added checking what shell server is being used while connecting to server.
- Fixed double connection in `Connector` after select server.
- Fixed network interfaces not found (caused by some interfaces having `@NONE` at the end of their names) in the crawler script.
- Re-ordered the dashboard layout (CPU - RAM - Disk - Network - Temp).
- Added splash image and resize icon.

## 0.1-cuttingedge.180029032024 (2024-03-29)

- Initial release

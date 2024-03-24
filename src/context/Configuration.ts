import { createContext } from "react";
import type { UserThemeType } from "../utils/def";

export const ConfigurationContext = createContext<{
    changeTheme: (mode: UserThemeType) => void,
    currentUserTheme: UserThemeType
} | null>(null);
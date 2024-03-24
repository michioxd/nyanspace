import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { ThirdPartyModule } from "i18next";
import { STORE_LANGUAGE_KEY } from "../utils/def";



const languageDetector: ThirdPartyModule = {
    type: "3rdParty",
    init: async (i) => {
        try {
            await AsyncStorage.getItem(STORE_LANGUAGE_KEY).then((language) => {
                if (language && language !== "SYSTEM") {
                    return i.changeLanguage(language);
                } else {
                    const cb = Localization.getLocales();
                    return i.changeLanguage(cb[0].languageCode ?? "en");
                }
            });
        } catch (error) {
            console.log("Error reading language", error);
        }
    }
};

export { languageDetector }
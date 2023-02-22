import { Density, Mode } from "@cloudscape-design/global-styles";
import { StateCreator } from "zustand"
import { PersistOptions } from "zustand/middleware"

export interface GeneralSettings {
    mode: Mode;
    density: Density;
    motion: string;
}


export interface SettingsState {
    generalSettings: GeneralSettings;
    setGeneralSettings: (settings: GeneralSettings) => void
}

export type SettingsPersist = (
    config: StateCreator<SettingsState>,
    options: PersistOptions<SettingsState>
) => StateCreator<SettingsState>
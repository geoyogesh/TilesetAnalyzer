import { Density, Mode } from '@cloudscape-design/global-styles';
import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import { GeneralSettings, SettingsPersist, SettingsState } from './model/SettingsState';

export const useSettingsStore = create<SettingsState>(
  (persist as SettingsPersist)(
    (set, get) => ({
      generalSettings: {
        mode: Mode.Light,
        density: Density.Comfortable,
        motion: 'False',
      },
      setGeneralSettings: (settings: GeneralSettings) =>
        set({
          generalSettings: {
            ...get().generalSettings,
            mode: settings.mode,
            density: settings.density,
            motion: settings.motion,
          },
        }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

import { FormField, Select } from "@cloudscape-design/components";
import { OptionDefinition } from "@cloudscape-design/components/internal/components/option/interfaces";
import { applyDensity, applyMode, Density, disableMotion, Mode } from "@cloudscape-design/global-styles";
import { FC, useEffect, useState } from "react";
import { useSettingsStore } from "../../Store/SettingsStore";


const GeneralSettingsTab: FC = () => {
    const modeOptions = [
        { label: "Light", value: Mode.Light },
        { label: "Dark", value: Mode.Dark },
    ];
    const densityOptions = [
        { label: "Compact", value: Density.Compact },
        { label: "Comfortable", value: Density.Comfortable },
    ];

    const motionOptions = [
        { label: "True", value: "True" },
        { label: "False", value: "False" },
    ];

    const [mode, setMode] = useState<OptionDefinition>({ label: "Light", value: Mode.Light });
    const [density, setDensity] = useState<OptionDefinition>({ label: "Comfortable", value: Density.Comfortable });
    const [motion, setMotion] = useState<OptionDefinition>({ label: "False", value: "False" });

    const generalSettings = useSettingsStore((state) => state.generalSettings);
    const setGeneralSettings = useSettingsStore((state) => state.setGeneralSettings);

    useEffect(() => {
        applyMode(generalSettings.mode);
        applyDensity(generalSettings.density);
        disableMotion(generalSettings.motion === "True");

        setMotion(motionOptions.find(item => item.value === generalSettings.motion)!);
        setMode(modeOptions.find(item => item.value === generalSettings.mode)!);
        setDensity(densityOptions.find(item => item.value === generalSettings.density)!);
    }, [generalSettings])

    return (
        <>
            <FormField
                label="Mode"
            >
                <Select
                    selectedOption={mode}
                    onChange={({ detail }) => {
                        setGeneralSettings({ ...generalSettings, mode: detail.selectedOption.value as any });
                        setMode(detail.selectedOption);
                    }

                    }
                    options={modeOptions}
                    selectedAriaLabel="Selected"
                />
            </FormField>
            <FormField
                label="Density"
            >
                <Select
                    selectedOption={density}
                    onChange={({ detail }) => {
                        setGeneralSettings({ ...generalSettings, density: detail.selectedOption.value as any });
                        setDensity(detail.selectedOption);
                    }

                    }
                    options={densityOptions}
                    selectedAriaLabel="Selected"
                />
            </FormField>
            <FormField
                label="Disable Motion"
            >
                <Select
                    selectedOption={motion}
                    onChange={({ detail }) => {
                        setGeneralSettings({ ...generalSettings, motion: detail.selectedOption.value as any });
                    }

                    }
                    options={motionOptions}
                    selectedAriaLabel="Selected"
                />
            </FormField>
        </>
    )
}

export default GeneralSettingsTab;

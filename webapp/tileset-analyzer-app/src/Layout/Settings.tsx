import { Box, Button, FormField, Modal, Select, SpaceBetween, Tabs } from "@cloudscape-design/components";
import { OptionDefinition } from "@cloudscape-design/components/internal/components/option/interfaces";
import { applyDensity, applyMode, Density, disableMotion, Mode } from "@cloudscape-design/global-styles";
import { useEffect, useState } from "react";
import { FC } from "react";
import { BoolEnum } from "./LayoutPage";

interface SettingsProps {
    visible: boolean;
    setVisible: any;
}

const Settings: FC<SettingsProps> = ({ visible, setVisible }) => {
    const [mode, setMode] = useState<OptionDefinition>({ label: "Light", value: Mode.Light });
    const [density, setDensity] = useState<OptionDefinition>({ label: "Comfortable", value: Density.Comfortable });
    const [motion, setMotion] = useState<OptionDefinition>({ label: "False", value: "False" });

    useEffect(() => {
        applyMode(mode.value as Mode);
    }, [mode])

    useEffect(() => {
        applyDensity(density.value as Density);
    }, [density])

    useEffect(() => {
        disableMotion((motion.value as BoolEnum) === "True");
    }, [motion])

    return (
        <Modal
            onDismiss={() => setVisible(false)}
            visible={visible}
            closeAriaLabel="Close modal"
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button variant="primary">Ok</Button>
                    </SpaceBetween>
                </Box>
            }
            header="Settings"
        >
            <Tabs
                tabs={[
                    {
                        label: "General",
                        id: "general",
                        content: (
                            <>
                                <FormField
                                    label="Mode"
                                >
                                    <Select
                                        selectedOption={mode}
                                        onChange={({ detail }) =>
                                            setMode(detail.selectedOption)
                                        }
                                        options={[
                                            { label: "Light", value: Mode.Light },
                                            { label: "Dark", value: Mode.Dark },
                                        ]}
                                        selectedAriaLabel="Selected"
                                    />
                                </FormField>
                                <FormField
                                    label="Density"
                                >
                                    <Select
                                        selectedOption={density}
                                        onChange={({ detail }) =>
                                            setDensity(detail.selectedOption)
                                        }
                                        options={[
                                            { label: "Compact", value: Density.Compact },
                                            { label: "Comfortable", value: Density.Comfortable },
                                        ]}
                                        selectedAriaLabel="Selected"
                                    />
                                </FormField>
                                <FormField
                                    label="Disable Motion"
                                >
                                    <Select
                                        selectedOption={motion}
                                        onChange={({ detail }) =>
                                            setMotion(detail.selectedOption)
                                        }
                                        options={[
                                            { label: "True", value: "True" },
                                            { label: "False", value: "False" },
                                        ]}
                                        selectedAriaLabel="Selected"
                                    />
                                </FormField>
                            </>
                        )
                    }
                ]}
            />
        </Modal>

    )
}

export default Settings;
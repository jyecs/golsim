import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
interface PresetDropdownProps {
    presets: string[];
    onSelect: (preset: string) => void;
    currPreset: string;
}


const PresetDropdown: React.FC<PresetDropdownProps> = ({presets, onSelect, currPreset}) => {
    return (
        <DropdownButton size="lg" id="dropdown-button" title={currPreset}>
            {
                presets.map((preset, idx) => (<Dropdown.Item key={idx} onClick={()=> onSelect(preset)}>{preset}</Dropdown.Item>))
            }
        </DropdownButton>
    )
}

export default PresetDropdown;
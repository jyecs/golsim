import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
interface PresetDropdownProps {
    presets: string[];
    onSelect: (preset: string) => void;
}


const PresetDropdown: React.FC<PresetDropdownProps> = ({presets, onSelect}) => {
    return (
        <DropdownButton id="dropdown-button" title="Dropdown Test">
            {
                presets.map((preset, idx) => (<Dropdown.Item key={idx} onClick={()=> onSelect(preset)}>{preset}</Dropdown.Item>))
            }
        </DropdownButton>
    )
}

export default PresetDropdown;
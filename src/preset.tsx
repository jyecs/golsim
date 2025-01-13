import Point from "./point";
function preset() {
    // It's easier to create presets that are centered at (0,0), but the center of the board is not there.
    // Might be a problem to fix.
    const shiftX = 20;
    const shifty = 20;
    const presets = ["acorn","R-pentomino","Diehard", "Still-lifes", "Oscillators"];

    const getPreset = (presetName: String) => {

    }

    const listPrests = () => { 
        return presets;
    }



    return { getPreset, listPrests };
}

export default preset;
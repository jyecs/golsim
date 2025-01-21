import Point from "./point";
function preset() {
    // It's easier to create presets that are centered at (0,0), but the center of the board is not there.
    // Might be a problem to fix.
    const shiftX = 20;
    const shiftY = 20;
    const presetNames = ["Acorn","R-pentomino","Diehard", "Still-lifes", "Oscillators"];
    const presets = {
        "Acorn": [
            [0,0],
            [1,0],
            [1,-2],
            [3,-1],
            [4,0],
            [5,0],
            [6,0]
        ],
        "R-pentomino": [
            [0,0],
            [-1,0],
            [0,1],
            [0,-1],
            [1,-1]
        ],
        "Diehard": [
            [0,0],
            [-1,0],
            [0,1],
            [4,1],
            [5,1],
            [6,1],
            [5,-1]
        ],
        "Oscillators": [[-14,1],[-13,1],[-12,1],[-13,-1],[-14,-1],[-12,-1],[-11,-4],[-11,-3],[-11,-2],[-9,-2],[-9,-3],[-9,-4],[-8,-1],[-7,-1],[-6,-1],[-8,1],[-7,1],[-6,1],[-9,2],[-9,3],[-9,4],[-16,2],[-16,3],[-16,4],[-8,6],[-7,6],[-6,6],[-4,2],[-4,3],[-4,4],[-4,-2],[-4,-3],[-4,-4],[-8,-6],[-7,-6],[-6,-6],[-16,-2],[-16,-3],[-16,-4],[-14,-6],[-13,-6],[-12,-6],[-11,2],[-11,3],[-11,4],[-12,6],[-13,6],[-14,6],[-8,-15],[-7,-15],[-6,-15],[-7,-14],[-6,-14],[-5,-14],[-14,-15],[-13,-15],[-12,-15],[-1,-15],[-1,-14],[0,-15],[0,-14],[1,-13],[1,-12],[2,-12],[2,-13],[11,-3],[11,-2],[11,-1],[12,-1],[13,-1],[13,-2],[13,-3],[12,-3],[11,0],[12,0],[13,0],[13,1],[12,1],[11,1],[11,2],[11,3],[11,4],[12,4],[13,3],[13,2],[12,2],[13,4]],
        "Still-lifes": [[-11,-14],[-11,-13],[-10,-13],[-10,-14],[-6,-13],[-5,-14],[-4,-14],[-3,-13],[-5,-12],[-4,-12],[1,-14],[2,-14],[3,-13],[3,-12],[0,-13],[1,-12],[2,-11],[6,-14],[6,-13],[7,-14],[7,-12],[8,-13],[12,-14],[11,-13],[12,-12],[13,-13]]
    }

    const getPreset = (presetName: string) => {
        return shiftPoints(presets[presetName]);
    }

    const listPrests = () => { 
        return presetNames;
    }

    const shiftPoints = (points: Array<number[]>) => {
        const coordsToPoints = new Array<Point>;
        points.forEach((point: Array<number>)=> {
            const x = point[0] + shiftX;
            const y = point[1] + shiftY;

            coordsToPoints.push(new Point(x,y))
        })

        return coordsToPoints;

    }
    let currentPreset = getPreset("Acorn");

    const getCurrentPreset = () => { return currentPreset }
    const setCurrentPreset = (preset: string) => { currentPreset = getPreset(preset) }



    return { getPreset, listPrests, getCurrentPreset, setCurrentPreset };
}

export default preset;
import Point from "./point";
function preset() {
    // It's easier to create presets that are centered at (0,0), but the center of the board is not there.
    // Might be a problem to fix.
    const shiftX = 20;
    const shiftY = 20;
    const presetNames = ["acorn","R-pentomino","Diehard", "Still-lifes", "Oscillators"];
    const presets = {
        "acorn": [
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
        ]
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



    return { getPreset, listPrests };
}

export default preset;
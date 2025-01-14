import Point from "./point";
function Gol() {

    // Current generation of living cells
    // Uses a hashmap since I want this to eventually become an infinite grid
    const livingCells = new Set<string>();
    const stragglers = new Set<string>();


    // TODO: advances the generation of the next step in GoL
    const next = () => { 
        const deltaGeneration = new Map<string, number>();
        const changeInGeneration = new Map<string, boolean>();
        livingCells.forEach((key: string) => {
            let neighbors = getNeighbors(key, changeInGeneration);
            computeNeighbors(deltaGeneration, neighbors);
        });

        deltaGeneration.forEach((numNeighbors: number, cell: string) => {
            console.log(`${cell} ${numNeighbors}`)
            if (numNeighbors < 2 || numNeighbors > 3) {
                livingCells.delete(cell);
                changeInGeneration.set(cell, false);
            } else if (numNeighbors === 3) {
                livingCells.add(cell);
                changeInGeneration.set(cell, true);
            }
        })
        stragglers.forEach((cell: string) => {
            livingCells.delete(cell);
        })

        stragglers.clear();

        return changeInGeneration;
    };

    const computeNeighbors = (gen: Map<string, number>, neighbors: Array<Array<number>>) => {
        neighbors.forEach((point: Array<Number>) => {
            const cell = `${point[0]} ${point[1]}`
            if (gen.has(cell)) {
                gen.set(cell, gen.get(cell) + 1);
            } else {
                gen.set(cell, 1);
            }
        })
    }

    const getNeighbors = (cell: string, changeInNeighbors: Map<string, boolean>) => {
        const neighbors = [];
        const coords = cell.split(" ");
        const x = Number.parseInt(coords[0]);
        const y = Number.parseInt(coords[1]);
        let numNeighbors = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (!(i === 0 && j === 0)) {
                    neighbors.push([x+i,y+j]);
                    if (livingCells.has(`${x + i} ${y + j}`)) { numNeighbors++ };
                }
            }
        }
        if (numNeighbors === 0) { changeInNeighbors.set(cell, false); stragglers.add(cell); }
        return neighbors;
    }

    const preLoadPoints = (points: Array<Point>) => {
        points.forEach((point: Point) => {
            livingCells.add(point.toStringKey());
        })
    }

    const addPoint = (point: Point) => {
        livingCells.add(point.toStringKey());
    }

    const clear = () => {
        livingCells.clear();
    }

    const getCells = () => { return livingCells };

    return {next, getCells, preLoadPoints, clear, addPoint};

};
export default Gol
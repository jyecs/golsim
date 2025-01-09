function Gol() {
    class Point {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        toStringKey() {
            return `${this.x} ${this.y}`;
        }
    }

    // Current generation of living cells
    // Uses a hashmap since I want this to eventually become an infinite grid
    const livingCells = new Set<String>();
    const test1 = new Point(0,-1);
    const test2 = new Point(0,0);
    const test3 = new Point(0,1);

    livingCells.add(test1.toStringKey());
    livingCells.add(test2.toStringKey());
    livingCells.add(test3.toStringKey());


    // TODO: advances the generation of the next step in GoL
    const next = () => { 
        const deltaGeneration = new Map<String, number>();
        livingCells.forEach((key: String) => {
            let neighbors = getNeighbors(key);
            computeNeighbors(deltaGeneration, neighbors);
        });

        deltaGeneration.forEach((numNeighbors: number, cell: String) => {
            if (numNeighbors < 2 || numNeighbors > 3) {
                livingCells.delete(cell);
            } else if (numNeighbors === 3) {
                livingCells.add(cell);
            }
        })
    };

    const computeNeighbors = (gen: Map<String, number>, neighbors: Array<Array<number>>) => {
        neighbors.forEach((point: Array<Number>) => {
            const cell = `${point[0]} ${point[1]}`
            if (gen.has(cell)) {
                gen.set(cell, gen.get(cell) + 1);
            } else {
                gen.set(cell, 1);
            }
        })
    }

    const getNeighbors = (cell: String) => {
        const neighbors = [];
        const coords = cell.split(" ");
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (!(i === 0 && j === 0)) {
                    neighbors.push([parseInt(coords[0]) + i, parseInt(coords[1]) + j]);
                }
            }
        }
        return neighbors;
    }

    const preLoadPoints = (points: Array<Point>) => {
        points.forEach((point: Point) => {
            livingCells.add(point.toStringKey());
        })
    }
    const getCells = () => { return livingCells };

    return {next, getCells, preLoadPoints};

};
export default Gol
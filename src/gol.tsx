function Gol() {
    class Point {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }

    // Current generation of living cells
    // Uses a hashmap since I want this to eventually become an infinite grid
    const livingCells = new Set<Point>();
    let called = 0;
    const test1 = new Point(0,-1);
    const test2 = new Point(0,0);
    const test3 = new Point(0,1);

    livingCells.add(test1);
    livingCells.add(test2);
    livingCells.add(test3);

    const testMap = new Map<Array<number>, number>();
    const p1 = [0, 0]
    const p2 = [0, 0]
    testMap.set(p1,1);
    console.log(testMap.get(p1));


    

    // TODO: advances the generation of the next step in GoL
    const next = () => { 
        const deltaGeneration = new Map<Point, number>();
        livingCells.forEach((key: Point) => {
            let neighbors = getNeighbors(key);
            computeNeighbors(deltaGeneration, neighbors);
        });

        deltaGeneration.forEach((numNeighbors: number, cell: Point) => {
            if (numNeighbors < 2 || numNeighbors > 3) {
                livingCells.delete(cell);
            } else {
                livingCells.add(cell);
            }
        })
    };

    const computeNeighbors = (gen: Map<Point, number>, neighbors: Array<Point>) => {
        neighbors.forEach((point: Point) => {
            if (gen.has(point)) {
                gen.set(point, gen.get(point) + 1);
            } else {
                gen.set(point, 1);
            }
        })
    }

    const getNeighbors = (cell: Point) => {
        const neighbors = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (!(i === 0 && j === 0)) {
                    neighbors.push(new Point(cell.x + i, cell.y + j));
                }
            }
        }
        return neighbors;
    }

    const getCells = () => { return livingCells };

    return {next, getCells};

};
export default Gol
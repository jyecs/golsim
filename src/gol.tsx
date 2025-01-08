function Gol() {
    class Point {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }

    //Current generation of living cells
    const livingCells = new Map<Point, number>();

    // TODO: advances the generation of the next step in GoL
    const next = () => { };

    const getCells = () => { return livingCells };

};
export default Gol
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

export default Point
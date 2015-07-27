module FdglMath {

    export function binomial(n, k) {
        console.log("binomial(" + n + ", " + k + ")");
        var result = 0;

        result = factorial(n) / (factorial(k) * factorial(n - k));

        return result;
    }

    export function factorial(n) {
        var rval=1;
        for (var i = 2; i <= n; i++)
            rval = rval * i;
        return rval;
    }

    export class Point2d{
        public x: number = 0;
        public y: number = 0;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        public translate(xD: number, yD: number) {
            this.x += xD;
            this.y += yD;
        }
    }

    //    export class Point2dArray{
    //        public points: Array<Point2d> = new Array<Point2d>();
    //        
    //        constructor(point2dArray: Points[]) {
    //            for(var i: number = 0; i < pointsArray.length; i += 2) {
    //                this.points.push(new Point2d(pointsArray[i], pointsArray[i+1]));
    //            }
    //        constructor(pointsArray: number[]) {
    //            for(var i: number = 0; i < pointsArray.length; i += 2) {
    //                this.points.push(new Point2d(pointsArray[i], pointsArray[i+1]));
    //            }
    //        }
    //    }

    export class vec2{
        public x0: number = 0;
        public x1: number = 0;
        
        constructor(x0, x1) {
            this.x0 = x0;
            this.x1 = x1;
        }

        public add(v0: vec2) {
            return new vec2(this.x0 + v0.x0, this.x1 + v0.x1);
        }

        public mul(n: number) {
            return new vec2(this.x0 * n, this.x1 * n);
        }
    }

    export class mat3 {
        public values: number[];
        
        constructor(values: number[]) {
            this.values = values;
        }

        public times(multi: mat3) {
            var result: number[] = [];
            var resultMatrix: mat3;

            result[0] = this.values[0] * multi.values[0] + this.values[1] * multi.values[3] + this.values[2] * multi.values[6];
            result[1] = this.values[0] * multi.values[1] + this.values[1] * multi.values[4] + this.values[2] * multi.values[7];
            result[2] = this.values[0] * multi.values[2] + this.values[1] * multi.values[5] + this.values[2] * multi.values[8];

            result[3] = this.values[3] * multi.values[0] + this.values[4] * multi.values[3] + this.values[5] * multi.values[6];
            result[4] = this.values[3] * multi.values[1] + this.values[4] * multi.values[4] + this.values[5] * multi.values[7];
            result[5] = this.values[3] * multi.values[2] + this.values[4] * multi.values[5] + this.values[5] * multi.values[8];

            result[6] = this.values[6] * multi.values[0] + this.values[7] * multi.values[3] + this.values[8] * multi.values[6];
            result[7] = this.values[6] * multi.values[1] + this.values[7] * multi.values[4] + this.values[8] * multi.values[7];
            result[8] = this.values[6] * multi.values[2] + this.values[7] * multi.values[5] + this.values[8] * multi.values[8];

            resultMatrix = new mat3(result);

            return resultMatrix;
        }

        public getArray(): number[] {
            return this.values;
        }
    }
}


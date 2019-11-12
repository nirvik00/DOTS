function Grid(ansx, ansy, anox, anoy, anmx, anmy) {
    this.sx = ansx; // scale (in pixels) of x and y - could be different
    this.sy = ansy;
    this.ox = anox; // offset (in pixels) of x and y 
    this.oy = anoy;
    this.mx = anmx; // count in x and y
    this.my = anmy;

    this.setup3D = function (as3x, as3y, as3z, ao3x, ao3y, ao3z) {
        this.s3x = as3x;
        this.s3y = as3y;
        this.s3z = as3z;
        this.o3x = ao3x;
        this.o3y = ao3y;
        this.o3z = ao3z;
    }

    this.setLevels = function (someLevels) {
        this.levels = someLevels;
    }
    
    this.indTo3D = function (indvec) {
        var ret3D = createVector(indvec.x * this.s3x + this.o3x, indvec.y * this.s3y + this.o3y);
        return ret3D;
    }

    // some helper functions - changing index to pix locations and vice versa
    this.indToPix = function (indvec) {
        var retmousePix = createVector(indvec.x * this.sx + this.ox, indvec.y * this.sy + this.oy);
        return retmousePix;
    }

    this.pixToInd = function (vec) {
        var myx = round((vec.x - this.ox) / this.sx);
        var myy = round((vec.y - this.oy) / this.sy);
        var retInd = { "x": myx, "y": myy };
        //console.log(retmouse.x + ", " + retmouse.y);
        return retInd;
    }

    // rounds a pix location by converting pix to ind and then back to pix
    this.round = function (vec) {
        return this.indToPix(this.pixToInd(vec));
    }

    // draws the grid points
    this.draw = function () {
        for (var i = 0; i < this.mx; i++) {
            for (var j = 0; j < this.my; j++) {
                // basically indToPix
                point(i * this.sx + this.ox, j * this.sy + this.oy);
            }
        }
    };

    this.mouseInsideGrid = function () {
        var mouseInd = this.pixToInd({ "x": mouseX, "y": mouseY });
        var retval = !(mouseInd.x < 0 || mouseInd.y < 0 || mouseInd.x > this.mx || mouseInd.y > this.my);
        return retval;
    }

    this.orthoPoint = function (currenPoint, lastPoint) {
        /*     console.log(_orthoMode);
            if (_orthoMode) { */
        console.log("Here!")
        if (Math.abs(lastPoint.x - currenPoint.x) > Math.abs(lastPoint.y - currenPoint.y)) {
            currenPoint.y = lastPoint.y;
        }
        else {
            currenPoint.x = lastPoint.x;
        }
        return currenPoint;
    }

}
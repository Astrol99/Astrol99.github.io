/*
List of States
------------------
- start      | Starting node to search from
- goal       | Goal node to find
- walkable   | Nodes that can be walked on
- discovered | Neighbors found from starting or explored nodes
- explored   | Neighbor with lowest f cost from all discovered nodes
- obstacle   | Node that cannot be crossed into
*/

function node(x, y, size) {
    // Absolute coords on canvas
    this.x = x;
    this.y = y;

    // Grid array coords
    this.gX = (x/size);
    this.gY = (y/size);

    this.size = size;   // px length of node sides (square)

    this.state = "walkable";    // Current state of node

    // A* Variables
    this.g; // Cost of the cheapest path from start to node
    this.h; // Cost to reach goal from node
    this.f; // f(n) = g(n) + h(n)

    // Get 8 nodes around this node
    this.getNeighbors = function (grid) {
        let neighbors = [];

        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){

                let gridX = i + this.gX - 1;
                let gridY = j + this.gY - 1;

                // If coords are out of bounds
                if ((gridX < 0 || gridY < 0) || gridX > grid.length-1 || gridY > grid[0].length-1) 
                    continue;

                // Skip if coords are equal to current node or is an obstacle
                if ((gridX == this.gX && gridY == this.gY) || grid[gridX][gridY].state == "obstacle")
                    continue;
                

                neighbors.push(grid[gridX][gridY]);
            }
        }

        return neighbors;
    }

    // Show node on cavas 
    this.show = function (r=255,g=255,b=255) {
        fill(r, g, b);
        square(this.x, this.y, this.size);
        fill(255);
    }

    // Updates node color and state var
    this.changeState = function (state) {
        switch (state) {
            case "start":
                this.show(0, 255, 0);
                break;
            case "goal":
                this.show(255, 0, 0);
                break;
            case "discovered":
                this.show(31, 194, 80);
                break;
            case "explored":
                this.show(34, 201, 160);
                break;
            case "obstacle":
                this.show(97, 120, 103);
                break;
        }

        this.state = state;
        this.displayCosts();
    }


    // Show A* costs on square
    this.displayCosts = function () {
        if (this.g == null)
            return;
        
        textSize(8);
        
        textAlign(LEFT);
        fill(0);
        text(Math.round(this.g), this.x+5, this.y+15);
        
        textAlign(RIGHT);
        text(Math.round(this.h), this.x+43, this.y+15);
        
        textAlign(CENTER);
        textSize(14);
        text(Math.round(this.f), this.x+25, this.y+45);
    }
}

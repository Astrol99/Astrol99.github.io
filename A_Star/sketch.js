const size = 50; // px size of square sides
// Starter nodes
let start;
let goal;
let grid = []; // 2d array of nodes
// A* stuff
let openSet = []; // Set of discovered nodes
let previous = []; // Cheapest node from start currently known
let currentNode;
let pathway = [];
// DOM Widgets
let startBtn;
let speedLabel;
let speedSlider;

function setup() {
    frameRate(50);
    createCanvas(Math.floor(windowWidth/100)*100, Math.floor(windowHeight/100)*100);
    console.log("A*");

    startBtn = createButton("Start");
    resetBtn = createButton("Reset");
    speedSlider = createSlider(1, 100, 50);
    speedLabel = createSpan(`Speed/FPS: ${speedSlider.value()}`);

    startBtn.mousePressed(function () {
        // Start node is known so push into openSet
        openSet.push(start)
    });

    resetBtn.mousePressed(initGrid);

    // Live update slider span text
    speedSlider.input(function () {
        speedLabel.html(`Speed/FPS: ${speedSlider.value()}`);
        frameRate(speedSlider.value())
;    });

    initGrid();
}

// A* based on https://en.wikipedia.org/wiki/A*_search_algorithm
function draw() {
    if (openSet.length > 0) {

        // Sort openSet by lowest f values 
        openSet = openSet.sort(function (a,b) {
            return a.f - b.f;
        });

        // Get node in openSet with lowest f cost
        currentNode = openSet[0];

        if (currentNode.state != "start")
            currentNode.changeState("explored");
            pathway.push(currentNode)

        // Remove node with lowest f cost
        openSet.shift();

        for (const neighbor of currentNode.getNeighbors(grid)) {

            if (neighbor.state == "start" || neighbor.state == "explored")
                continue;

            if (neighbor.state == "goal") {
                console.log("Found Path!");
                openSet = [];
                break;
            }

            /* Euclidian Distance */
            neighbor.g = dist(start.x, start.y, neighbor.x, neighbor.y);
            neighbor.h = dist(goal.x, goal.y, neighbor.x, neighbor.y);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.changeState("discovered");

            if (!containsObj(neighbor, openSet));
                openSet.push(neighbor);
        }
        
    }
    
}

function mousePressed() {
    let nearX = Math.floor(mouseX / size);
    let nearY = Math.floor(mouseY / size);
    
    if (grid[nearX] && grid[nearX][nearY])
        grid[nearX][nearY].changeState("obstacle");
}

function mouseDragged() {
    let nearX = Math.floor(mouseX / size);
    let nearY = Math.floor(mouseY / size);

    if (grid[nearX] && grid[nearX][nearY])
        grid[nearX][nearY].changeState("obstacle");
}

function createGrid() {
    for (let x = 0; x < width; x += size) {
        let row = [];
        
        for (let y = 0; y < height; y += size) {
            let tempNode = new node(x, y, size);
            tempNode.show();
            row.push(tempNode);
        }

        grid.push(row);
    }
}

// Restart/start grid with start and end inital coordinates
function initGrid(startx=0, starty=0, goalx=(width/size)-1, goaly=(height/size)-1) {
    // Restart variables
    grid = [];
    openSet = [];
    previous = [];
    
    createGrid();

    start = grid[startx][starty];
    goal = grid[goalx][goaly];

    start.changeState("start");
    goal.changeState("goal");

    // Inital F-cost A* Calculations for starting node
    start.g = 0;
    start.h = dist(start.x, start.y, goal.x, goal.y);
    start.f = start.g + start.h;

}

function containsObj(obj, list) {
    let x;

    for (x in list) {
        if (list.hasOwnProperty(x) && list[x] === obj)
            return true;
    }

    return false;
}

function windowResized() {
    resizeCanvas(Math.floor(windowWidth/100)*100, Math.floor(windowHeight/100)*100);
    initGrid();
}
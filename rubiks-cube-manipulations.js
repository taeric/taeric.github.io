
// [[file:~/projects/taeric.github.io/cube-permutations-1.org::*Automating%20more%20of%20this.][Automating\ more\ of\ this\.:1]]

function createCubeDiv() {
    var cube = withAttribute(div(),
                             "class",
                             "cube");
    var colors = ["green",
                  "red",
                  "blue",
                  "orange",
                  "white",
                  "yellow"]
   for (var i = 0; i < 54; i++) {
        cube.appendChild(withAttribute(div(withAttribute(div(),
                                                         "class",
                                                         colors[Math.floor(i / 9)])),
                                       "class",
                                       "face face" + (i + 1)));
                                       
    }
    return cube;
}

// Automating\ more\ of\ this\.:1 ends here

// [[file:~/projects/taeric.github.io/cube-permutations-1.org::*Automating%20more%20of%20this.][Automating\ more\ of\ this\.:1]]

function div(child) {
    var element = document.createElement("div");
    if (child) {
        element.appendChild(child);
    }
    return element;
}

function withAttribute(element, name, value) {
    element.setAttribute(name, value);
    return element;
}

// Automating\ more\ of\ this\.:1 ends here

// [[file:~/projects/taeric.github.io/cube-permutations-1.org::*Automating%20more%20of%20this.][Automating\ more\ of\ this\.:1]]

function appendCubeToCssSelector(selector) {
    Array.from(document.querySelectorAll(selector)).forEach(function(node) {
        node.appendChild(createCubeDiv());
    });
}

// Automating\ more\ of\ this\.:1 ends here

// [[file:~/projects/taeric.github.io/cube-permutations-1.org::*Automating%20more%20of%20this.][Automating\ more\ of\ this\.:1]]

var CubeMoves = {
    "R" : [ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10,
            11, 39, 13, 14, 42, 16, 17, 45, 21, 24,
            27, 20, 23, 26, 19, 22, 25, 54, 29, 30,
            51, 32, 33, 48, 35, 36, 37, 38, 34, 40,
            41, 31, 43, 44, 28, 46, 47, 12, 49, 50,
            15, 52, 53, 18 ],
    "R'" : [ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10,
             11, 48, 13, 14, 51, 16, 17, 54, 25, 22,
             19, 26, 23, 20, 27, 24, 21, 45, 29, 30,
             42, 32, 33, 39, 35, 36, 37, 38, 12, 40,
             41, 15, 43, 44, 18, 46, 47, 34, 49, 50,
             31, 52, 53, 28 ],
    "L" : [ 3,  6,  9,  2,  5,  8,  1,  4,  7, 46,
            11, 12, 49, 14, 15, 52, 17, 18, 19, 20,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 43,
            31, 32, 40, 34, 35, 37, 10, 38, 39, 13,
            41, 42, 16, 44, 45, 36, 47, 48, 33, 50,
            51, 30, 53, 54 ],
    "L'" : [ 7,  4,  1,  8,  5,  2,  9,  6,  3, 37,
             11, 12, 40, 14, 15, 43, 17, 18, 19, 20,
             21, 22, 23, 24, 25, 26, 27, 28, 29, 52,
             31, 32, 49, 34, 35, 46, 36, 38, 39, 33,
             41, 42, 30, 44, 45, 10, 47, 48, 13, 50,
             51, 16, 53, 54 ],
    "U" : [ 28, 29, 30,  4,  5,  6,  7,  8,  9, 1,
            2, 3, 13, 14, 15, 16, 17, 18, 10, 11,
            12, 22, 23, 24, 25, 26, 27, 19, 20, 21,
            31, 32, 33, 34, 35, 36, 39, 42, 45, 38,
            41, 44, 37, 40, 43, 46, 47, 48, 49, 50,
            51, 52, 53, 54 ],
    "U'" : [ 10, 11, 12,  4,  5,  6,  7,  8,  9, 19,
             20, 21, 13, 14, 15, 16, 17, 18, 28, 29,
             30, 22, 23, 24, 25, 26, 27, 1, 2, 3,
             31, 32, 33, 34, 35, 36, 43, 40, 37, 44,
             41, 38, 45, 42, 39, 46, 47, 48, 49, 50,
             51, 52, 53, 54 ],
    "D" : [ 1,  2,  3,  4,  5,  6,  16, 17, 18, 10,
            11, 12, 13, 14, 15, 25, 26, 27, 19, 20,
            21, 22, 23, 24, 34, 35, 36, 28, 29, 30,
            31, 32, 33, 7, 8, 9, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 48, 51, 54, 47, 50,
            53, 46, 49, 52 ],
    "D'" : [ 1,  2,  3,  4,  5,  6,  34, 35, 36, 10,
             11, 12, 13, 14, 15, 7, 8, 9, 19, 20,
             21, 22, 23, 24, 16, 17, 18, 28, 29, 30,
             31, 32, 33, 25, 26, 27, 37, 38, 39, 40,
             41, 42, 43, 44, 45, 52, 49, 46, 53, 50,
             47, 54, 51, 48 ],
    "F" : [ 1,  2,  45,  4,  5, 44,  7,  8, 43, 12,
            15, 18, 11, 14, 17, 10, 13, 16, 48, 20,
            21, 47, 23, 24, 46, 26, 27, 28, 29, 30,
            31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 19, 22, 25, 3, 6, 9, 49, 50,
            51, 52, 53, 54 ],
    "F'" : [ 1,  2,  46,  4,  5, 47,  7,  8, 48, 16,
             13, 10, 17, 14, 11, 18, 15, 12, 43, 20,
             21, 44, 23, 24, 45, 26, 27, 28, 29, 30,
             31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
             41, 42, 9, 6, 3, 25, 22, 19, 49, 50,
             51, 52, 53, 54 ],
    "B" : [ 52,  2,  3,  53,  5,  6,  54,  8,  9, 10,
            11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
            37, 22, 23, 38, 25, 26, 39, 30, 33, 36,
            29, 32, 35, 28, 31, 34, 7, 4, 1, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
            51, 27, 24, 21 ],
    "B'" : [ 39,  2,  3,  38,  5,  6,  37,  8,  9, 10,
             11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
             54, 22, 23, 53, 25, 26, 52, 34, 31, 28,
             35, 32, 29, 36, 33, 30, 21, 24, 27, 40,
             41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
             51, 1, 4, 7 ],
    "α" : [ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10,
            38, 12, 13, 41, 15, 16, 44, 18, 19, 20,
            21, 22, 23, 24, 25, 26, 27, 28, 53, 30,
            31, 50, 33, 34, 47, 36, 37, 35, 39, 40,
            32, 42, 43, 29, 45, 46, 11, 48, 49, 14,
            51, 52, 17, 54 ],
    "β" : [ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10,
            47, 12, 13, 50, 15, 16, 53, 18, 19, 20,
            21, 22, 23, 24, 25, 26, 27, 28, 44, 30,
            31, 41, 33, 34, 38, 36, 37, 11, 39, 40,
            14, 42, 43, 17, 45, 46, 35, 48, 49, 32,
            51, 52, 29, 54 ],
    "γ" : [ 1,  49,  3,  4,  50,  6,  7,  51,  9, 10,
            11, 12, 13, 14, 15, 16, 17, 18, 19, 40,
            21, 22, 41, 24, 25, 42, 27, 28, 29, 30,
            31, 32, 33, 34, 35, 36, 37, 38, 39, 8,
            5, 2, 43, 44, 45, 46, 47, 48, 26, 23,
            20, 52, 53, 54 ],
    "δ" : [ 1,  42,  3,  4,  41,  6,  7,  40,  9, 10,
            11, 12, 13, 14, 15, 16, 17, 18, 19, 51,
            21, 22, 50, 24, 25, 49, 27, 28, 29, 30,
            31, 32, 33, 34, 35, 36, 37, 38, 39, 20,
            23, 26, 43, 44, 45, 46, 47, 48, 2, 5,
            8, 52, 53, 54 ],
    "ε" : [ 1,  2,  3,  13,  14,  15,  7,  8,  9, 10,
            11, 12, 22, 23, 24, 16, 17, 18, 19, 20,
            21, 31, 32, 33, 25, 26, 27, 28, 29, 30,
            4, 5, 6, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
            51, 52, 53, 54 ],
    "ω" : [ 1,  2,  3,  31,  32,  33,  7,  8,  9, 10,
            11, 12, 4, 5, 6, 16, 17, 18, 19, 20,
            21, 13, 14, 15, 25, 26, 27, 28, 29, 30,
            22, 23, 24, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
            51, 52, 53, 54 ]
};

// Automating\ more\ of\ this\.:1 ends here

// [[file:~/projects/taeric.github.io/cube-permutations-1.org::*Automating%20more%20of%20this.][Automating\ more\ of\ this\.:1]]

function applyCubeMove(cube, moveName) {
    if (!CubeMoves[moveName]) {
        throw "Unknown move '" + moveName + "'";
    }
    if (!cube) {
        throw "Need the cube that we will be modifying."
    }
    var movesToMake = [];
    CubeMoves[moveName].forEach(function (item, index) {
        if (item != (index + 1)) {
            movesToMake.push({
                "div" : cube.querySelector(".face"+(index+1)),
                "target" : item
            });
        }
    });
    movesToMake.forEach(function(item) {
        item.div.setAttribute("class", "face face"+item.target);
    });
}

// Automating\ more\ of\ this\.:1 ends here

// [[file:~/projects/taeric.github.io/cube-permutations-1.org::*Automating%20more%20of%20this.][Automating\ more\ of\ this\.:1]]

function appendMoveListToCssSelector(selector) {
    Array.from(document.querySelectorAll(selector)).forEach(function(node) {
        var moveListDiv = withAttribute(div(text("Move List:")),
                                        "class",
                                        "move-list");
        node.appendChild(moveListDiv)
        for (var move in CubeMoves) {
            moveListDiv.appendChild(withOnClick(function(move) {
                return function() {
                    applyCubeMove(node, move);
                };
            }(move), button(text(move))));
        }
    });
}

function button(child) {
    var element = document.createElement("button");
    if (child) {
        element.appendChild(child);
    }
    return element;
}

function text(text) {
    return document.createTextNode(text);
}

function withOnClick(f, element) {
    element.onclick = f;
    return element;
}

// Automating\ more\ of\ this\.:1 ends here

function element(name, children) {
    var el = document.createElement(name), i;
    if (children) {
        for(i = 0; i < children.length; i++) {
            var child = children[i];
            if (typeof child === "string") {
                el.appendChild(document.createTextNode(child));
            } else {
                el.appendChild(child);
            }
        };
    }
    return el;
}
function div()   { return element("div", arguments);   }
function table() { return element("table", arguments); }
function tbody() { return element("tbody", arguments); }
function tr()    { return element("tr", arguments);    }
function td()    { return element("td", arguments);    }
function span()  { return element("span", arguments);  }
function withAttribute(element, attr, value) {
    element.setAttribute(attr, value);
    return element;
}
function withClassname(element, cls) {
    return withAttribute(element, "class", cls);
}
function withMouseMoveListener(element, listener) {
    element.onmouseover = listener;
    return element;
}
function slider() {
    return withAttribute(
        withAttribute(element("input"), "type", "range"),
        "min", "0");
}


function makeSudokuBoard() {
    var i, j, board = tbody();
    for (i = 0; i < 9; i++) {
        var row = tr();
        for (j = 0; j < 9; j++) {
            var cell = withClassname(td(), "r" + i + " c" + j + " g" + (Math.floor(i/3)*3 + Math.floor(j/3)));
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
    return withClassname(table(board), "sudokuBoard");
}

function clearBoard(board) {
    var i, cells = board.querySelectorAll("td");
    for (i = 0; i < cells.length; i++) {
        var cell = cells[i];
        cell.innerHTML = "";
    }

}

function setBoardFromString(board, strings, additionalStyle) {
    var i, j;
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            var curValue = strings[i].charAt(j);
            if (curValue && curValue !== '.') {
                var cell = board.querySelector("td.r"+i+".c"+j);
                cell.innerHTML = "";
                cell.appendChild(document.createTextNode(curValue));

                if (cell.className.indexOf(additionalStyle) === -1)
                    cell.className += " " + additionalStyle;
            }
        }
    }
}

function parseAndReplaceWithBoard(divId, solve) {
    var divEl = document.getElementById(divId),
        data = divEl.innerHTML.trim(),
        board = makeSudokuBoard(),
        solutions,
        sliderEl = slider(),
        progressHeaderEl = div();

    divEl.innerHTML = "";
    setBoardFromString(board, data.split("\n"), "given");

    if (solve) {
        solutions = dlxSudokuSolver(data.split("\n"), true);
        sliderEl.setAttribute("max", solutions.length-1);
        sliderEl.setAttribute("value", 0);
        divEl.appendChild(progressHeaderEl);
        divEl.appendChild(board);
        divEl.appendChild(sliderEl);
        progressHeaderEl.innerHTML = sliderEl.value+" / "+(solutions.length - 1);
        sliderEl.oninput = function() {
            progressHeaderEl.innerHTML = sliderEl.value+" / "+(solutions.length-1);
            clearCells(board, "solution");
            setBoardFromString(board, toSudokuStrings(solutions[sliderEl.value]), "solution");
        }
    } else {
        divEl.appendChild(board);
    }
}

function clearCells(board, style) {
    var cells = board.querySelectorAll("." + style),
        i;
    for (i = 0; i < cells.length; i++) {
        cells[i].innerHTML = "";
    }
}
function toSudokuStrings(solution) {
    var positions = [], i, j, k, d;
    for (i = 0; i < 9; i++) {
        positions[i] = ['.', '.', '.','.', '.', '.','.', '.', '.'];
    }

    for (i = 0; i < solution.length; i++) {
        var position = /p(\d)(\d)/.exec(solution[i]);
        d = parseInt(/r\d(\d)/.exec(solution[i])[1]) + 1;
        j = position[1];
        k = position[2];
        positions[j][k] = d;
    }
    return positions.map(function(v) {return v.join("");});;
}

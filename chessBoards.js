// [[file:DancingLinks.org::*Board%20Highlighting][Board\ Highlighting:1]]
function element(name, children) {
    var el = document.createElement(name);
    if (children) {
        Array.from(children).forEach(function(child) {
            if (typeof child === "string") {
                el.appendChild(document.createTextNode(child));
            } else {
                el.appendChild(child);
            }
        });
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


function makeVisualization(n, method) {
    var board = makeBoard(n),
        input = slider(),
        curState = span(),
        states = method(n, true);

    input.setAttribute("max", states.length - 1);
    curState.innerHTML = "0 / " + (states.length - 1);
    input.value = 0;
    input.oninput = function () {
        curState.innerHTML = input.value + " / " + (states.length - 1);
        clearQueens(board);
        states[input.value].forEach(function (s) {
            placeQueen(board, "."+s.toString().trim().replace(/ /g, '.'));
        });
    }

    return withClassname(div(curState, board, input), "visualization");
}

function makeBoard(n) {
    var r = n, c = n;
    var rows = tbody();
    for (var i = 0; i < r; i++) {
        var row = tr();
        rows.appendChild(row);
        for (var j = 0; j < c; j++) {
            var cell = td();
            var cls = "";
            cls += " R"+i;
            cls += " F"+j;
            cls += " A"+ (i + j);
            cls += " B"+ (n - 1 - j + i);
            cell.setAttribute("class", cls.trim());
            row.appendChild(cell);
        }
    }
    return withMouseMoveListener(withClassname(table(rows),
                                               "chessboard"),
                                 hoverListener);
}

function clearHighlight(board, cls) {
    Array
        .from(board.querySelectorAll('.'+cls))
        .forEach(function(v) {
            v.setAttribute("class",
                           v.getAttribute("class")
                           .replace(new RegExp(cls, 'g'), "").trim());

        });

}

function getAttackingClasses(cls) {
    if (! cls)
        return null;

    cls = cls.replace(/.*(R.*B\d+).*/, "$1");
    cls = cls.replace(/((R|F|A|B)\d+)/g, ".$1");
    cls = cls.replace(/ /g, ",");
    return cls
}

function highlight(parent, cls, highlightCls) {
    if (! highlightCls)
        highlightCls = "highlight";

    Array.from(parent.querySelectorAll(cls))
        .forEach(function(v) {
            var curCls = v.getAttribute("class");
            if (!curCls.contains(highlightCls)) {
                v.setAttribute("class",
                               curCls + " " + highlightCls);
            }
        });

}

function hoverListener(e) {
    if (e.target.tagName === 'TD' &&
        e.target
        .parentElement
        .parentElement
        .parentElement.getAttribute("class") === "chessboard") {
        var rows = e.target.parentElement.parentElement;
        clearHighlight(rows, 'highlight');
        var toggleCls = getAttackingClasses(e.target.getAttribute("class"));
        if (toggleCls) {
            highlight(rows, toggleCls);
        }
    }
}

function placeQueen(board, posSelector) {
    var position = board.querySelector(posSelector);
    //Yes, this is the unicode for the queen symbol...
    position.appendChild(document.createTextNode("\u2655"));
    var highlightCls = getAttackingClasses(position.getAttribute("class"));
    highlight(board, highlightCls, 'attacked');
}

function clearQueens(board) {
    Array.from(board.querySelectorAll("td")).forEach(function(td) {
        if (td.firstChild)
            td.removeChild(td.firstChild);
    });
    clearHighlight(board, 'attacked');
}
// Board\ Highlighting:1 ends here

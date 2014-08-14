// [[file:Sudoku.org::*Outline][dlx_sudoku_solver]]
function dlxSudokuSolver(strings, showSteps) {
    var headers, solutions = [], O = [];

        // [[file:~/repositories/taeric.github.io/Sudoku.org::*DLX%20core][dlx_search]]
        function search(k) {
            var c, r;
            if (headers.right === headers) {
                solutions.push(copySolution());
                return;
            }
            if (showSteps) {
                solutions.push(copySolution());
            }
            c = smallestColumn();
            cover(c);
            r = c.down;
            while (r !== c) {
                O.push(printRow(r));
                r = r.right;
                while (r.col !== c) {
                    cover(r.col);
                    r = r.right;
                }
                search(k + 1);
                r = r.left;
                while (r.col !== c) {
                    uncover(r.col);
                    r = r.left;
                }
                r = r.down;
                O.pop();
            }
            uncover(c);
        }
        // dlx_search ends here

        // [[file:~/repositories/taeric.github.io/Sudoku.org::*DLX%20core][dlx_cover_uncover]]
        function cover(c) {
            var r = c.down;
            c.right.left = c.left;
            c.left.right = c.right;
            while (r !== c) {
                r = r.right;
                while (r.col !== c) {
                    r.up.down = r.down;
                    r.down.up = r.up;
                    r.col.size--;
                    r = r.right;
                }
                r = r.down;
            }
        }
        
        function uncover(c) {
            var r = c.up;
            c.right.left = c;
            c.left.right = c;
            while (r !== c) {
                r = r.left;
                while (r.col !== c) {
                    r.up.down = r;
                    r.down.up = r;
                    r.col.size++;
                    r = r.left;
                }
                r = r.up;
            }
        }
        // dlx_cover_uncover ends here

        // [[file:~/repositories/taeric.github.io/Sudoku.org::*DLX%20core][dlx_utilities]]
        function smallestColumn() {
            var h, c, s = Number.MAX_VALUE;
            h = headers.right;
            while (h !== headers) {
                if (h.size < s) {
                    c = h;
                    s = c.size;
                }
                h = h.right;
            }
            return c;
        }
        function printRow(r) {
            var s = r.col.name + ' ', e = r;
            r = r.right;
            while (r !== e) {
                s += r.col.name + ' ';
                r = r.right;
            }
            return s;
        }
        function copySolution() {
            var solution = [].concat(O);
            return solution;
        }
        
        // dlx_utilities ends here

        // [[file:~/repositories/taeric.github.io/Sudoku.org::*Outline][dlx_initialize_headers]]
        function initializeHeaders() {
                // [[file:~/repositories/taeric.github.io/Sudoku.org::*Needed%20variables][variables_needed_for_headers]]
                var rows = [],
                    cols = [],
                    grps = [],
                    positions = [],
                    rawHeaders = [],
                    rawRows = [],
                    i, j, k;
                // variables_needed_for_headers ends here
        
                // [[file:~/repositories/taeric.github.io/Sudoku.org::*Methods%20to%20create%20headers%20and%20cells.][methods_to_create_headers_and_cells]]
                function header(name) {
                    var h = {
                        name: name,
                        up: null,
                        down: null,
                        left: null,
                        right: null,
                        size: 0
                    };
                    h.up = h;
                    h.down = h;
                    return h;
                }
                function cell(colName) {
                    var newCell = {
                        up: null,
                        down: null,
                        left: null,
                        right: null,
                        col: null
                    },
                        col = rawHeaders[0];
                
                    while (col.name !== colName)
                        col = col.right;
                
                    col.size++;
                    newCell.down = col;
                    newCell.up = col.up;
                    newCell.down.up = newCell;
                    newCell.up.down = newCell;
                    newCell.col = col;
                    return newCell;
                }
                // methods_to_create_headers_and_cells ends here
        
                // [[file:~/repositories/taeric.github.io/Sudoku.org::*Initialize%20Data][initialize_data]]
                for (i = 0; i < 9; i++) {
                    rows[i] = [];
                    cols[i] = [];
                    grps[i] = [];
                    positions[i] = [];
                    for (j = 0; j < 9; j++) {
                        rows[i][j] = 0;
                        cols[i][j] = 0;
                        grps[i][j] = 0;
                        positions[i][j] = 0;
                    }
                }
                
                // initialize_data ends here
        
                // [[file:~/repositories/taeric.github.io/Sudoku.org::*Read%20in%20board%20data.][read_in_data]]
                for (i = 0; i < 9; i++) {
                    for (j = 0; j < 9; j++) {
                        var curValue = strings[i].charAt(j);
                        if (curValue && curValue !== '.') {
                            curValue--;
                            var g = Math.floor(i/3)*3 + Math.floor(j/3);
                            if (rows[i][curValue]) throw "Duplicate values in row";
                            if (cols[j][curValue]) throw "Duplicate values in col";
                            if (grps[g][curValue]) throw "Duplicate values in group.";
                            rows[i][curValue] = 1;
                            cols[j][curValue] = 1;
                            grps[g][curValue] = 1;
                            positions[i][j] = 1;
                        }
                    }
                }
                
                // read_in_data ends here
        
                // [[file:~/repositories/taeric.github.io/Sudoku.org::*Generate%20Headers][generate_headers]]
                rawHeaders.push(header("root"));
                for (i = 0; i < 9; i++) {
                    for (j = 0; j < 9; j++) {
                        if (!positions[i][j]) {
                            rawHeaders.push(header("p"+i.toString()+j.toString()));
                        }
                    }
                }
                for (i = 0; i < 9; i++) {
                    for (k = 0; k < 9; k++) {
                        if (!rows[i][k])
                            rawHeaders.push(header("r"+i.toString()+k.toString()));
                        if (!cols[i][k])
                            rawHeaders.push(header("c"+i.toString()+k.toString()));
                        if (!grps[i][k])
                            rawHeaders.push(header("g"+i.toString()+k.toString()));
                    }
                }
                
                //Now, link them up.
                for (i = 1; i < rawHeaders.length; i++) {
                    var h = rawHeaders[i];
                    h.left = rawHeaders[i-1];
                    rawHeaders[i - 1].right = h;
                }
                rawHeaders[0].left = rawHeaders[rawHeaders.length - 1];
                rawHeaders[rawHeaders.length - 1].right = rawHeaders[0];
                headers = rawHeaders[0];
                // generate_headers ends here
        
                // [[file:~/repositories/taeric.github.io/Sudoku.org::*Generate%20Rows][generate_rows]]
                for (i = 0; i < 9; i++) {
                    var x = Math.floor(i/3) * 3;
                    for (j = 0; j < 9; j++) {
                        if (!positions[i][j]) {
                            var g = x + Math.floor(j/3);
                            for (k = 0; k < 9; k++) {
                                if (!rows[i][k] && !cols[j][k] && !grps[g][k]) {
                                    rawRows.push(cell("p"+i.toString()+j.toString()));
                                    rawRows.push(cell("r"+i.toString()+k.toString()));
                                    rawRows.push(cell("c"+j.toString()+k.toString()));
                                    rawRows.push(cell("g"+g.toString()+k.toString()));
                                }
                            }
                        }
                    }
                }
                
                //Now, link up the rows.  (Cheating, and simply linking up all groups of 4.)
                for (i = 0; i < rawRows.length; i+=4) {
                    var a = rawRows[i],
                        b = rawRows[i+1],
                        c = rawRows[i+2],
                        d = rawRows[i+3];
                    a.right = b;
                    b.right = c;
                    c.right = d;
                    d.right = a;
                    a.left = d;
                    b.left = a;
                    c.left = b;
                    d.left = c;
                }
                // generate_rows ends here
        }
        // dlx_initialize_headers ends here


    initializeHeaders();
    search(0);
    return solutions;
}
// dlx_sudoku_solver ends here

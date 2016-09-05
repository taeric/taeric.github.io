// [[file:DancingLinks.org::dlx_algorithm][dlx_algorithm]]
function solveWithDancingLinks(n, showSteps) {
    var headers, solutions = [], O = [];

    // [[file:~/repositories/taeric.github.io/DancingLinks.org::dlx_initialize_headers][dlx_initialize_headers]]
    function initializeHeaders() {
        var i, j, k, rows=[];
        cols = [];
    
        headers = {
            name: 'root',
            right: null,
            left: null,
            up: null,
            down: null
        };
        headers.right = headers;
        headers.left = headers;
    
        for (i = 0; i < n; i++) {
            var t = ((i & 1) ? n - 1 - i : n + i) >> 1;
            var cur = {
                name: 'R' + t,
                right: headers,
                left: headers.left,
                size: 0,
                down: null,
                up: null,
            };
            cols.push(cur);
            headers.left.right = cur;
            headers.left = cur;
            cur.up = cur;
            cur.down = cur;
    
            cur = {
                name: 'F' + t,
                right: headers,
                left: headers.left,
                size: 0,
                down: null,
                up: null,
            };
            cols.push(cur);
            headers.left.right = cur;
            headers.left = cur;
            cur.up = cur;
            cur.down = cur;
        }
        for (i = 0; i < 2 * n; i++) {
                var cur = {
                    name: 'A' + i,
                    right: null,
                    left: null,
                    size: 0,
                    up: null,
                    down: null
                };
                cols.push(cur);
                cur.left = cur;
                cur.right = cur;
                cur.up = cur;
                cur.down = cur;
        }
        for (i = 0; i < 2 * n; i++) {
                var cur = {
                name: 'B' + i,
                    right: null,
                    left: null,
                    size: 0,
                    up: null,
                    down: null
                };
                cols.push(cur);
                cur.left = cur;
                cur.right = cur;
                cur.up = cur;
                cur.down = cur;
        }
    
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                var a, b, c, d;
                a = {
                    up: null,
                    down: null,
                    left: null,
                    right: null,
                    col: null
                };
                b = {
                    up: null,
                    down: null,
                    left: null,
                    right: null,
                    col: null
                };
                c = {
                    up: null,
                    down: null,
                    left: null,
                    right: null,
                    col: null
                };
                d = {
                    up: null,
                    down: null,
                    left: null,
                    right: null,
                    col: null
                };
                a.left = d;
                a.right = b;
                b.left = a;
                b.right = c;
                c.left = b;
                c.right = d;
                d.left = c;
                d.right = a;
    
                var colIdx = 0;
                var aCol = cols[colIdx++];
                while (aCol.name !== 'R' + i)
                    aCol = cols[colIdx++];
                aCol.size++;
                a.col = aCol;
                a.down = aCol;
                a.up = aCol.up;
                a.down.up = a;
                a.up.down = a;
    
                colIdx = 0;
                var bCol = cols[colIdx++];
                while (bCol.name !== 'F' + j) {
                    bCol = cols[colIdx++];
                }
                bCol.size++;
                b.col = bCol;
                b.down = bCol;
                b.up = bCol.up;
                b.down.up = b;
                b.up.down = b;
    
                colIdx = 0;
                var cCol = cols[colIdx++];
                while (cCol.name !== 'A' + (j + i))
                    cCol = cols[colIdx++];
                cCol.size++;
                c.col = cCol;
                c.down = cCol;
                c.up = cCol.up;
                c.down.up = c;
                c.up.down = c;
    
                colIdx = 0;
                var dCol = cols[colIdx++];
                while (dCol.name !== 'B' + (n - 1 - j + i))
                    dCol = cols[colIdx++];
                dCol.size++;
                d.col = dCol;
                d.down = dCol;
                d.up = dCol.up;
                d.up.down = d;
                d.down.up = d;
            }
        }
        headers = headers.right;
        while (headers.down) {
            if (headers.size === 0) {
                headers.left.right = headers.right;
                headers.right.left = headers.left;
            }
            headers = headers.right;
        }
    }
    // dlx_initialize_headers ends here

    // [[file:~/repositories/taeric.github.io/DancingLinks.org::dlx_search][dlx_search]]
    function search(k) {
        var c, r;
        if (showSteps || headers.right === headers) {
            solutions.push(copySolution());
            if (headers.right == headers)
                return;
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

    // [[file:~/repositories/taeric.github.io/DancingLinks.org::dlx_cover_uncover][dlx_cover_uncover]]
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

    // [[file:~/repositories/taeric.github.io/DancingLinks.org::dlx_utilities][dlx_utilities]]
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


    initializeHeaders();
    search(0);
    return solutions;
}
// dlx_algorithm ends here

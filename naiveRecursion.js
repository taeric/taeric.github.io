// [[file:DancingLinks.org::*Basic%20Recursion][basic_algorithm]]
function solveRecursively(n, showSteps) {
    var r = n, c = n, allPositions,
        steps = [];

    function initializePositions() {
        var i, j;
        allPositions = [];
        for (i = 0; i < r; i++) {
            for (j = 0; j < c; j++) {
                allPositions.push({
                    r: i,
                    f: j,
                    a: i + j,
                    b: n - 1 - j + i,
                    //To get our placements the same as the DLX one...
                    toString: function() {
                        return "R"+this.r+" F"+this.f+" A"+this.a+" B"+this.b;
                    }
                });
            }
        }
    }

    function placePiece(availablePositions, position) {
        return availablePositions.
            filter(function(v) {
                return v.r !== position.r &&
                    v.f !== position.f &&
                    v.a !== position.a &&
                    v.b !== position.b;
            });
    }

    function testSolution(availablePositions, candidate) {
        if (showSteps)
            steps.push(candidate);

        if (availablePositions.length) {
            var childSolutions = [];
            for (var p = 0; p < Math.min(n, availablePositions.length); p++) {
                var position = availablePositions[0],
                    remainingPositions = placePiece(availablePositions,
                                                    position),
                    recurseResults = testSolution(remainingPositions,
                                                  candidate.concat(position));

                    availablePositions = availablePositions.slice(1);
                    childSolutions = childSolutions.concat(recurseResults);
            }
            return childSolutions;
        } else if (candidate.length === n) {
            return [ candidate ];
        }
        return [];
    }

    initializePositions();
    var solutions = testSolution(allPositions, []);
    if (showSteps)
        return steps;
    return solutions;
}
// basic_algorithm ends here

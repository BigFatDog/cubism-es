/***********************************

 Reference: d3-multiple-brushes: http://bl.ocks.org/ludwigschubert/0236fa8594c4b02711b2606a8f95f605

 ***********************************/

// set dimensions and margin
var margin = {top: 50, bottom: 50, left: 50, right: 50};
var width = 960, height = 500;

// create date parser
var parseDate = d3.timeParse('%b %Y');

// create scales
var xScale = d3.scaleTime()
    .range([0, width]);

var yScale = d3.scaleLinear()
    .range([height, 0]);

// Define line
var priceLine = d3.line()
    .x(function (d) {
        return xScale(d.date);
    })
    .y(function (d) {
        return yScale(d.price);
    });

// create plot area
var svg = d3.select('#plot')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

var plotArea = svg.append('g')
    .attr("id", "chart")
    .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');

// Generate a SVG group to keep brushes
var gBrushes = svg.append('g')
    .attr("height", height)
    .attr("width", width)
    .attr("fill", "none")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "brushes");

// Object to store brush selections and scatter data
var mySelections = {};
var scatter = {}

// Keep a default 3 of max brushes allowed
var brushCount = 2;

// Keep the actual d3-brush functions and their IDs in a list:
var brushes = [];

/****** Load and plot data  **************************/
d3.csv('data.csv', function (error, data) {
    data.forEach(function (d) {
        d.date = parseDate(d.date);
        d.price = +d.price;
    });

// Just filtering out two companies to only plot two scatterplots
    data = data.filter((d) => {
        return d.symbol === 'MSFT' || d.symbol === 'AMZN';
    });


    newBrush();
    drawBrushes();

// scale the range of the data
    xScale.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    yScale.domain([0, d3.max(data, function (d) {
        return d.price;
    })]);

// Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function (d) {
            return d.symbol;
        })
        .entries(data);

// Set the color scale for stock symbols
    var color = d3.scaleOrdinal(d3.schemeCategory10);

// Loop through each symbol-key
    dataNest.forEach(function (d, i) {

// Add Scatter plot
        plotArea.append("g")
            .attr("id", function () {
                return "scatter-" + i
            })
            .selectAll("dot")
            .data(d.values).enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 4)
            .attr("cx", function (d) {
                return xScale(d.date);
            })
            .attr("cy", function (d) {
                return yScale(d.price);
            })
            .style("fill", function () {
                return d.color = color(d.key);
            });
    });

// Add Axes
    plotArea.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(xScale));

    plotArea.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(yScale));

    /******* Store Scatter Data Points for Later Use  **********/
    (function () {
        var i = 0;
        let id = 'scatter-' + i;
        let sel = d3.select('#' + id);

        while (!sel.empty()) {
// Add scatter plot data to object
            scatter[id] = {node: sel.selectAll('.dot'), data: sel.selectAll('.dot').data()};

// Increment values
            i++;
            id = 'scatter-' + i;
            sel = d3.select('#' + id);
        }
    })();
    /******* End Storing Scatter Data  **********/
});
/****** End of loading/plotting data  **************************/

/************ Event listener to update brush counts *************/
document.getElementById('brushInput').addEventListener('change', function () {
    brushCount = this.value;
    updateBrushes();
});

var updateBrushes = function () {
    if (brushes.length > brushCount) {
        let i = brushes.length - 1;

        while (i >= brushCount) {
            let tempID = "brush-" + brushes[i].id;

// Delete selections
            delete mySelections[tempID];

            d3.select('#' + tempID).remove();
            brushes.pop();
            i--;
        }

        drawBrushes();
    }

    if (brushes.length === 0 && brushCount > 0) {
        newBrush();
        drawBrushes();
    }
}

/************ End of update brush counts *************/

/******* Brush features *******/
function newBrush() {
// console.log("new brush");
    var brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("start", brushstart)
        .on("brush", brushed)
        .on("end", brushend);

    brushes.push({id: brushes.length, brush: brush});

    function brushstart() {
// Brush start here
    };

    function brushed() {
        let selection = d3.event.selection.map(i => xScale.invert(i));
        mySelections[this.id] = {start: selection[0], end: selection[1]};
// console.log("Selections are: ", mySelections);
    }

    function brushend() {
        // Figure out if our latest brush has a selection
        var lastBrushID = brushes[brushes.length - 1].id;
        var lastBrush = document.getElementById('brush-' + lastBrushID);
        var selection = d3.brushSelection(lastBrush);

        // If it does, that means we need another one
        if (brushes.length < brushCount && selection && selection[0] !== selection[1]) {
            newBrush();
        }

// Always draw brushes
        drawBrushes();
    }
}

function drawBrushes() {

    var brushSelection = gBrushes
        .selectAll('.brush')
        .data(brushes, function (d) {
            return d.id
        });

// console.log("Brush selection:", brushSelection);

// Set up new brushes
    brushSelection.enter()
        .insert("g", '.brush')
        .attr('class', 'brush')
        .attr('id', function (brush) {
            return "brush-" + brush.id;
        })
        .each(function (brushObject) {
// call the brush
            brushObject.brush(d3.select(this));
        });

    brushSelection
        .each(function (brushObject) {
            d3.select(this)
                .attr('class', 'brush')
                .selectAll('.overlay')
                .style('pointer-events', function () {
                    var brush = brushObject.brush;
                    if (brushObject.id === brushes.length - 1 && brush !== undefined) {
                        return 'all';
                    } else {
                        return 'none';
                    }
                });
        })

    brushSelection.exit()
        .remove();
}

/******* End of brush features *******/

/************ Event and function for removing brushes *************/
document.getElementById('remove-brushes-btn').addEventListener('click', () => {
    removeBrushes();
});

var removeBrushes = function () {
    d3.selectAll('.brush').remove();

    let selected = document.getElementsByClassName('selected');

    while (selected.length) {
        selected[0].classList.remove('selected');
    }

    brushes = [];
    mySelections = {};
    newBrush();
    drawBrushes();
}
/************ End of removing brushes *************/

var isMySelection = function () {
    if (Object.keys(mySelections).length === 0) {
        console.log("No brushses to select/match data.");
        return true;
    } else {
        return false;
    }

}

/************ Event and function for finding data *************/
document.getElementById('find-data-btn').addEventListener('click', () => {
    findData();
});

var findData = function () {

// If there are no brush selections, don't bother finding the data
    if (isMySelection()) return;

    console.log("Searching for data...");
    console.log("My Selections:", mySelections);
    let selectedData = {};

    for (key in scatter) {
        let node = scatter[key].node;
        let tempData = [];

        node.classed("selected", function (d) {
            let result = false;

            for (id in mySelections) {
                let start = mySelections[id].start;
                let end = mySelections[id].end;

                if (start <= d.date && d.date <= end) {
                    result = true;
                    tempData.push(d);
                }
            }

            return result;
        });

        selectedData[key] = _.uniq(tempData); // take out duplicate selections
    }

// console.log("Scatter:", scatter);
    console.log("Selected Data:", selectedData);
}
/************ End of finding data *************/

/************ Event and function for matching scatter 'lines' to brush selection *************/
document.getElementById('match-two-btn').addEventListener('click', () => {
    matchLine();
});

var matchLine = function () {
// If there are no brush selections, don't bother matching the data
    if (isMySelection()) return;

    var count = {};

    for (key in mySelections) {
        let start = mySelections[key].start;
        let end = mySelections[key].end;
        let match = 0;

        for (id in scatter) {
            let data = scatter[id].data;
            let inBrush = data.filter(d => start <= d.date && d.date <= end).length > 0;

            if (inBrush) {
                match += 1;
            }

        }

        count[key] = match;
    }

    console.log("Count: ", count);
}

/************ End of function for matching lines *************/

/************ Event and function for toggling brushes on/off *************/
let toggle = true;

document.getElementById('disable-btn').addEventListener('click', () => {
    toggleBrush();
});

var toggleBrush = function () {
    toggle = !toggle;

    if (!toggle) {
        document.getElementById('disable-btn').innerHTML = '<i class="fa fa-toggle-off"></i> Brushes Off';

        for (let i = 0, len = brushes.length; i < len; i++) {
            d3.select('#brush-' + i).on('.brush', null);
        }

        d3.select('.brushes').selectAll('.selection').style("cursor", "initial");
        d3.select('.brushes').selectAll('.overlay').style("cursor", "initial");

    } else {
        document.getElementById('disable-btn').innerHTML = '<i class="fa fa-toggle-on"></i> Brushes On';

        for (let i = 0, len = brushes.length; i < len; i++) {
            brushes[i].brush(d3.select('#brush-' + i));
        }

        d3.select('.brushes').selectAll('.selection').style("cursor", "move");
        d3.select('.brushes').selectAll('.overlay').style("cursor", "crosshair");
    }
};

/*************** End of disabling brushes ****************************************************/
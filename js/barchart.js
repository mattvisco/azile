/************ d3 code for barchart *****************/

var margin = {top : 20, right : 20, bottom : 10, left : 20},
	width = 500,
	height = 100;

var barWidth = 40;

var formatPercent = d3.format(".0%");

var x = d3.scale.linear()
	.domain([0, ec.getEmotions().length]).range([margin.left, width+margin.left]);

var y = d3.scale.linear()
	.domain([0,1]).range([0, height]);

var svg = d3.select("#graphBox").append("svg");

svg.selectAll("rect").
	data(emotionData).
	enter().
	append("svg:rect").
	attr("x", function(datum, index) { return x(index); }).
	attr("y", function(datum) { return height - y(datum.value); }).
	attr("height", function(datum) { return y(datum.value); }).
	attr("width", barWidth).
	attr("fill", "#fbe293");

// svg.selectAll("text.labels").
// 	data(emotionData).
// 	enter().
// 	append("svg:text").
// 	attr("x", function(datum, index) { return x(index) + barWidth; }).
// 	attr("y", function(datum) { return height - y(datum.value); }).
// 	attr("dx", -barWidth/2).
// 	attr("dy", "1.2em").
// 	attr("text-anchor", "middle").
// 	text(function(datum) { return datum.value;}).
// 	attr("fill", "white").
// 	attr("class", "labels");

svg.selectAll("text.yAxis").
	data(emotionData).
	enter().append("svg:text").
	attr("x", function(datum, index) { return x(index) + barWidth; }).
	attr("y", height).
	attr("dx", -barWidth/2).
	attr("text-anchor", "middle").
	attr("style", "font-size: 17").
	text(function(datum) { return datum.emotion;}).
	attr("transform", "translate(0, 18)").
	attr("class", "yAxis").
	attr("fill", "#fbe293");

function updateData(data) {
	// update
	var rects = svg.selectAll("rect")
		.data(data)
		.attr("y", function(datum) { return height - y(datum.value); })
		.attr("height", function(datum) { return y(datum.value); });
	var texts = svg.selectAll("text.labels")
		.data(data)
		.attr("y", function(datum) { return height - y(datum.value); })
		.text(function(datum) { return datum.value.toFixed(1);});

	// enter
	rects.enter().append("svg:rect");
	texts.enter().append("svg:text");

	// exit
	rects.exit().remove();
	texts.exit().remove();
}
Rickshaw.namespace('Rickshaw.Graph.Legend');

Rickshaw.Graph.Legend = function(args) {

	var element = this.element = args.element;
	var graph = this.graph = args.graph;

	var self = this;

	element.classList.add('rickshaw_legend');
    var cont1 = document.createElement('div');
    var cont2 = document.createElement('div');
    cont1.classList.add('container');
    cont2.classList.add('container');
    element.appendChild(cont1);
    element.appendChild(cont2);
	var list1 = this.list1 = document.createElement('ul');
    var list2 = this.list2 = document.createElement('ul');
	cont1.appendChild(list1);
    cont2.appendChild(list2);
	var series = graph.series
		.map( function(s) { return s } );

	if (!args.naturalOrder) {
		series = series.reverse();
	}

	this.lines = [];

    this.addLine = function (series, list) {
        var line = document.createElement('li');
        line.className = 'line';
        if (series.disabled) {
            line.className += ' disabled';
        }

        //var swatch = document.createElement('div');
        //swatch.className = 'swatch';
        //swatch.style.backgroundColor = series.color;

        //line.appendChild(swatch);

        var button = document.createElement('button');
        button.className = 'button';
        button.style.backgroundColor = series.color;
        button.style.border = "1px solid " + series.color;
        button.innerHTML = series.name;
        button.type = 'button';
        button.onclick = function (event) { event.target.classList.toggle('clicked') };

        line.appendChild(button);
        list.appendChild(line);

        line.series = series;

        if (series.noLegend) {
            line.style.display = 'none';
        }

        var _line = { element: line, series: series };
        if (self.shelving) {
            self.shelving.addAnchor(_line);
            self.shelving.updateBehaviour();
        }
        if (self.highlighter) {
            self.highlighter.addHighlightEvents(_line);
        }
        self.lines.push(_line);
    };

	series.forEach( function(s, index) {
        var par = index % 2;
        var list = par ? list2 : list1;
        self.addLine(s, list);
	} );

	graph.onUpdate( function() {} );
};

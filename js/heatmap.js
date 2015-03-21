define(["d3", "jquery"], function(d3, $) {return function(gSelection) {

  var valueAccess = null;
  var width = null;
  var height = null;
  var x = d3.scale.ordinal();
  var y = d3.scale.ordinal();
  var colorFn = null;

  function setData(data, idAccess, _valueAccess) {
    valueAccess = _valueAccess || function(d) {return d;};
    idAccess = idAccess || function(d, i) {return i;};

    x.domain(d3.range(data[0].length));
    y.domain(d3.range(data.length));

    var updateCols = gSelection
      .selectAll('g.row')
      .data(data, idAccess);

    updateCols
      .enter()
      .append('g')
      .classed('row', true)
      .each(function(d) {
        d3.select(this).selectAll('rect.box')
          .data(d)
          .enter()
          .append('rect')
          .classed('box', true);
      });

    updateCols
      .exit()
      .remove();

    visualize();

    return this;
  }

  function color(_colorFn) {
    colorFn = _colorFn;
    return this;
  }

  function visualize(_width, _height) {
    width = _width;
    height = _height;
    if (!width || !height) {return;}
    x.rangeRoundBands([0, width] , 0.1);
    y.rangeRoundBands([0, height], 0.1);

    gSelection.selectAll('g.row')
      .attr('transform', function(d, i) {
        var pos = [0, y(i)];
        return 'translate(' + pos + ')';
      }).each(function() {
        var boxes = d3.select(this).selectAll('.box')
          .attr('x', function(d, i) {return x(i);})
          .attr('width', function(d) {return x.rangeBand();})
          .attr('height', function(d) {return y.rangeBand();});
        if (colorFn) boxes.attr('fill', colorFn);
      });
  }

  var exports = {
    setData: setData,
    color: color,
    visualize: visualize
  };

  return $.extend(exports, {});
};});

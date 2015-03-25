var Voronoi = require('voronoi');

var VoronoiGrid = function(entries, width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  this.entriesByColor = {};
  this.canvas = canvas;
  var ctx = this.ctx = canvas.getContext('2d');
  function generateColor() {
    var color = '';
    for (var i = 0; i < 6; i++)
      color += Math.floor(Math.random() * 16).toString(16);
    return color;
  }
  var colors = [];
  // Generate a unique color for every entry:
  while (colors.length < entries.length) {
    var color = generateColor();
    if (colors.indexOf(color) == -1)
      colors.push(color);
  }
  for (var i = 0; i < entries.length; i++)
    entries[i]._color = colors[i];
  var voronoi = new Voronoi();
  var diagram = voronoi.compute(entries, {
    xl: 0,
    xr: width,
    yt: 0,
    yb: height
  });
  var cells = diagram.cells;
  for (var i = 0, l = cells.length; i < l; i++) {
    var cell = cells[i];
    var color = cell.site._color;
    this.entriesByColor[color] = cell.site;
    var halfedges = cell.halfedges;
    var nHalfedges = halfedges.length;
    if (nHalfedges < 3) return;
    var v = halfedges[0].getStartpoint();
    ctx.beginPath();
    ctx.moveTo(v.x, v.y);
    for (var iHalfedge = 0; iHalfedge < nHalfedges; iHalfedge++) {
      v = halfedges[iHalfedge].getEndpoint();
      ctx.lineTo(v.x, v.y);
    }
    ctx.fillStyle = '#' + color;
    ctx.fill();
  }
};

VoronoiGrid.prototype.find = function(x, y) {
  var then = new Date();
  var that = this;
  var entriesByColor = this.entriesByColor;
  // Because of canvas antialiasing, the edges of the areas can contain
  // different colors than our color dictionary. In that case, we look
  // at another pixel close to the chosen one.
  // We will sample 25 pixels from the image and start looking at the center
  // pixel first:
  var offset = 13 * 4;
  var tries = 0;
  var data = that.ctx.getImageData(Math.round(x) - 2, Math.round(y) - 2, 5, 5).data;
  function getColorAt(x, y) {
    var hex = '';
    for (var i = offset; i < offset + 3; i++) {
      var bit = (data[i] - 0).toString(16);
      hex += bit.length == 1 ? '0' + bit : bit;
    }
    tries++;
    return hex;
  }
  function getNearest(x, y) {
    // Because of 
    var color = getColorAt(x, y);
    var nearest = entriesByColor[color];
    offset = (offset + 4) % 25;
    return nearest || tries < 25 && getNearest(x, y);
  }
  return getNearest(x, y);
}

module.exports = VoronoiGrid;
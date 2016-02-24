var toneCount = 12;
var cellWidth = 8;
var cellHeight = 6;

var colors = {
  active: '#8AF',
  rest: 'hsla(0, 100%, 50%, 0.3)',
  indexTone: 'hsla(0, 0%, 100%, 0.3)',
  fifthTone: 'hsla(0, 0%, 100%, 0.1)',
  octaveTone: 'hsla(0, 0%, 100%, 0.2)'
};

function ArpButton( parent, arp ) {
  this.element = document.createElement('div');
  this.element.className = 'arp-button';
  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
  // 8 x 12
  this.canvasWidth = this.canvas.width = cellWidth * 8;
  this.canvasHeight = this.canvas.height = cellHeight * toneCount;
  this.arpeggio = arp || [0,0,0,0,0,0,0,0];
  this.render();
  this.element.appendChild( this.canvas );
  parent.appendChild( this.element );

  // event
  var _this = this;
  this.element.onclick = function() {
    arpBoard0.setArpeggio( _this.arpeggio );
  }
}

var proto = ArpButton.prototype;

proto.setArpeggio = function( arp ) {
  this.arpeggio = arp;
  this.render();
};

proto.render = function() {
  var ctx = this.ctx;
  ctx.clearRect( 0, 0, this.canvasWidth, this.canvasHeight );
  // render bars
  this.renderBar( 0, colors.octaveTone );
  this.renderBar( 3, colors.fifthTone );
  this.renderBar( 7, colors.indexTone );
  this.renderBar( 10, colors.fifthTone );
  this.renderBar( 11, colors.rest );

  ctx.fillStyle = colors.active;
  this.arpeggio.forEach( function( toneIndex, i ) {
    var y = ( toneIndex *-1 + 7 ) * cellHeight;
    ctx.fillRect( i * cellWidth, y, cellWidth, cellHeight );
  }, this );
};

proto.renderBar = function( i, color ) {
  this.ctx.fillStyle = color;
  this.ctx.fillRect( 0, i * cellHeight, this.canvasWidth, cellHeight );
};

var guid = 0;
var arpBoardClass = 'arp-board';

function ArpBoard( parent ) {
  this.id = guid;
  guid++;
  this.parent = parent;
  this.create();

  this.arpeggio = [];
}

var proto = ArpBoard.prototype;

proto.create = function() {
  this.element = document.createElement('div');
  this.element.className = arpBoardClass;
  this.columns = [];

  for ( var i=0; i<8; i++ ) {
    var column = this.createColumn( i );
    this.element.appendChild( column );
    this.columns.push( column );
  }

  this.parent.appendChild( this.element );
  this.element.addEventListener( 'click', this );
};

proto.createColumn = function( columnIndex ) {
  var column = document.createElement('div');
  column.className = getBEMClass( 'column', columnIndex );
  column.setAttribute( 'data-column', columnIndex );
  // create radios
  for ( var i=7; i > -5; i-- ) {
    var cell = document.createElement('div');
    var value = i == -4 ? 'rest' : i;
    cell.className = getBEMClass( 'cell', value );
    cell.setAttribute( 'data-value', value );
    column.appendChild( cell );
  }
  return column;
};

function getBEMClass( elemName, modName ) {
  var className = arpBoardClass + '__' + elemName;
  if ( modName !== undefined ) {
    className += ' ' + className + '--' + modName;
  }
  return className;
}


proto.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

proto.onclick = function( event ) {
  // only
  if ( !event.target.classList.contains('arp-board__cell') ) {
    return;
  }
  var colIndex = parseInt( event.target.parentNode.getAttribute('data-column'), 10 );
  var value = event.target.getAttribute('data-value');
  value = value == 'rest' ? value : parseInt( value, 10 );
  this.setSelectedCell( colIndex, value );
  this.arpeggio[ colIndex ] = value;
};

proto.setArpeggio = function( arp ) {
  this.arpeggio = arp;
  this.arpeggio.forEach( function( noteIndex, i ) {
    this.setSelectedCell( i, noteIndex );
  }, this );
};

proto.setSelectedCell = function( colIndex, value ) {
  var column = this.columns[ colIndex ];
  var offCell = column.querySelector('.is-selected');
  var onCell = column.querySelector( '.' + arpBoardClass + '__cell--' + value );
  if ( offCell ) {
    offCell.classList.remove('is-selected');
  }
  onCell.classList.add('is-selected');
};
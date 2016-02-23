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
  this.element.addEventListener( 'change', this );
};

proto.createColumn = function( columnIndex ) {
  var column = document.createElement('div');
  column.className = getBEMClass( 'column', columnIndex );
  // create radios
  for ( var i=7; i > -5; i-- ) {
    var cell = document.createElement('div');
    var value = i == -4 ? 'rest' : i;
    cell.className = getBEMClass( 'cell', value );
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.value = value;
    radio.name = arpBoardClass + this.id + '-' + columnIndex;
    radio.setAttribute( 'data-column', columnIndex );
    cell.appendChild( radio );
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

proto.onchange = function( event ) {
  var column = event.target.getAttribute('data-column');
  var value = event.target.value;
  this.arpeggio[ column ] = value == 'rest' ? value : parseInt( value, 10 );
};

proto.setArpeggio = function( arp ) {
  this.arpeggio = arp;
  var _this = this;
  this.arpeggio.forEach( function( noteIndex, i ) {
    var column = _this.columns[i];
    var offRadio = column.querySelector('[checked]');
    var onClass = '.' + arpBoardClass + '__cell--' + noteIndex + ' input';
    var onRadio = column.querySelector( onClass );
    if ( offRadio ) {
      offRadio.removeAttribute('checked');
    }
    onRadio.setAttribute( 'checked', 'checked' );
  });
};

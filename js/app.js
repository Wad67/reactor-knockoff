;(function() {
'use strict';

// settings
var rows = 5;
var cols = 5;
var debug = true;

// Current

// For iteration
var ri;
var pi;
var ci;
var row;
var tile;

// Other vars
var tiles = [];
var parts = {
	uranium: {
		id: 'uranium',
		title: 'Uranium Cell',
		type: 'cell',
		base_cost: 10,
		base_ticks: 15,
		base_power: 1,
		base_heat: 1,
		base_power_multiplier: 1,
		base_heat_multiplier: 4
	},
	plutonium: {
		id: 'plutonium',
		title: 'Plutonium Cell',
		type: 'cell',
		base_cost: 6000,
		base_ticks: 60,
		base_power: 150,
		base_heat: 150,
		base_power_multiplier: 1,
		base_heat_multiplier: 4
	},
	thorium: {
		id: 'thorium',
		title: 'Thorium Cell',
		type: 'cell',
		base_cost: 4737000,
		base_ticks: 900,
		base_power: 7400,
		base_heat: 7400,
		base_power_multiplier: 1,
		base_heat_multiplier: 4
	}
};

// Classes
var Tile = function() {
	this.$el = document.createElement('BUTTON');
	this.$el.className = 'tile';
	this.$el.tile = this;
	this.part = null;
	this.heat = 0;
	this.power = 0;

	if ( debug ) {
		this.$heat = document.createElement('SPAN');
		this.$heat.className = 'heat';
		this.$heat.innerHTML = this.heat;
		this.$el.appendChild(this.$heat);

		this.$power = document.createElement('SPAN');
		this.$power.className = 'power';
		this.$power.innerHTML = this.power;
		this.$el.appendChild(this.$power);
	}
};

var Part = function(part) {
	this.className = 'part_' + part.id;
	this.$el = document.createElement('BUTTON');
	this.$el.className = 'part ' + this.className;
	this.$el.part = this;

	this.part = part;
	this.type = part.type;
	this.heat = part.base_heat;
	this.power = part.base_power;
	this.heat_multiplier = part.base_heat_multiplier;
	this.power_multiplier = part.base_power_multiplier;
};

// Operations
var tiler;
var tileu;
var tilel;
var tiled;
var update_tiles = function() {
	for ( ri = 0; ri < rows; ri++ ) {
		row = tiles[ri];

		for ( ci = 0; ci < cols; ci++ ) {
			tile = row[ci];
			tile.heat = 0;
			tile.power = 0;
		}
	}

	for ( ri = 0; ri < rows; ri++ ) {
		row = tiles[ri];

		for ( ci = 0; ci < cols; ci++ ) {
			tile = row[ci];
			if ( tile.part ) {
				if ( tile.part.type === 'cell' ) {
					tile.heat += tile.part.heat;
					tile.power += tile.part.power;

					// neighbors
					if ( ci < cols - 1 ) {
						tiler = row[ci + 1];
						tiler.heat += tile.part.heat * tile.part.heat_multiplier;
						tiler.power += tile.part.power * tile.part.power_multiplier;
					}

					if ( ci > 0 ) {
						tilel = row[ci - 1];
						tilel.heat += tile.part.heat * tile.part.heat_multiplier;
						tilel.power += tile.part.power * tile.part.power_multiplier;
					}

					if ( ri < rows - 1 ) {
						tiled = tiles[ri + 1][ci];
						tiled.heat += tile.part.heat * tile.part.heat_multiplier;
						tiled.power += tile.part.power * tile.part.power_multiplier;
					}

					if ( ri > 0 ) {
						tileu = tiles[ri - 1][ci];
						tileu.heat += tile.part.heat * tile.part.heat_multiplier;
						tileu.power += tile.part.power * tile.part.power_multiplier;
					}
				}
			}
		}
	}

	if ( debug ) {
		for ( ri = 0; ri < rows; ri++ ) {
			row = tiles[ri];

			for ( ci = 0; ci < cols; ci++ ) {
				tile = row[ci];
				tile.$heat.innerHTML = tile.heat;
				tile.$power.innerHTML = tile.power;
			}
		}
	}
};

// get dom nodes cached
var $reactor = document.getElementById('reactor');
var $parts = document.getElementById('parts');

// create tiles
var $row;
for ( ri = 0; ri < rows; ri++ ) {
	$row = document.createElement('DIV');
	$row.className = 'row';
	$reactor.appendChild($row);
	row = [];

	for ( ci = 0; ci < cols; ci++ ) {
		tile = new Tile();
		row.push(tile);
		$row.appendChild(tile.$el);
	}

	tiles.push(row);
}

// create parts
var part;
for ( pi in parts ) {
	part = new Part(parts[pi]);

	$parts.appendChild(part.$el);
}

// Events

var part_test = /^part/;
var active_replace = /[\b\s]active\b/;
var clicked_part = null;
$parts.onclick = function(e) {
	if ( e.target.className.match(part_test) ) {
		if ( clicked_part && clicked_part === e.target.part ) {
			clicked_part = null;
			e.target.className = e.target.className.replace(active_replace, '');
		} else {
			if ( clicked_part ) {
				clicked_part.$el.className = clicked_part.$el.className.replace(active_replace, '');
			}
			clicked_part = e.target.part;
			e.target.className += ' active';
		}
	}
};

var tile_test = /^tile/;
var part_replace = /[\b\s]part_[a-z0-9]+\b/
$reactor.onclick = function(e) {
	if ( e.target.className.match(tile_test) ) {
		tile = e.target.tile;

		if ( clicked_part && tile.part !== clicked_part ) {
			tile.part = clicked_part;
			e.target.className = e.target.className.replace(part_replace, '') + ' ' + clicked_part.className;
			update_tiles();
		}
	}
};

})();
import {Component} from './component.js';
import {Knowledge} from './knowledge.js';

import {Components} from './components.js';

export class Tile extends Component {
    constructor(tile, depth) {
        super();
        this.tile = tile;
        this.depth = depth;
    }

    clone() {
        return new Tile(this.tile, this.depth);
    }
}

export class WallTile extends Component {
    constructor(frontTile, topTile, depth) {
        super();
        this.frontTile = frontTile;
        this.topTile = topTile;
        this.depth = depth;
    }

    clone() {
        return new WallTile(this.frontTile, this.topTile, this.depth);
    }
}

export class Solid extends Component {
}

export class Collider extends Component {
}

export class Opacity extends Component {
    constructor(value) {
        super();
        this.value = value;
    }

    clone() {
        return new Opacity(this.value);
    }
}

export class TurnTaker extends Component {
    constructor(takeTurn) {
        super();
        this.takeTurn = takeTurn;
        this.nextTurn = null;
    }

    get scheduled() {
        return this.nextTurn !== null;
    }

    clone() {
        return new TurnTaker(this.takeTurn);
    }
}

export class Observer extends Component {
    constructor(observe) {
        super();
        this.observe = observe;
        this.knowledge = new Knowledge();
    }

    clone() {
        return new Observer(this.observe);
    }
}

export class PlayerCharacter extends Component {
}

export class Door extends Component {
    constructor(open, openTile, closedTile) {
        super();
        this._open = open;
        this.openTile = openTile;
        this.closedTile = closedTile;
    }

    get open() {
        return this._open;
    }

    get closed() {
        return !this._open;
    }

    set open(value) {
        this._open = value;
        this.entity.with(Components.Tile, (tile) => {
            if (value) {
                tile.tile = this.openTile;
            } else {
                tile.tile = this.closedTile;
            }
        });
    }
}

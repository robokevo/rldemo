class Entity extends Glyph {
  constructor(settings, subsettings) {
    super(settings);
    this._game = settings.game;
    this._player = false;
    this._actor = subsettings.actor || true;
    this._name = subsettings.name || 'new buddy';
    this._type = subsettings.type || this._name;
    this._char = subsettings.char || '?';
    this._mobile = subsettings.mobile || false;
    this._speed = subsettings.speed || 0;
    this._target = subsettings.target || false;
    // todo: calculate hp based on con type stat
    this._MaxHp = subsettings.MaxHp || 5;
    this._hp = subsettings.hp || this._MaxHp;
    this._basePower = subsettings.basePower || 2;
    this._spreader = subsettings.spreader || false;
    this._spreadRate = subsettings.spreadRate || 0;
    this._spreadRange = subsettings.spreadRange || 0;
    this._offspring = subsettings.offspring || 0;
  }

  get actor() {
    // returns this entity's status as an actor
    return this._actor; 
  }

  get atkPower() {
    // todo: figure in stats + equipment
    return this.basePower;
  }

  get basePower() {
    return this._basePower;
  }

  get game() {
    // returns encapsulating game object for context
    return this._game;
  }

  get hp() {
    return this._hp;
  }

  set hp(value) {
    this._hp = value;
  }  

  get mobile() {
    //todo: check for statuses to return otherwise
    return this._mobile;
  }

  get name() {
    // returns printable name
    // todo: programatically return name w/ article, title, etc.
    return this._name;
  }

  set name(newName) {
    // sets internal base name attribute
    this._name = newName;
  }

  get offspring() {
    return this._offspring;
  }

  get spreader() {
    return this._spreader;
  }

  get spreadRate() {
    return this._spreadRate;
  }

  get spreadRange() {
    return this._spreadRange;
  }

  get target() {
    return this._target;
  }

  get type() {
    return this._type;
  }

  act() {
    // for catching game loop
    // todo: add delay to show individual movement/action
    //  until rts
    // todo: add range limit to avoid distant characters eating processor
    let game = this.game;
    game.engine.lock();
    console.log(this.name+'('+this.x+','+this.y+')');
    if (this.spreader) {
      this.spread();
    }
    game.engine.unlock();
  }

  attack(target) {
    // todo: miss chance based on speed
    const damage = Math.max(
      Math.round(this.atkPower / 2),
      Math.round(this.game.getRandom() * this.atkPower)
      );
    console.log(damage);
    target.takeDamage(damage);
  }

  changeHP(value) {
    this.hp = this.hp + value;
    if (this.hp <= 0) {
      this.expire();
      this.game.removeEntity(this);
    }
  }

  drop(item) {

  }

  expire() {
    console.log(this.name + ' has expired!');
  }

  getSpeed() {
    // this method is required by ROT speed scheduler
    // todo: own .speed attribute for internal use to keep convention
    //   that this can point to
    return this._speed;
  }
  
  healDamage(value) {
    //todo: factor in buffs
    this.changeHP(value);
  }

  setPos(coord) {
    this._pos.x = coord.x ?? this._pos.x;
    this._pos.y = coord.y ?? this._pos.y;
    this._pos.z = coord.z ?? this._pos.z;
  }

  spread(range) {
    // todo: factor in census of neighbor tiles to avoid crowding
    const game = this.game;
    const spreadRange = range ?? this.spreadRange;
    const spreadRate = this.spreadRate;
    const attempt = game.getRandom();
    if (spreadRate >= attempt) {
      const target = game.freeTileInRadius(this, spreadRange);
      if (target && this.offspring > 0) {
        game.newEntity(this.type, target);
        this._offspring--;
      }
    }
  }

  takeDamage(value) {
    //todo: factor in buffs
    //todo: onHit/reaction
    this.changeHP(-value);
  }

  tryPos(coord) {
    const game = this.game;
    coord.x = coord.x + this.x;
    coord.y = coord.y + this.y;
    coord.z = coord.z + this.z;
    let result = game.isTileFree(coord);
    if (result && this.mobile) {
      game.move(this,coord);
      result = true;
      return result;
    }
    const ent = game.getEntity(coord);
    let tile;
    if (!ent) {
      tile = game.getTile(coord);
      if (tile.destructible) {
        game.destroyTile(tile);
        result = true;
        return result;
      }
    }
    if (ent.target) {
      this.attack(ent);
      return true;
    }

    console.log('tryPos error');
  }
}

class Player extends Entity {
  constructor(settings, subsettings) {
    super(settings, subsettings);
    this._player = true;
  }

  act() {
    this.game.engine.lock();
  }
}
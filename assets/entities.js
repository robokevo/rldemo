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
    this._maxHp = subsettings.maxHp || 5;
    this._hp = subsettings.hp || this._maxHp;
    this._basePower = subsettings.basePower || 2;
    this._baseDefense = subsettings.baseDefense || 0;
    this._spreader = subsettings.spreader || false;
    this._spreadRate = subsettings.spreadRate || 0;
    this._spreadRange = subsettings.spreadRange || 0;
    this._offspring = subsettings.offspring || 0;
    this._messages = subsettings.messages || [];
    this._hearing = subsettings.hearing || true;
  }

  // todo: get bearing() to return absolute bearing of entity

  get actor() {
    // returns this entity's status as an actor
    return this._actor; 
  }

  get atkPower() {
    // todo: rename power/attack to str
    // todo: figure in stats + equipment
    return this.basePower;
  }

  get basePower() {
    return this._basePower;
  }

  get baseDefense() {
    return this._baseDefense;
  }

  get defense() {
    // returns defense value including base defense plus
    // (eventually) equipment defense etc.
    return this.baseDefense;
  }

  get game() {
    // returns encapsulating game object for context
    return this._game;
  }

  get hearing() {
    // returns if this entity is capable of hearing
    // todo: status effects
    return this._hearing;
  }

  get hp() {
    return this._hp;
  }

  set hp(value) {
    this._hp = value;
  }  

  get maxHp() {
    return this._maxHp;
  }

  get mobile() {
    //todo: check for statuses to return otherwise
    return this._mobile;
  }

  get messages() {
    return this._messages;
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

  get player() {
    return this._player;
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
    const game = this.game;
      if (this.z = game.player.z) {
      game.engine.lock();
      //console.log(this.name+'('+this.x+','+this.y+')');
      if (this.spreader) {
        this.spread();
      }
      game.engine.unlock();
      } else {
        game.removeEntity(this);
      }
  }

  announce(message, radius) {
    this.game.sendMessage(message, this, radius);
  }
  

  attack(target) {
    // todo: miss chance based on speed
    const game = this.game;
    let hit = false;
    let message, damage;
    if (game.getRandom() > 0.2) {
      hit = true;
    }
    // todo: damage types, buffs
    if (hit) {
      damage = 
      Math.round(
        (100 - target.defense)/100 *
        Math.max(
          Math.round(this.atkPower / 2),
          Math.round(this.game.getRandom() * this.atkPower)
        )
      );
      if (damage > 0) {
        message = `You hit the ${target.name} for ${damage} damage!`;
      } else {
        message = `You didn't scratch the ${target.name}!`;
      }
    } else {
      message = `You missed the ${target.name}!`;
    }
    this.announce(message, 5);
    if (damage) {
      target.takeDamage(damage);
    }
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
    // todo: drops
    // todo: fold expiration message into attack message, announce at once
    const message = `The ${this.name} has expired!`;
    this.announce(message, 5);
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

  receiveMessage(msg) {
    //if (this.player) {
    //  console.log(msg);
    //}
    this._messages.push(msg);
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
      const range = this.rangePoints(spreadRange);
      const target = game.freeTile(range[0], range[1]);
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
    let tile = game.getTile(coord);
    if (result && this.mobile) {
      if (tile.exit) {
        if (tile.direction === 'down') {
          coord.z++;
          this.announce(`You descend to level ${coord.z+1}`, 1);
          game.move(this,coord);
          result = true;
        } else if (tile.direction === 'up') {
          coord.z--;
          this.announce(`You ascend to level ${coord.z+1}`, 1);
          game.move(this,coord);
          result = true;
        } 
      } else {
        game.move(this,coord);
        result = true;
      }
      return result;
    }
    const ent = game.getEntity(coord);
    if (!ent) {
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
    return false;
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
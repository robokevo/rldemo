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
    this._sightRadius = subsettings.sightRadius || 4;
    this._known = {};
    this._origin = null;
    // will determine acting path
    this._intel = subsettings.intel || 0;
    //tracks explored tiles
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

  get fov() {
    // todo: have entities use fov info from player
    return this.game.stage.fov;
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

  get intel() {
    return this._intel;
  }

  get origin() {
    return this._origin;
  }

  set origin(newOrigin) {
    this._origin = newOrigin;
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

  get sightRadius() {
    return this._sightRadius;
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
    const player = game.player;
    const stage = game.stage;
    if (this.z === player.z ) {            
      if (this.spreader) {
        this.spread();
      }
      if (this.getDistance(player) < this.sightRadius) {
      // todo: more range-specific activities regarding player
      game.engine.lock();
      //console.log(this.name+'('+this.x+','+this.y+')');
      let entity, result, path, newX, newY, newZ, tile, clear;
      if (this.intel > 4) {
        if (this.getDistance(player) <= 1) {
          this.attack(player);
        } else {
          result = this.search(player); 
          if (result) {
            let self = this;
            path = new ROT.Path.AStar(
              player.x,
              player.y,
              (x,y) => {
                entity = game.getEntity({'x':x,'y':y,'z':self.z});
                tile = stage.getTile({x:x,y:y});
                //clear = false;
                // todo: figure out why isTileFree doesn't work here
                if (entity && entity !== player && entity !== self) {
                  clear = false;
                } else if (tile.passable) {
                  clear = true;
                } else {
                  clear = false;
                }
                return clear;
              },
              // todo: read from entity's own topology
              {topoloy: 8}
            );
            // have to skip first square
            let count = 0;
            path.compute(
              self.x,
              self.y,
              (x,y) => {
                if (count === 1) {
                  //console.log(x+" "+y);
                  //newX = x - self.x;
                  //newY = y - self.y;
                  //self.tryPos({x:newX,y:newY,z:self.z});

                  // one last check to avoid race for spot
                  let free = game.isTileFree({x:x, y:y, z:self.z});
                  if (free) {
                    game.move(self,{x:x, y:y, z:self.z});
                  }
                }
                count++;
              }
            );
          }
        }
      } else if (this.intel < 4 && this.intel > 0) {
        let range = this.rangePoints(1);
        let target = game.freeTile(range[0], range[1]);
        if (target) {
          //newX = target.x - this.x;
          //newY = target.y - this.y;
          //newZ = this.z - this.z;
          //this.tryPos({x:newX,y:newY,z:newZ});
          this.tryPos({x:target.x,y:target.y});        }
      }
      game.engine.unlock();
      } else {
      // todo: implement idle
    }
  }
}

  announce(message, radius) {
    this.game.sendMessage(message, this, radius);
  }
  

  attack(target) {
    // todo: miss chance based on speed
    const game = this.game;
    let hit = false;
    let message, damage, subject, object, verb;
    if (target.player) {
      subject = this.name;
      object = 'you';
    } else {
      subject = 'You';
      object = target.name;
    }
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
      if (this.player) {
        if (damage < 1) {
          verb = ' didn\'t scratch the ' + object;
        } else {
          verb = ' hit the ' + object + ' for ' + damage + ' damage!';
        }
        message = subject + verb;
      } else {
        if (damage < 1) {
          verb = ' didn\'t scratch ' + object;
        } else {
          verb = ' hits ' + object + ' for ' + damage + ' damage!';
        }
        message = subject + verb;
      }
    } 
    this.announce(message, 5);
    if (damage) {
      target.takeDamage(damage);
    }
  }

  changeHP(value) {
    this.hp = this.hp + value;
    if (this.hp <= 0) {
      const game = this.game;
      this.expire();
      if (!this.player) {
        game.removeEntity(this);
        game.engine.unlock();
      }
    }
  }

  displace() {
    const game = this.game;
    const range = this.rangePoints(1);
    const target = this.freeTile(range[0], range[1]);
    if (target) {
      game.move(this, target);
    }
  }

  drop(item) {

  }

  expire() {
    // todo: drops
    // todo: fold expiration message into attack message, announce at once
    // todo: specific expiration messages related to:
    //  inherent nature (e.g., 'You ate the mushroom')
    //  means of expiry ('You were impaled')
    let message;
    if (this.player) {
      message = "You have expired! Press [F5] to try again";
    } else {
      message = this.name + " has expired!";
    }
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

  getKnown(x, y) {
    let known = this._known[this.z]
    if (!known) {
      known = this._known[this.z] = {};
    } else {
      return known[x+','+y];
    }
    return false;
  }

  search(target) {
    // todo: status effects, different search modes
    let found = false;
    this.fov.compute(
      this.x,
      this.y,
      this.sightRadius,
      (x, y, r, vis) => {
        if (target.x === x && target.y === y) {
          found = true;
        }
      }
    );
    return found;
  }

  setKnown(tile) {
    if (!this._known[tile.z]) {
      this._known[tile.z] = {};
    }
    this._known[tile.z][tile.x+','+tile.y] = tile.char;
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
    //coord.x = coord.x + this.x;
    //coord.y = coord.y + this.y;
    coord.z = coord.z ?? this.z;
    let result = game.isTileFree(coord);
    let tile = game.getTile(coord);
    if (result && this.mobile) {
      // todo: check if entity is blocking exit
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
    if (this.hp > 0) {
      this.game.engine.lock();
    }
  }
}
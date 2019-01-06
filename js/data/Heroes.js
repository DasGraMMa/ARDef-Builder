import { Gr } from "../GrUtils.js";

/**
 * @typedef {Object} HeroSkill
 * @property {String} name the skill name
 * @property {Number} rarity the rarity the skill is available at
 */

/**
 * @typedef {Object} HeroStatCollection
 * @property {HeroStats} level1 the stats at 5* Lvl 1
 * @property {HeroStats} level40 the stats at 5* Lvl 40
 * @property {HeroStats} [level1_4] the stats at 4* Lvl 1
 * @property {HeroStats} [level40_4] the stats at 4* Lvl 40
 */

/**
 * @typedef {Object} HeroStats
 * @property {Number|Array.<Number>} hp the hp stat
 * @property {Number|Array.<Number>} atk the attack stat
 * @property {Number|Array.<Number>} spd the speed stat
 * @property {Number|Array.<Number>} def the defense stat
 * @property {Number|Array.<Number>} res the resistance stat
 */

/**
 * @typedef {Object} HeroData
 * @property {String} name the real, unique name of this Hero
 * @property {String} [shortName] the short name of this Hero, if needed
 * @property {String} title the title of this Hero
 * @property {String} releaseDate the release date of this Hero
 * @property {String} colorType the color type of this Hero
 * @property {String} weaponType the weapon type of this Hero
 * @property {String} moveType the move type of this Hero
 * @property {boolean} [limited] whether this Hero is available on certain occasions only
 * @property {boolean} [ttRewards] whether this Hero is/was available as a Tempest Trial reward
 * @property {boolean} [ghb] whether this Hero is/was available as a GHB unit
 * @property {Array.<HeroSkill>} skills the skills this Hero comes with
 * @property {Array.<HeroStatCollection>} stats the stats this Hero can have
 */

class Heroes
{
    constructor(initialData = [])
    {
        /**
         * The data this Heroes object holds.
         * 
         * @type {Array.<HeroData>} the data of the Heroes
         */
        this.data = initialData;
    }

    static async getHeroesData()
    {
        let loadedJson = await Gr.ajaxRequest("GET", "/js/data/heroes.json");
        
        let toReturn = new self(loadedJson);
        return toReturn;
    }
}

export { Heroes };

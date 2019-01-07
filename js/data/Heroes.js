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

/**
 * The class representing all available Heroes.
 */
class Heroes
{
    /**
     * Creates a new Heroes container with the given initial data.
     * 
     * @param {Array.<HeroData>} initialData the data to fill the Heroes with
     */
    constructor(initialData = [])
    {
        /**
         * The data this Heroes object holds.
         * 
         * @type {Array.<HeroData>} the data of the Heroes
         */
        this.data = initialData;
    }

    /**
     * Loads the Heroes data and returns an instance with the data already filled in.
     * 
     * @returns {Heroes} an instance of Heroes with the whole data filled in
     */
    static async loadHeroesData()
    {
        let loadedJson = await Gr.ajaxRequest("GET", "/js/data/heroes.json");
        
        let toReturn = new Heroes(JSON.parse(loadedJson));
        return toReturn;
    }

    /**
     * Returns a Hero by its unique name.
     * 
     * @param {String} name the name of the Hero to return
     * @returns {HeroData} the Hero's data or `undefined` if none was found
     */
    getHero(name)
    {
        return this.data.find(heroData => heroData.name == name);
    }

    /**
     * Returns multiple Heroes fitting their given unique names.
     * 
     * @param {Array.<String>} names the names to return the Heroes for
     * @returns {Array.<HeroData>} the list of Heroes which fit the given names
     */
    getHeroes(names)
    {
        return this.data.filter(heroData => names.includes(heroData.name));
    }

    /**
     * Returns the plain underlying Heroes data.
     * 
     * @returns {Array.<HeroData>} the underlying data
     */
    getAllHeroes()
    {
        return this.data;
    }

    /**
     * Checks whether the given Hero has the given skill within the wanted rarity limit.
     * 
     * @param {HeroData} hero the Hero to check for the skill
     * @param {String} skillName the name of the skill to check for
     * @param {Number} rarity the highest rarity to check for (5 by default)
     */
    static hasSkill(hero, skillName, rarity = 5)
    {
        return hero.skills.find(skill => skill.name == skillName && skill.rarity <= rarity) != undefined;
    }

    /**
     * Returns all Heroes having the given skill within wanted rarity limit.  
     * E.g.: `rarity = 4` means skills available at maximum 4 stars, 5-star
     * skills are ignored
     * 
     * @param {String} skillName the name of the skill to find Heroes with
     * @param {Number} rarity the highest rarity to filter for (5 by default)
     */
    findHeroesWithSkill(skillName, rarity = 5)
    {
        return this.data.filter(heroData => Heroes.hasSkill(heroData, skillName, rarity));
    }
};

export { Heroes };

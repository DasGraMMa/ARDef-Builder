import { Gr } from "../GrUtils.js";

/**
 * The class representing the skill a Hero comes with and at which
 * rarity it will be unlocked.
 */
class HeroSkill
{
    /**
     * Creates a new skill for a Hero, referencing the skill with the given name,
     * being unlocked at the given rarity.
     * 
     * @param {String} name the name of the skill
     * @param {Number} rarity the rarity of the skill
     */
    constructor(name, rarity)
    {
        /** The name of this skill. */
        this.name = name;

        /** The rarity it is available at. */
        this.rarity = rarity;
    }

    /**
     * Parses a HeroSkill object based on the given json object.
     * 
     * @param {*} jsonObj the loaded json object
     */
    static parse(jsonObj)
    {
        return new HeroSkill(jsonObj.name, jsonObj.rarity);
    }
}

/**
 * The class representing the possible stats.
 */
class HeroStats
{
    /**
     * Creates a new stats object with the given stats. If given an
     * array for a stat, the values correspond to [bane, neutral, boon].
     * 
     * @param {Number|Array.<Number>} hp the hp stat
     * @param {Number|Array.<Number>} atk the attack stat
     * @param {Number|Array.<Number>} spd the speed stat
     * @param {Number|Array.<Number>} def the defense stat
     * @param {Number|Array.<Number>} res the resistance stat
     */
    constructor(hp, atk, spd, def, res)
    {
        this.hp = hp;
        this.atk = atk;
        this.spd = spd;
        this.def = def;
        this.res = res;
    }

    /**
     * Parses a HeroStats object based on the given json object.
     * 
     * @param {*} jsonObj the json object
     */
    static parse(jsonObj)
    {
        let toReturn = new HeroStats();

        for(let curKey of Object.keys(jsonObj))
        {
            toReturn[curKey] = jsonObj[curKey];
        }
        
        return toReturn;
    }
}

/**
 * The class representing the stats a specific Hero has.
 */
class HeroStatsCollection
{
    /**
     * Creates a collection of HeroStats with the base values at 5*Lvl1 and 5*Lvl40.
     * 
     * @param {HeroStats} level1 the stats of the Hero at 5*Lvl1
     * @param {HeroStats} level40 the stats of the Hero at 5*Lvl40
     */
    constructor(level1, level40)
    {
        /** The Hero's stats at 5*Lvl1. */
        this.level1 = level1;
        
        /** The Hero's stats at 5*Lvl40. */
        this.level40 = level40;

        /**
         * The Hero's stats at 4*Lvl1.
         * @type {HeroStats}
         */
        this.level1_4 = null;

        /**
         * The Hero's stats at 4*Lvl40.
         * @type {HeroStats}
         */
        this.level40_4 = null;
    }

    /**
     * Parses a HeroStats collection object based on the given json object.
     * 
     * @param {*} jsonObj the json object
     */
    static parse(jsonObj)
    {
        let toReturn = new HeroStatsCollection();

        for(let curKey of Object.keys(jsonObj))
        {
            toReturn[curKey] = HeroStats.parse(jsonObj[curKey]);
        }

        return toReturn;
    }

    /**
     * Returns a HeroStats object with the point increase per stat for the given merges.
     * 
     * @param {Number} mergeNum the number of merges to get the increase for
     * @param {("hp"|"atk"|"spd"|"def"|"res"|"")} flaw which stat corresponds to the flaw, none by default
     */
    getIncreaseForMerge(mergeNum, flaw = "")
    {
        let mergeStatBoost = new HeroStats(0, 0, 0, 0, 0);
        let stats = Object.keys(mergeStatBoost);

        // Sort by the weakest stats, because they will increase that way.
        stats.sort((stat1, stat2) => this.level1[stat2] - this.level1[stat1]);

        // And now add the merge stats.
        for(let i = 0; i < mergeNum; i++)
        {
            // Increase the current two stats.
            mergeStatBoost[stats[(2 * i) % 5]]++;
            mergeStatBoost[stats[(2 * i + 1) % 5]]++;

            // Special handling of first merge since 3.2.
            if(i == 0)
            {
                if(flaw === "")
                {
                    // Add another one to the three first stats.
                    mergeStatBoost[stats[0]]++;
                    mergeStatBoost[stats[1]]++;
                    mergeStatBoost[stats[2]]++;
                }
                else
                {
                    // Add the difference between the neutral and the flaw value.
                    mergeStatBoost[flaw] += this.level40[flaw][1] - this.level40[flaw][0];
                }
            }
        }

        return mergeStatBoost;
    }
}

/**
 * The class representing the data of one specific Hero.
 */
class HeroData
{
    /**
     * Creates the data for one specific Hero.
     * 
     * @param {String} name the unique name of this Hero
     * @param {String} title the title of this Hero
     * @param {String} releaseDate the release date of this Hero
     * @param {String} colorType the color type this Hero has
     * @param {String} weaponType the weapon type this Hero has
     * @param {String} moveType the movement type this Hero has
     * @param {Array.<HeroSkill>} skills the skills this Hero comes with
     * @param {HeroStatsCollection} stats the stats this Hero has
     */
    constructor(name, title, releaseDate, colorType, weaponType, moveType, skills, stats)
    {
        /** The unique Name of this Hero. */
        this.name = name;

        /** The short name of this Hero. Will be displayed instead of `name` if given. */
        this.shortName = null;

        /** The title of this Hero. */
        this.title = title;

        /** The release date string of this Hero. */
        this.releaseDate = releaseDate;

        /** The color type this Hero has. */
        this.colorType = colorType;

        /** The weapon type this Hero has. */
        this.weaponType = weaponType;

        /** The move type this Hero has. */
        this.moveType = moveType;

        /** The skills this Hero comes with. */
        this.skills = skills;

        /** The stats this Hero has. */
        this.stats = stats;

        /** Whether this Hero is available on certain occasions only. */
        this.limited = false;

        /** Whether this Hero was available as a Tempest Trials reward. */
        this.ttRewards = false;

        /** Whether this Hero is/was a Grand Hero Battle. */
        this.ghb = false;
    }

    /**
     * Parses a HeroData object based on the given json object.
     * 
     * @param {*} jsonObj the json object
     */
    static parse(jsonObj)
    {
        let toReturn = new HeroData();

        for(let curKey of Object.keys(jsonObj))
        {
            if(curKey === "skills")
                toReturn[curKey] = jsonObj[curKey].map(readSkill => HeroSkill.parse(readSkill));
            else if(curKey === "stats")
                toReturn[curKey] = HeroStatsCollection.parse(jsonObj[curKey]);
            else
                toReturn[curKey] = jsonObj[curKey];
        }

        return toReturn;
    }
}

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
        let loadedJsonStr = await Gr.ajaxRequest("GET", "/js/data/heroes.json");

        return Heroes.parse(loadedJsonStr);
    }

    /**
     * Parses the Heroes object based on the given json string.
     * 
     * @param {String} jsonStr the json string
     */
    static parse(jsonStr)
    {
        const jsonObj = JSON.parse(jsonStr);

        let heroData = [];
        for(let curLoaded of jsonObj)
        {
            heroData.push(HeroData.parse(curLoaded));
        }

        let toReturn = new Heroes(heroData);
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

export { Heroes, HeroSkill, HeroStats, HeroStatsCollection, HeroData };

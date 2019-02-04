import { Gr } from "../GrUtils.js";

/**
 * Represents a level descriptor for one structure's level.
 */
class StructureLevel
{
    /**
     * Constructs a new structure level info for the given level with the given cost and effect.
     * 
     * @param {Number} level the level this instance describes
     * @param {Number} cost the cost this level has
     * @param {String} effect the effect this level has
     */
    constructor(level, cost, effect)
    {
        /**
         * The level this instance describes.
         */
        this.level = level;

        /**
         * The cost this level has.
         */
        this.cost = cost;

        /**
         * The effect this level has.
         */
        this.effect = effect;
    }

    /**
     * Parses a StructureLevel object based on the given json object.
     * 
     * @param {*} jsonObj the loaded json object
     */
    static parse(jsonObj)
    {
        return new StructureLevel(jsonObj.level, jsonObj.cost, jsonObj.effect);
    }
}

/**
 * Represents a structure's data.
 */
class StructureData
{
    constructor()
    {
        /**
         * The name of this structure.
         */
        this.name = "";

        /**
         * The levels available for this structure.
         * 
         * @type {Array.<StructureLevel>}
         */
        this.levels = [];

        /**
         * The effect this instance has in case there are no multiple levels.
         */
        this.effect = "";

        /**
         * The tier until which this structure is not allowed to being placed.
         */
        this.tierLock = 0;

        /**
         * Whether this structure can be removed.
         */
        this.removable = true;

        /**
         * The cost type of this structure.
         * 
         * @type {("dew"|"stones")} the cost type
         */
        this.costType = "stones";

        /**
         * The names of the structures which can't be set when this one is placed.
         * 
         * @type {Array.<String>}
         */
        this.exclusive = [];
    }

    /**
     * Parses a StructureData object based on the given json object.
     * 
     * @param {*} jsonObj the loaded json object
     */
    static parse(jsonObj)
    {
        let toReturn = new StructureData();

        for(let curKey of Object.keys(jsonObj))
        {
            if(curKey === "levels")
                toReturn[curKey] = jsonObj[curKey].map(readLevel => StructureLevel.parse(readLevel));
            else
                toReturn[curKey] = jsonObj[curKey];
        }

        return toReturn;
    }
}

/**
 * Represents the structure holder, holding all the available structures in their
 * respective categories.
 */
class StructureHolder
{
    constructor()
    {
        /**
         * The available offensive structures.
         * 
         * @type {Array.<StructureData>}
         */
        this.offensive = [];

        /**
         * The available defensive structures.
         * 
         * @type {Array.<StructureData>}
         */
        this.defensive = [];

        /**
         * The available traps.
         * 
         * @type {Array.<StructureData>}
         */
        this.traps = [];

        /**
         * The available ornament structures.
         * 
         * @type {Array.<StructureData>}
         */
        this.ornaments = [];

        /**
         * The available resource structures.
         * 
         * @type {Array.<StructureData>}
         */
        this.resources = [];
    }

    /**
     * Parses the StructureHolder object based on the given json object.
     * 
     * @param {*} jsonObj the loaded json object
     */
    static parse(jsonObj)
    {
        let toReturn = new StructureHolder();

        for(let curKey of Object.keys(jsonObj))
        {
            toReturn[curKey] = jsonObj[curKey].map(readStructure => StructureData.parse(readStructure));
        }

        return toReturn;
    }
}

/**
 * The class representing the structures.
 */
class Structures
{
    /**
     * Creates the structure object with the given initial structure holder.
     * 
     * @param {StructureHolder} initialData the initial structure holder
     */
    constructor(initialData = new StructureHolder())
    {
        this.data = initialData;
    }

    /**
     * Loads the structure data and returns a new Structures object with it.
     */
    static async loadStructureData()
    {
        let loadedStructures = await Gr.ajaxRequest("GET", "/js/data/structures.json");

        return new Structures(StructureHolder.parse(JSON.parse(loadedStructures)));
    }
}

export { Structures, StructureHolder, StructureData, StructureLevel };

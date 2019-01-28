import { Gr } from "../GrUtils.js";
import { HeroData, HeroStats } from "./Heroes.js";

/**
 * Represents a skill restrictor, which checks against certain
 * properties of the heroes. Has the same structure as the actual HeroData.
 */
class SkillRestrictor extends HeroData
{
    /**
     * Create a skill restrictor. By default, no restrictions will
     * be set.
     */
    constructor() { super(); }
}

/**
 * Represents the base of all the skill data.
 */
class SkillData
{
    constructor(name, spCost)
    {
        /** The unique name of the skill. */
        this.name = name;
        
        /** The SP cost of this skill. */
        this.spCost = spCost;

        /** The icon this skill has, if any. Is described as `row-column` on the skill sprite-sheet. */
        this.icon = "";

        /** The damage this skill does, if any. */
        this.damage = 0;

        /** The range this skill has, if any. */
        this.range = 0;

        /**
         * The filters which determine whether a Hero can use this skill. Has to match at least one.
         * @type {Array.<SkillRestrictor>}
         */
        this.include = [];

        /**
         * The filters which determine whether a Hero cannot use this skill. Invalid as soon as one matches.
         * @type {Array.<SkillRestrictor>}
         */
        this.exclude = [];

        /**
         * The skills which serve as a requirement for this one to be learnable. Only one has to be learned.
         * @type {Array.<String>}
         */
        this.prev = [];

        /**
         * The stat change this skill will cause when equipped. Can increase or decrease stats.
         */
        this.stats = new HeroStats(0, 0, 0, 0, 0);

        /**
         * The effect this skill has. Just a description.
         */
        this.effect = "";
    }
}

class SkillHolder
{
    constructor()
    {
        /**
         * The list of skills which represent weapons.
         * @type {Array.<SkillData>}
         */
        this.weapons = [];
        
        /**
         * The list of skills which represent assist skills.
         * @type {Array.<SkillData>}
         */
        this.assists = [];

        /**
         * The list of skills which represent specials.
         * @type {Array.<SkillData>}
         */
        this.specials = [];
        
        /**
         * The list of skills which represent A-slot skills.
         * @type {Array.<SkillData>}
         */
        this.aSkills = [];
        
        /**
         * The list of skills which represent B-slot skills.
         * @type {Array.<SkillData>}
         */
        this.bSkills = [];
        
        /**
         * The list of skills which represent C-slot skills.
         * @type {Array.<SkillData>}
         */
        this.cSkills = [];
        
        /**
         * The list of skills which represent seals.
         * @type {Array.<SkillData>}
         */
        this.seals = [];
    }
}

/**
 * The class holding all the available skills.
 */
class Skills
{
    constructor(initialData = {})
    {
        /**
         * The data this Skills object holds.
         * 
         * @type {SkillHolder}
         */
        this.data = initialData;
    }

    /**
     * Returns the (first found) skill with the given name of the given type.
     * 
     * @param {String} skillName the name of the skill to search for
     * @param {String} type the type of the skill
     * @returns the requested skill or undefined, if it couldn't be found
     */
    getSkill(skillName, type)
    {
        let skillsToCheck = this.getAllSkillsOf(type);

        return skillsToCheck.find(curSkill => curSkill.name == skillName);
    }

    /**
     * Returns the container with the skills of the given type.
     * 
     * @param {String} type the name of the type to get the skills for
     * @returns {Array} the container with the skills of the type
     */
    getAllSkillsOf(type)
    {
        return this.data[type];
    }

    /**
     * Returns the plain underlying Skills data.
     * 
     * @returns {SkillHolder} the underlying data
     */
    getAllSkills()
    {
        return this.data;
    }

    static async loadSkillData()
    {
        // TODO: Uh, this really isn't optimal. Combine the skill files into one?
        let loadedWeapon = await Gr.ajaxRequest("GET", "/js/data/skillsWeapon.json");
        let loadedAssist = await Gr.ajaxRequest("GET", "/js/data/skillsAssist.json");
        let loadedSpecial = await Gr.ajaxRequest("GET", "/js/data/skillsSpecial.json");
        let loadedA = await Gr.ajaxRequest("GET", "/js/data/skillsA.json");
        let loadedB = await Gr.ajaxRequest("GET", "/js/data/skillsB.json");
        let loadedC = await Gr.ajaxRequest("GET", "/js/data/skillsC.json");
        let loadedSeal = await Gr.ajaxRequest("GET", "/js/data/skillsSeal.json");

        let toReturn = new Skills({
            weapons: JSON.parse(loadedWeapon),
            assists: JSON.parse(loadedAssist),
            specials: JSON.parse(loadedSpecial),
            aSkills: JSON.parse(loadedA),
            bSkills: JSON.parse(loadedB),
            cSkills: JSON.parse(loadedC),
            seals: JSON.parse(loadedSeal)
        });

        return toReturn;
    }
}

Skills.EMPTY = Object.freeze({ name: "-", icon: "", effect: "" });

export { Skills };

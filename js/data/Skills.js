import { Gr } from "../GrUtils.js";

/**
 * @typedef {Object} SkillStatChange
 * @property {Number} [hp] the hp change
 * @property {Number} [atk] the attack change
 * @property {Number} [spd] the speed change
 * @property {Number} [def] the defense change
 * @property {Number} [res] the resistance change
 */

/**
 * @typedef {Object} SkillRestrictor
 */

/**
 * @typedef {Object} SkillWeapon
 * @property {String} name the name of the weapon skill
 * @property {Number} spCost the SP cost this skill has
 * @property {Number} damage the base damage this weapon has
 * @property {Number} range the range this weapon has
 * @property {String} weaponType the type this weapon belongs to
 * @property {String} [colorType] the type of color this weapon belongs to, if any
 * @property {Array.<String>} [exclusive] the name of the units for which this skill is exclusive
 * @property {Array.<String>} [prev] the skill names of the required skills for this one to be learned
 * @property {SkillStatChange} [stats] the stat change this weapon makes when equipped
 * @property {String} effect the effect this weapon has
 */

/**
 * @typedef {Object} SkillAssist
 * @property {String} name the name of the assist skill
 * @property {Number} spCost the SP cost this skill has
 * @property {Number} range the range of this assist skill
 * @property {Array.<String>} [prev] the skill names of the required skills for this one to be learned
 * @property {Array.<SkillRestrictor>} [include] the filter for Heroes which are allowed to use this skill
 * @property {Array.<SkillRestrictor>} [exclude] the filter for Heroes which are not allowed to use this skill
 * @property {boolean} [last] whether this skill is the last in its sequence
 * @property {String} effect the effect this assist has
 */

/**
 * @typedef {Object} SkillHolder
 * @property {Array.<SkillWeapon>} weapons the list of weapon skills
 * @property {Array.<SkillAssist>} assists the list of assist skills
 * @property {Array.<SkillSpecial>} specials the list of special skills
 * @property {Array.<SkillA>} aSkills the list of A skills
 * @property {Array.<SkillB>} bSkills the list of B skills
 * @property {Array.<SkillC>} cSkills the list of C skills
 * @property {Array.<SkillSeal>} seals the list of seals of skills
 */

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

export { Skills };

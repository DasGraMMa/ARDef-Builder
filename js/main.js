import { Gr } from "./GrUtils.js";
import { Heroes } from "./data/Heroes.js";
import { Skills } from "./data/Skills.js";
import { Structures } from "./data/Structures.js";

(async function()
{
    let heroes = await Heroes.loadHeroesData();
    Gr.log(heroes);

    let skills = await Skills.loadSkillData();
    Gr.log(skills);

    let structures = await Structures.loadStructureData();
    Gr.log(structures);
})();

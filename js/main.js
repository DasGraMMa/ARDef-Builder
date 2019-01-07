import { Heroes } from "./data/Heroes.js";
import { Gr } from "./GrUtils.js";
import { Skills } from "./data/Skills.js";

async function main()
{
    let heroes = await Heroes.loadHeroesData();

    Gr.log(heroes);

    let skills = await Skills.loadSkillData();

    Gr.log(skills);
}

main();

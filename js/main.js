import { Heroes } from "./data/Heroes.js";
import { Gr } from "./GrUtils.js";

async function main()
{
    let inst = await Heroes.getHeroesData();

    Gr.log(inst);
}

main();

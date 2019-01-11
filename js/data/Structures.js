import { Gr } from "../GrUtils.js";

class Structures
{
    constructor(initialData = {})
    {
        this.data = initialData;
    }

    static async loadStructureData()
    {
        let loadedStructures = await Gr.ajaxRequest("GET", "/js/data/structures.json");

        return new Structures(JSON.parse(loadedStructures));
    }
}

export { Structures };

interface IFuel {
    price: number;
    maj: Date;
}

interface JsonFuel {
    type: "element";
    name: "prix";
    attributes: {
        "nom": string,
        "id": string,
        "maj": string,
        "valeur": string,
    };

}

interface IPdv {
    fuels: {
        E10: IFuel
        GAZOLE: IFuel,
        E85: IFuel,
    };
    address: string;
    postalCode: string;
}

interface JsonElement {
    name: string;
    "attributes": {
        "id": string,
        "latitude": string,
        "longitude": string,
        "cp": string,
        "pop": string,
    };
    elements: [
        JsonFuel | string
    ];
}

export class Pdv implements IPdv {

    public address: string;
    public fuels: { E10: IFuel; GAZOLE: IFuel; E85: IFuel };
    public postalCode: string;

    private constructor(jsonElement: JsonElement) {

    }

    public static all(): Pdv[] {
        const pdvs: Pdv[] = [];

        return pdvs;

    }

}

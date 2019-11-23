import {Jsonable} from "../JsonStorage";

export class UnknownJsonKey extends Error {
    constructor(object: Jsonable, key: string) {
        super(`Unknown key ${key} in ${JSON.stringify(object)}`);
    }

}

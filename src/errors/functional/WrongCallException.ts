import {FunctionalException} from "./FunctionalException";

export class WrongCallException extends FunctionalException {

    public constructor(uri: URI) {
        super();
        this.errorType = "Call";
        this.description = uri.parameters.map((param: Parameter, index) => {
            return `Parameter ${index}: ${param.name} : ${param.type} : ${param.description}`;
        });

    }

}

export interface Parameter {
    name: string;
    type: any;
    possibleValues?: any[];
    description?: string;
}

export interface URI {
    url: string;
    method: Method;
    parameters?: Parameter[];
    description?: string;
}

export interface API {
    [key: string]: URI;
}

export enum Method {
    GET = "get",
    PUT = "put",
    POST = "post",
    DELETE = "delete",
}

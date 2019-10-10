import { PersonneE } from './e_personne';



export class ClientE extends PersonneE{
    constructor(
        name?: string,
        public idClient?: number,
        public raison_sociale?: string,
        public type?: TypeClientEnum
        ) {
        super(null, name);
    }
}

export enum TypeClientEnum {
    NORMAL,
    GROSSISTE,
    SEMI_GROSSISTE
}

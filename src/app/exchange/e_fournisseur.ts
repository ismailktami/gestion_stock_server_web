import { PersonneE } from './e_personne';



export class FournisseurE extends PersonneE {
    constructor(
        name?: string,
        public idFournisseur ?: number,
        public raison_sociale ?: string,
        // public numero_tele?: number,
        // public credit ?: number,
        // public pret?: number,
        ) {
        super(null, name);
    }
}
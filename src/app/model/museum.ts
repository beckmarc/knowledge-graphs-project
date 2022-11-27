import { RDFData, RDFValue } from './../services/rdfdata';

export interface Museum {
    museum: RDFValue;
    name: RDFValue;
    thumbnail: RDFValue;
    abstract: RDFValue;
}
import { RDFValue } from "../services/rdfdata";


export interface Art {
    art: RDFValue;
    dboAbstract: RDFValue;
    dboAuthorUri: RDFValue;
    dboAuthorDbpLabel: RDFValue;
    dboThumbnail: RDFValue;
    rdfsLabel: RDFValue;
}
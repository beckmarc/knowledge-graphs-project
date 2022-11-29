import { RDFValue } from "../services/rdfdata";


export interface Art {
    art: RDFValue;
    dboAbstract: RDFValue;
    dboAuthorUri: RDFValue;
    dboAuthorDbpLabel: RDFValue;
    dboThumbnail: RDFValue;
    dbpYear: RDFValue;
    rdfsLabel: RDFValue;
    dbpAuthorName: RDFValue;
    dbpCity: RDFValue; 
    dbpHeightMetric: RDFValue; 
    dbpMetricUnit: RDFValue; 
    dbpWidthMetric: RDFValue; 
    dbpCityName: RDFValue;
    dboMuseum: RDFValue;
    dbpMuseumName: RDFValue;
}
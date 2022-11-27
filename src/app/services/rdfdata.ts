export interface RDFData<T> {
    head: {
      link: string[];
      vars: string[];
    };
    results: {
        bindings: T[];
        distinct: boolean;
        ordered: boolean;
    }
}

export interface RDFValue {
    value: string;
    'xml:lang': string;
    type: string;
}
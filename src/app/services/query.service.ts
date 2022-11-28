import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, enableProdMode } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Museum } from '../model/museum';
import { RDFData } from './rdfdata';
import { Art } from './../model/art';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  serviceUrl = 'https://dbpedia.org/sparql'

  constructor(
    private http: HttpClient
  ) { }

  getRDF<T>(query: string) {
    const params = new HttpParams()
        .set('query', query)
        .set('format', 'json');
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/sparql-results+json'
        }),
        params: params
      };
      return this.http.get<RDFData<T>>(this.serviceUrl, options).toPromise()
  }

  async findArtDetail(id: string, filters?: any): Promise<Art>{
    id = `<http://dbpedia.org/resource/${id}>`;
    const query = `
    select distinct ?dboAbstract, ?dboThumbnail, ?rdfsLabel
    where {
      ${id} rdfs:label ?rdfsLabel FILTER (langMatches(lang(?rdfsLabel),"en")) .
      ${id} dbo:thumbnail ?dboThumbnail .
      ${id} dbo:abstract ?dboAbstract FILTER (langMatches(lang(?dboAbstract),"en"))
    }
    `;
    const queryResult = (await this.getRDF<Art>(query));
    console.log(queryResult.results.bindings);
    return queryResult.results.bindings[0];
  }

  async findArtOfArtist(id: string, filters?: any): Promise<Art[]>{
    id = `<http://dbpedia.org/resource/${id}>`;
    const query = `
    select distinct ?art, ?dboThumbnail, ?rdfsLabel, ?dboAuthor
    where {
      ${id} dbo:author $author .
      ?art dbo:author $author .
      ?art dbo:abstract ?dboAbstract .
      ?art dbo:thumbnail ?dboThumbnail .
      ?art rdfs:label ?rdfsLabel .
      FILTER (langMatches(lang(?rdfsLabel ),"en"))
      FILTER (${id} != $art)
    }
    `;
    const queryResult = (await this.getRDF<Art>(query));
    console.log(queryResult.results.bindings);
    return queryResult.results.bindings;
  }

  async findArtOfMuseum(id: string, filters?: any): Promise<Art[]>{
    id = `<http://dbpedia.org/resource/${id}>`;
    const query = `
    select distinct ?art, ?dboAbstract, ?dboThumbnail, ?rdfsLabel, ?dboAuthor, ?dbpYear
    where {
      ?art dbo:museum ${id} .
      ?art dbo:abstract ?dboAbstract .
      ?art dbo:thumbnail ?dboThumbnail .
      ?art rdfs:label ?rdfsLabel .
      ?art dbp:year ?dbpYear .
      optional {
      ?art dbo:author ?dboAuthor
      }.
      FILTER (langMatches(lang(?dboAbstract),"en"))
      FILTER (langMatches(lang(?rdfsLabel ),"en"))
      ${filters ? `FILTER (?dbpYear >= ${filters.startYear} && ?dbpYear <= ${filters.endYear})` : ''}
    }
    `;
    const queryResult = (await this.getRDF<Art>(query));
    console.log(queryResult.results.bindings);
    return queryResult.results.bindings;
  }

  async findMuseums(): Promise<Museum[]>{
    const query = `
    SELECT DISTINCT ?museum, ?name, ?thumbnail, ?abstract
    WHERE {  
    ?museum dbo:type dbr:Art_museum .
    ?museum rdfs:label ?name FILTER (langMatches(lang(?name),"en")) .
    ?museum dbo:thumbnail ?thumbnail .
    ?museum dbo:abstract ?abstract FILTER (langMatches(lang(?abstract),"en"))
    OPTIONAL {?art dbo:museum ?museum . }
    FILTER(BOUND(?art) )
    }
    ORDER BY ASC(?name)
    `;
    const queryResult = (await this.getRDF<Museum>(query));
    console.log(queryResult.results.bindings);
    return queryResult.results.bindings;
  }

  async findMuseumDetail(id: string): Promise<Museum>{
    id = `<http://dbpedia.org/resource/${id}>`;
    const query = `
    SELECT DISTINCT ?name, ?thumbnail, ?abstract
      WHERE {  
      ${id} rdfs:label ?name FILTER (langMatches(lang(?name),"en")) .
      ${id} dbo:thumbnail ?thumbnail .
      ${id} dbo:abstract ?abstract FILTER (langMatches(lang(?abstract),"en"))
      }
    `;
    const queryResult = (await this.getRDF<Museum>(query));
    return queryResult.results.bindings[0];
  }

  private log(message: string, data?: any) {
      console.log(`SparqlService: ${message}`, data);
  }
}



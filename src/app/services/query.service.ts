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
    select distinct 
      ?dboAbstract, ?dboThumbnail, ?dboMuseum,
      ?rdfsLabel, ?dbpYear, ?dbpAuthorName, ?dbpCity, ?dbpCityName, ?dbpHeightMetric, ?dbpMetricUnit, ?dbpWidthMetric
    where {
      ${id} rdfs:label ?rdfsLabel FILTER (langMatches(lang(?rdfsLabel),"en")) .
      ${id} dbo:thumbnail ?dboThumbnail .
      ${id} dbo:abstract ?dboAbstract FILTER (langMatches(lang(?dboAbstract),"en")) .
      ${id} dbo:museum ?dboMuseum .
      optional { ${id} dbp:year ?dbpYear }
      optional { 
        ${id} dbp:city ?dbpCity .
        ?dbpCity dbp:name ?dbpCityName
      }
      optional { 
        ${id} dbp:heightMetric ?dbpHeightMetric .
        ${id} dbp:widthMetric ?dbpWidthMetric .
      }
      optional {
        ${id} dbp:metricUnit ?dbpMetricUnit .
      }
      optional {
        ${id} dbo:author ?dboAuthor .
        ?dboAuthor dbp:name ?dbpAuthorName .
      }
    }
    `;
    const queryResult = (await this.getRDF<Art>(query));
    console.log(queryResult.results.bindings);
    return queryResult.results.bindings[0];
  }

  async findArtFromSimilarTimes(id: string, year: number): Promise<Art[]>{
    console.log(year);
    id = `<http://dbpedia.org/resource/${id}>`;
    const query = `
    select distinct ?art, ?dboThumbnail, ?rdfsLabel, ?dboAuthor, 
      ?dboMuseum, ?dbpMuseumName, ?dbpHeightMetric, ?dbpMetricUnit, ?dbpWidthMetric, ?dbpYear
    where {
      ?art dbp:heightMetric ?dbpHeightMetric .
      ?art dbp:widthMetric ?dbpWidthMetric .
      ?art dbo:abstract ?dboAbstract .
      ?art dbo:thumbnail ?dboThumbnail .
      ?art rdfs:label ?rdfsLabel .
      ?art dbo:museum ?dboMuseum .
      ?art dbp:year ?dbpYear .
      ?dboMuseum dbp:name ?dbpMuseumName .
      optional {
        ${id} dbp:metricUnit ?dbpMetricUnit 
      }
      FILTER (?dbpYear >= ${(year - 5)} && ?dbpYear <= ${Math.round((year + 5))})
      FILTER (langMatches(lang(?rdfsLabel ),"en"))
      FILTER (langMatches(lang(?dbpMuseumName ),"en"))
      FILTER (${id} != $art)
    }
    `;
    const queryResult = (await this.getRDF<Art>(query));
    console.log(queryResult.results.bindings);
    return queryResult.results.bindings;
  }


  async findArtWithSimilarDimensions(id: string, height: number, width: number): Promise<Art[]>{
    id = `<http://dbpedia.org/resource/${id}>`;
    const query = `
    select distinct ?art, ?dboThumbnail, ?rdfsLabel, ?dboAuthor, 
      ?dboMuseum, ?dbpMuseumName, ?dbpHeightMetric, ?dbpMetricUnit, ?dbpWidthMetric
    where {
      ?art dbp:heightMetric ?dbpHeightMetric .
      ?art dbp:widthMetric ?dbpWidthMetric .
      ?art dbo:abstract ?dboAbstract .
      ?art dbo:thumbnail ?dboThumbnail .
      ?art rdfs:label ?rdfsLabel .
      ?art dbo:museum ?dboMuseum .
      ?dboMuseum dbp:name ?dbpMuseumName .
      optional {
        ${id} dbp:metricUnit ?dbpMetricUnit 
      }
      FILTER (langMatches(lang(?rdfsLabel ),"en"))
      FILTER (langMatches(lang(?dbpMuseumName ),"en"))
      FILTER (
        ?dbpHeightMetric >= (${height * 0.90}) && ?dbpHeightMetric <= (${height * 1.1}) && 
        ?dbpWidthMetric >= (${width * 0.90}) && ?dbpWidthMetric <= (${width * 1.1})
      )
      FILTER (${id} != $art)
    }
    `;
    const queryResult = (await this.getRDF<Art>(query));
    console.log(queryResult.results.bindings);
    return queryResult.results.bindings;
  }

  async findArtOfArtist(id: string, filters?: any): Promise<Art[]>{
    id = `<http://dbpedia.org/resource/${id}>`;
    const query = `
    select distinct ?art, ?dboThumbnail, ?rdfsLabel, ?dboAuthor, ?dboMuseum, ?dbpMuseumName
    where {
      ${id} dbo:author $author .
      ?art dbo:author $author .
      ?art dbo:abstract ?dboAbstract .
      ?art dbo:thumbnail ?dboThumbnail .
      ?art rdfs:label ?rdfsLabel .
      ?art dbo:museum ?dboMuseum .
      ?dboMuseum dbp:name ?dbpMuseumName .
      FILTER (langMatches(lang(?dbpMuseumName ),"en"))
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
    select distinct ?art, ?dboAbstract, ?dboThumbnail, ?rdfsLabel, ?dboAuthor, ?dbpAuthorName, ?dbpYear
    where {
      ?art dbo:museum ${id} . 
      ?art dbo:thumbnail ?dboThumbnail .
      ?art rdfs:label ?rdfsLabel .
      ?art dbo:abstract ?dboAbstract .
      optional {
        ?art dbo:author ?dboAuthor .
        ?dboAuthor dbp:name ?dbpAuthorName .
      }.
      optional { ?art dbp:year ?dbpYear }
      FILTER (langMatches(lang(?dboAbstract),"en"))
      FILTER (langMatches(lang(?rdfsLabel ),"en"))
      
      ${filters ? `FILTER (?dbpYear >= ${filters.startYear} && ?dbpYear <= ${filters.endYear})` : ''}
    }
    ORDER BY ASC(?rdfsLabel)
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
      OPTIONAL {
        ?art dbo:museum ?museum . 
      }
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



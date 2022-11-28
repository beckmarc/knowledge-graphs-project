import { Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Art } from '../../model/art';
import { Museum } from '../../model/museum';
import { QueryService } from '../../services/query.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-museum-detail',
  templateUrl: './museum-detail.component.html',
  styleUrls: ['./museum-detail.component.scss']
})
export class MuseumDetailComponent implements OnInit {

  museumId!: string;
  museum!: Museum;
  artPieces: Art[] = [];

  selectedArtType!: String;
  startYear: number = 1400;
  endYear: number = 2100;
  options: Options = {
    floor: 1400,
    ceil: 2100
  };

  timeOut!: any;
  timeOutDuration = 300;


  constructor(
    private route: ActivatedRoute,
    private queryService: QueryService,
    private shared: SharedService
  ) { }

  async ngOnInit(): Promise<void> {
    this.museumId = this.route.snapshot.params.id;
    this.museum = (await this.queryService.findMuseumDetail(this.museumId));
    this.artPieces = await this.queryService.findArtOfMuseum(this.museumId);
    this.shared.breadcrumbs = [
      {
        name: this.museum.name.value,
        link: 'museums/' + this.museumId
      }
    ]
  }

  async applyFilters() {
    this.artPieces = await this.queryService.findArtOfMuseum(this.museumId, {startYear: this.startYear, endYear: this.endYear});
  }

  async removeFilters() {
    this.artPieces = await this.queryService.findArtOfMuseum(this.museumId);
  }
}

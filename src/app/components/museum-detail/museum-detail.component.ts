import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Art } from '../../model/art';
import { Museum } from '../../model/museum';
import { QueryService } from '../../services/query.service';

@Component({
  selector: 'app-museum-detail',
  templateUrl: './museum-detail.component.html',
  styleUrls: ['./museum-detail.component.scss']
})
export class MuseumDetailComponent implements OnInit {

  museumId!: string;
  museum!: Museum;
  artPieces: Art[] = [];

  constructor(
    private route: ActivatedRoute,
    private queryService: QueryService
  ) { }

  async ngOnInit(): Promise<void> {
    this.museumId = this.route.snapshot.params.id;
    this.museum = (await this.queryService.findMuseumDetail(this.museumId));
    this.artPieces = await this.queryService.findArtOfMuseum(this.museumId);
  }

}

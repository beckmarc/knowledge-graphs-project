import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Art } from '../../model/art';
import { Museum } from '../../model/museum';
import { QueryService } from '../../services/query.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-art-detail-view',
  templateUrl: './art-detail-view.component.html',
  styleUrls: ['./art-detail-view.component.scss']
})
export class ArtDetailViewComponent implements OnInit {

  museumId!: string;
  museum!: Museum;
  artId!: string;
  artPiece!: Art;

  otherArtOfArtist: Art[] = [];
  artWithSimilarDim: Art[] = [];
  artFromSimilarTimes: Art[] = [];

  panelOpenState = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private queryService: QueryService,
    private shared: SharedService
  ) { }

  async ngOnInit(): Promise<void> {
    this.museumId = this.route.snapshot.params.museumId;
    this.artId = this.route.snapshot.params.id;
    this.museum = (await this.queryService.findMuseumDetail(this.museumId));
    this.artPiece = (await this.queryService.findArtDetail(this.artId));
    this.shared.breadcrumbs = [
      {
        name: this.museum.name.value,
        link: 'museums/' + this.museumId
      },
      {
        name: this.artPiece.rdfsLabel.value,
        link: 'museums/' + this.museumId + '/art/' + this.artId
      }
    ]
    this.otherArtOfArtist = await this.queryService.findArtOfArtist(this.artId);
    console.log(this.artPiece);
    this.artWithSimilarDim = await this.queryService.findArtWithSimilarDimensions(
      this.artId, 
      parseInt(this.artPiece.dbpHeightMetric.value), 
      parseInt(this.artPiece.dbpWidthMetric.value)
    );
    this.artFromSimilarTimes = await this.queryService.findArtFromSimilarTimes(
      this.artId, 
      parseInt(this.artPiece.dbpYear.value.match(/\d+/)![0])
    )
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.location.reload();
      }
    });
  }

}

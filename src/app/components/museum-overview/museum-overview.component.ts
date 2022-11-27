import { Component, OnInit } from '@angular/core';
import { Museum } from '../../model/museum';
import { QueryService } from './../../services/query.service';


@Component({
  selector: 'app-museum-overview',
  templateUrl: './museum-overview.component.html',
  styleUrls: ['./museum-overview.component.scss']
})
export class MuseumOverviewComponent implements OnInit {

  museums: Museum[] = [];

  constructor(
    private queryService: QueryService
  ) { }

  async ngOnInit(): Promise<void> {
    this.museums = await this.queryService.findMuseums();
  }

}

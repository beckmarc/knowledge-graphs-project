import { Component, OnInit } from '@angular/core';
import { Museum } from '../../model/museum';
import { QueryService } from './../../services/query.service';
import { SharedService } from './../../services/shared.service';


@Component({
  selector: 'app-museum-overview',
  templateUrl: './museum-overview.component.html',
  styleUrls: ['./museum-overview.component.scss']
})
export class MuseumOverviewComponent implements OnInit {

  museums: Museum[] = [];
  filteredMuseums: Museum[] = [];
  searchTerm: string = '';

  constructor(
    private queryService: QueryService,
    private shared: SharedService
  ) { }

  async ngOnInit(): Promise<void> {
    this.museums = await this.queryService.findMuseums();
    this.filteredMuseums = [...this.museums];
    this.shared.breadcrumbs = [];
  }

  updateSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.filteredMuseums = this.museums.filter(m => m.name.value.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
}

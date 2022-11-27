import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtDetailViewComponent } from './art-detail-view.component';

describe('ArtDetailViewComponent', () => {
  let component: ArtDetailViewComponent;
  let fixture: ComponentFixture<ArtDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

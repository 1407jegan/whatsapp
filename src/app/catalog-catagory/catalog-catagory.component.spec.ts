import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogCatagoryComponent } from './catalog-catagory.component';

describe('CatalogCatagoryComponent', () => {
  let component: CatalogCatagoryComponent;
  let fixture: ComponentFixture<CatalogCatagoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogCatagoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogCatagoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedsComponent } from './blockeds.component';

describe('BlockedsComponent', () => {
  let component: BlockedsComponent;
  let fixture: ComponentFixture<BlockedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockedsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogMonitorComponent } from './log-monitor.component';

describe('LogMonitorComponent', () => {
  let component: LogMonitorComponent;
  let fixture: ComponentFixture<LogMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogMonitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDialogComponent } from 'src/app/Presentation/Dialog/header-dialog/header-dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MockModule, MockProviders, MockService } from 'ng-mocks';
import { FormBuilder } from '@angular/forms';
import { ReplayService } from '../../../Service/Replay/replay.service';

describe('HeaderDialogComponent', () => {
  let component: HeaderDialogComponent;
  let fixture: ComponentFixture<HeaderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderDialogComponent],
      imports: [MockModule(MatDialogModule)],
      providers: [
        {
          provide: ReplayService,
          useValue: MockService(ReplayService),
        },
        {
          provide: FormBuilder,
        },
        MockProviders(MatDialog, MatDialogRef),
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
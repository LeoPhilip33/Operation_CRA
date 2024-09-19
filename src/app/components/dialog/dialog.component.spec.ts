import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-test-host',
  template: `<app-dialog><div class="test-content">Content</div></app-dialog>`,
})
class TestHostComponent {}

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [DialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the container with the correct class', () => {
    const dialogContainer =
      fixture.nativeElement.querySelector('.dialog-container');
    expect(dialogContainer).toBeTruthy();
    expect(dialogContainer.classList).toContain('dialog-container');
  });

  it('should project content correctly', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const content = hostFixture.nativeElement.querySelector('.test-content');
    expect(content).toBeTruthy();
    expect(content.textContent).toContain('Content');
  });
});

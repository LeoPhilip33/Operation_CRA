import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AgentFormComponent } from './agent-form.component';
import { By } from '@angular/platform-browser';

describe('AgentFormComponent', () => {
  let component: AgentFormComponent;
  let fixture: ComponentFixture<AgentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AgentFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message when lastName is invalid', () => {
    component.agents.controls['lastName'].setValue('');
    component.agents.controls['lastName'].markAsTouched();
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.query(
      By.css('.error')
    ).nativeElement;
    expect(errorMessage.textContent).toContain('Le nom est requis.');
  });

  it('should display error message when firstName is invalid', () => {
    component.agents.controls['firstName'].setValue('');
    component.agents.controls['firstName'].markAsTouched();
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.query(
      By.css('.error')
    ).nativeElement;
    expect(errorMessage.textContent).toContain('Le prénom est requis.');
  });

  it('should call onSubmit when form is submitted', () => {
    spyOn(component, 'onSubmit');
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should add agent when form is valid', () => {
    component.agents.controls['lastName'].setValue('Doe');
    component.agents.controls['firstName'].setValue('John');
    component.onSubmit();
    expect(component.errorMessage).toBeNull();
  });
});

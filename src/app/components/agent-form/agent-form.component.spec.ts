import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AgentFormComponent } from './agent-form.component';
import { deleteAgent } from '../../store/app.actions';
import { Agent } from '../../interfaces/agent';

describe('AgentFormComponent', () => {
  let component: AgentFormComponent;
  let fixture: ComponentFixture<AgentFormComponent>;
  let store: jasmine.SpyObj<Store<{ app: { agents: Agent[] } }>>;

  beforeEach(async () => {
    store = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    store.select.and.returnValue(
      of([{ id: 1, lastName: 'Doe', firstName: 'John', leaveBalance: 5 }])
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AgentFormComponent],
      providers: [{ provide: Store, useValue: store }],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentFormComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    store.dispatch.calls.reset();
    store.select.calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.agents.value).toEqual({
      id: 0,
      lastName: '',
      firstName: '',
      leaveBalance: 5,
    });
  });

  it('should mark the form as invalid if required fields are missing', () => {
    component.onSubmit();
    expect(component.agents.invalid).toBeTrue();
    expect(component.errorMessage).toBe('Form is invalid');
  });

  it('should validate lastName and firstName fields correctly', () => {
    component.agents.patchValue({
      lastName: 'Do',
      firstName: 'Jo',
    });

    component.lastName?.markAsTouched();
    component.firstName?.markAsTouched();

    expect(component.isFieldInvalid('lastName')).toBeTrue();
    expect(component.isFieldInvalid('firstName')).toBeTrue();

    component.agents.patchValue({
      lastName: 'Doe',
      firstName: 'John',
    });

    component.lastName?.markAsTouched();
    component.firstName?.markAsTouched();

    expect(component.isFieldInvalid('lastName')).toBeFalse();
    expect(component.isFieldInvalid('firstName')).toBeFalse();
  });

  it('should reset the form after successful submission', fakeAsync(() => {
    component.agents.patchValue({
      lastName: 'Doe',
      firstName: 'John',
    });

    component.onSubmit();
    flush();

    expect(component.agents.value).toEqual({
      id: null,
      lastName: null,
      firstName: null,
      leaveBalance: 5,
    });
  }));

  it('should dispatch deleteAgent when calling deleteAgent method', () => {
    component.deleteAgent(1);

    expect(store.dispatch).toHaveBeenCalledWith(deleteAgent({ id: 1 }));
  });

  it('should update the id field based on the number of agents', fakeAsync(() => {
    store.select.and.returnValue(
      of([{ id: 1, lastName: 'Doe', firstName: 'John', leaveBalance: 5 }])
    );

    component.onSubmit();
    tick();

    expect(component.agents.get('id')?.value).toBe(1);
  }));
});

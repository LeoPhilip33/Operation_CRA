import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentsComponent } from './agents.component';
import { HeaderComponent } from '../../components/header/header.component';
import { AgentFormComponent } from '../../components/agent-form/agent-form.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

describe('AgentsComponent', () => {
  let component: AgentsComponent;
  let fixture: ComponentFixture<AgentsComponent>;
  let store: MockStore;
  const initialState = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AgentsComponent,
        HeaderComponent,
        RouterModule.forRoot([]),
        AgentFormComponent,
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render HeaderComponent', () => {
    const headerElement = fixture.debugElement.query(
      By.directive(HeaderComponent)
    );
    expect(headerElement).toBeTruthy();
  });

  it('should render AgentFormComponent', () => {
    const agentFormElement = fixture.debugElement.query(
      By.directive(AgentFormComponent)
    );
    expect(agentFormElement).toBeTruthy();
  });

  it('should contain container-agents class', () => {
    const containerElement = fixture.debugElement.query(
      By.css('.container-agents')
    );
    expect(containerElement).toBeTruthy();
  });

  it('should have app-agent-form inside container-agents', () => {
    const containerElement = fixture.debugElement.query(
      By.css('.container-agents')
    );
    const agentFormElement = containerElement?.query(
      By.directive(AgentFormComponent)
    );
    expect(agentFormElement).toBeTruthy();
  });
});

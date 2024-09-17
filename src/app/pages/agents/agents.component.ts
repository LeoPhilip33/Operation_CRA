import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { AgentFormComponent } from '../../components/agent-form/agent-form.component';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [HeaderComponent, AgentFormComponent],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss',
})
export class AgentsComponent {}

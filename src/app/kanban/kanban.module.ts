import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KanbanRoutingModule } from './kanban-routing.module';
import { KanbanComponent } from './kanban.component';
import { MaterialModule } from '../material/material.module';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskComponent } from './task/task.component';

@NgModule({
  declarations: [KanbanComponent, TaskComponent, TaskDialogComponent],
  imports: [CommonModule, KanbanRoutingModule, MaterialModule],
})
export class KanbanModule {}

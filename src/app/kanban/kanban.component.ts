import { Component } from '@angular/core';

import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { Task, TaskDialogResult } from './task.interface';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

const getObservable = (collection: AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject<Task[]>([]);
  collection
    .valueChanges({ idField: 'id' })
    .subscribe((val: Task[]) => subject.next(val));
  collection.valueChanges({ idField: 'id' }).subscribe({
    next: (val: Task[]) => subject.next(val),
  });
  return subject;
};
@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
})
export class KanbanComponent {
  // todo: Task[] = [
  //   {
  //     title: 'Buy milk',
  //     description: 'Go to the store and buy milk',
  //   },
  //   {
  //     title: 'Create a Kanban app',
  //     description: 'Using Firebase and Angular create a Kanban app!',
  //   },
  // ];
  // inProgress: Task[] = [];
  // done: Task[] = [];
  todo = getObservable(this.store.collection('todo')) as Observable<Task[]>;
  inProgress = getObservable(this.store.collection('inProgress')) as Observable<
    Task[]
  >;
  done = getObservable(this.store.collection('done')) as Observable<Task[]>;

  constructor(private dialog: MatDialog, private store: AngularFirestore) {}

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        // this.todo.push(result.task);
        this.store.collection('todo').add(result.task);
      });
  }
  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    // dialogRef
    //   .afterClosed()
    //   .subscribe((result: TaskDialogResult | undefined) => {
    //     if (!result) {
    //       return;
    //     }
    //     const dataList = this[list];
    //     const taskIndex = dataList.indexOf(task);
    //     if (result.delete) {
    //       dataList.splice(taskIndex, 1);
    //     } else {
    //       dataList[taskIndex] = task;
    //     }
    //   });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        if (result.delete) {
          this.store.collection(list).doc(task.id).delete();
        } else {
          this.store.collection(list).doc(task.id).update(task);
        }
      });
  }

  // drop(event: CdkDragDrop<Task[]>): void {
  //   if (event.previousContainer === event.container) {
  //     return;
  //   }
  //   if (!event.container.data || !event.previousContainer.data) {
  //     return;
  //   }
  //   transferArrayItem(
  //     event.previousContainer.data,
  //     event.container.data,
  //     event.previousIndex,
  //     event.currentIndex
  //   );
  // }
  drop(event: CdkDragDrop<Task[] | null>): void {
    if (!!event.previousContainer.data && !!event.container.data) {
      if (event.previousContainer === event.container) {
        return;
      }
      const item = event.previousContainer.data[event.previousIndex];
      this.store.firestore.runTransaction(() => {
        const promise = Promise.all([
          this.store
            .collection(event.previousContainer.id)
            .doc(item.id)
            .delete(),
          this.store.collection(event.container.id).add(item),
        ]);
        return promise;
      });
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}

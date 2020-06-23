import { Component } from '@angular/core';
import {
  TodoItemsClient, CreateTodoItemCommand, TodoItemDto, UpdateTodoItemCommand,
  TodosVm, TodoListsClient, TodoListDto, CreateTodoListCommand, UpdateTodoListCommand,
  UpdateTodoItemDetailCommand
} from 'src/app/_api/api-client';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent {

  debug = false;

  vm: TodosVm;

  selectedList: TodoListDto;
  selectedItem: TodoItemDto;

  newListEditor: any = {};
  listOptionsEditor: any = {};
  itemDetailsEditor: any = {};

  newListIsOpen = false;
  listOptionsIsOpen = false;
  itemDetailIsOpen = false;
  listDeleteIsOpen = false;

  constructor(private listsClient: TodoListsClient, private itemsClient: TodoItemsClient) {
    listsClient.get().subscribe(
      result => {
        this.vm = result;
        if (this.vm.lists.length) {
          this.selectedList = this.vm.lists[0];
        }
      },
      error => console.error(error)
    );
  }

  // Lists

  remainingItems(list: TodoListDto): number {
    return list.items.filter(t => !t.done).length;
  }

  // show new list creation form
  showNewList(): void {
    setTimeout(() => document.getElementById('title').focus(), 250);

    this.newListIsOpen = true;
    this.itemDetailIsOpen = false;
    this.listOptionsIsOpen = false;
  }

  newListCancelled(): void {
    this.newListIsOpen = false;
    this.newListEditor = {};
  }

  addList(): void {
    const list = TodoListDto.fromJS({
      id: 0,
      title: this.newListEditor.title,
      items: [],
    });

    this.listsClient.create({ title: this.newListEditor.title } as CreateTodoListCommand).subscribe(
      result => {
        list.id = result;
        this.vm.lists.push(list);
        this.selectedList = list;
        this.newListEditor = {};
        this.newListIsOpen = false;
      },
      error => {
        const errors = JSON.parse(error.response);

        if (errors && errors.Title) {
          this.newListEditor.error = errors.Title[0];
        }

        setTimeout(() => document.getElementById('title').focus(), 250);
      }
    );
  }

  // show list update form
  showListOptions() {
    this.listOptionsEditor = {
      id: this.selectedList.id,
      title: this.selectedList.title,
    };
    this.listOptionsIsOpen = true;
    this.itemDetailIsOpen = false;
    this.newListIsOpen = false;
  }

  hideListOptions() {
    this.listOptionsEditor = {};
    this.listOptionsIsOpen = false;
    this.itemDetailIsOpen = false;
    this.newListIsOpen = false;
  }

  updateListOptions() {
    this.listsClient.update(this.selectedList.id, UpdateTodoListCommand.fromJS(this.listOptionsEditor))
      .subscribe(
        () => {
          this.selectedList.title = this.listOptionsEditor.title,
            this.listOptionsEditor = {},
            this.listOptionsIsOpen = false;
        },
        error => console.error(error)
      );
  }

  // Confirm once more before deleting a list
  showDeleteList() {
    this.listDeleteIsOpen = true;
  }

  hideDeleteList() {
    this.listDeleteIsOpen = false;
  }

  deleteListConfirmed(): void {
    this.listsClient.delete(this.selectedList.id).subscribe(
      () => {
        this.vm.lists = this.vm.lists.filter(t => t.id !== this.selectedList.id);
        this.selectedList = this.vm.lists.length ? this.vm.lists[0] : null;
        this.listOptionsIsOpen = false;
        this.listDeleteIsOpen = false;
      },
      error => console.error(error)
    );
  }

  // Items

  showItemDetails(item: TodoItemDto): void {
    this.selectedItem = item;
    this.itemDetailsEditor = {
      ...this.selectedItem
    };
    this.itemDetailIsOpen = true;
    this.newListIsOpen = false;
    this.listOptionsIsOpen = false;
  }

  hideItemDetails() {
    this.itemDetailsEditor = {};
    this.selectedItem = null;
    this.itemDetailIsOpen = false;
  }

  updateItemDetails(): void {
    this.itemsClient.updateItemDetails(this.selectedItem.id, UpdateTodoItemDetailCommand.fromJS(this.itemDetailsEditor))
      .subscribe(
        () => {
          if (this.selectedItem.listId !== this.itemDetailsEditor.listId) {
            this.selectedList.items = this.selectedList.items.filter(i => i.id !== this.selectedItem.id);
            const listIndex = this.vm.lists.findIndex(l => l.id === this.itemDetailsEditor.listId);
            this.selectedItem.listId = this.itemDetailsEditor.listId;
            this.vm.lists[listIndex].items.push(this.selectedItem);
          }

          this.selectedItem.priority = this.itemDetailsEditor.priority;
          this.selectedItem.note = this.itemDetailsEditor.note;
          this.itemDetailsEditor = {};
          this.itemDetailIsOpen = false;
        },
        error => console.error(error)
      );
  }

  addItem() {
    const item = TodoItemDto.fromJS({
      id: 0,
      listId: this.selectedList.id,
      priority: this.vm.priorityLevels[0].value,
      title: '',
      done: false
    });

    this.selectedList.items.push(item);
    const index = this.selectedList.items.length - 1;
    this.editItem(item, 'itemTitle' + index);
  }

  // show item input field upon clicking a list item
  editItem(item: TodoItemDto, inputId: string): void {
    this.selectedItem = item;
    setTimeout(() => document.getElementById(inputId).focus(), 100);
  }

  // update item upon release Enter key on input field
  updateItem(item: TodoItemDto, pressedEnter: boolean = false): void {
    const isNewItem = item.id === 0;

    if (!item.title.trim()) {
      this.deleteItem(item);
      return;
    }

    if (item.id === 0) {
      this.itemsClient.create(CreateTodoItemCommand.fromJS({ ...item, listId: this.selectedList.id }))
        .subscribe(
          result => {
            item.id = result;
          },
          error => console.error(error)
        );
    } else {
      this.itemsClient.update(item.id, UpdateTodoItemCommand.fromJS(item))
        .subscribe(
          () => console.log('Update succeeded.'),
          error => console.error(error)
        );
    }

    this.selectedItem = null;

    if (isNewItem && pressedEnter) {
      this.addItem();
    }
  }

  // Delete item
  deleteItem(item: TodoItemDto) {
    if (item.id === 0) {
      const itemIndex = this.selectedList.items.indexOf(this.selectedItem);
      this.selectedList.items.splice(itemIndex, 1);
    } else {
      this.itemsClient.delete(item.id).subscribe(
        () => this.selectedList.items = this.selectedList.items.filter(t => t.id !== item.id),
        error => console.error(error)
      );
    }

    this.itemDetailIsOpen = false;
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { TodoList } from './components/todo-list/todo-list';
import { Cookie } from './cookie/cookie';

@Component({
  selector: 'app-root',
  imports: [FormsModule, Header, Footer, TodoList, Cookie],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

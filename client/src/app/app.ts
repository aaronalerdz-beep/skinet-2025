import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { Chatbot } from "./features/chat/chatbot/chatbot";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Chatbot],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  
  protected readonly title = 'client';

}

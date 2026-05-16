import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from "@angular/material/icon";
import { Signalr } from '../../../core/services/signalr';

@Component({
  selector: 'app-chatbot',
  imports: [
    MatIcon,
    FormsModule
],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
})
export class Chatbot {
  private signalrService = inject(Signalr);
  isOpen = false;
  currentMessage = '';
  messages = this.signalrService.chatMessages;

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.signalrService.createChatConnection();
    }
  }

  async sendMessage() {
    if (this.currentMessage.trim()) {
      const msg = this.currentMessage;
      this.currentMessage = ''; // Limpieza rápida (UX)
      
      // Llamamos al servicio para enviar al Hub de .NET
      await this.signalrService.sendToBot(msg);
    }
  }
}

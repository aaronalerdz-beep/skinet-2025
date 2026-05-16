import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { OrderM } from '../../shared/Models/order';
import { ChatMessage } from '../../shared/Models/chatMessage';

@Injectable({
  providedIn: 'root',
})
export class Signalr {
  hubUrl = environment.hubUrl;
  chatHubUrl = environment.chatHubUrl;
  hubConnection?: HubConnection;
  chatConnection?: HubConnection;
  orderSignal = signal<OrderM | null>(null);
  chatMessages = signal<ChatMessage[]>([]);


  createHubConnection(){
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl, {
      withCredentials: true
    }).withAutomaticReconnect().build();

    this.hubConnection.start().catch(error=> console.log(error));

    this.hubConnection.on('OrderCompleteNotification', (order: OrderM) =>{
      this.orderSignal.set(order)
    });
  }
  createChatConnection() {
    if (this.chatConnection?.state === HubConnectionState.Connected) return;
    this.chatConnection = new HubConnectionBuilder()
      .withUrl(this.chatHubUrl)
      .withAutomaticReconnect()
      .build();
      
    this.chatConnection.start().catch(error=> console.log(error));

    this.chatConnection.on('ChatBotNotification', (role: string, text: string)=>{
      this.chatMessages.update(prev => [...prev, {role, text}]);
    });
  }
  async sendToBot(message: string) {
    if (this.chatConnection?.state === HubConnectionState.Connected) {
      // El Hub espera (string user, string message)
      await this.chatConnection.invoke('SendMessage', 'User', message);
    } else {
      console.warn('chat conecction is not active.');
    }
  }

  stopHubConnection(){
    if(this.hubConnection?.state === HubConnectionState.Connected){
      this.hubConnection.stop().catch(error => console.log(error))
    }
  }
  
}

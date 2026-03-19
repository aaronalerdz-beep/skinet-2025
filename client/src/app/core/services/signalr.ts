import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { OrderM } from '../../shared/Models/order';

@Injectable({
  providedIn: 'root',
})
export class Signalr {
  hubUrl = environment.hubUrl;
  hubConnection?: HubConnection;
  orderSignal = signal<OrderM | null>(null);


  createHubConnection(){
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl, {
      withCredentials: true
    }).withAutomaticReconnect().build();

    this.hubConnection.start().catch(error=> console.log(error));

    this.hubConnection.on('OrderCompleteNotification', (order: OrderM) =>{
      this.orderSignal.set(order)
    });
  }

  stopHubConnection(){
    if(this.hubConnection?.state === HubConnectionState.Connected){
      this.hubConnection.stop().catch(error => console.log(error))
    }
  }
  
}

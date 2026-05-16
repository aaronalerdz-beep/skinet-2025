using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.SignalR;
namespace API.SignalR;

public class ChatHub : Hub
{
 private readonly IChatService _chatService;

    public ChatHub(IChatService chatService)
    {
        _chatService = chatService;
    }

    public async Task SendMessage(string user, string message)
    {
        
        var userMsg = new ChatMessage
        {
            Role = "User",
            Text = message,
            CreatedAt = DateTime.Now
        };
        // 2. (Opcional) Aquí podrías obtener el historial de la base de datos
        // var history = await _context.ChatMessages.OrderByDescending(x => x.CreatedAt).Take(10).ToListAsync();
        var history = new List<ChatMessage> { userMsg }; 

        // 3. Enviamos confirmación visual al frontend
        await Clients.Caller.SendAsync("ChatBotNotification", userMsg.Role, userMsg.Text);

        // 4. Llamamos a la IA pasando el mensaje y el historial
        var responseText = await _chatService.GetAiResponseAsync(message, history);
        
        // 3. Enviamos la respuesta de la IA
        await Clients.Caller.SendAsync("ChatBotNotification", "Asistente AI", responseText);
    }
}
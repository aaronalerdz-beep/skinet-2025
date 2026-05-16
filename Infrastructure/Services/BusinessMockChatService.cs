using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class BusinessMockChatService : IChatService
{
    private readonly StoreContext _context; // Tu conexión a la BD

    public BusinessMockChatService(StoreContext context)
    {
        _context = context;
    }

    public async Task<string> GetAiResponseAsync(string userMessage, List<ChatMessage> history)
    {
        // Prueba de negocio: buscar un producto por nombre
            var producto = await _context.Products
            .FirstOrDefaultAsync(p => p.Name.Contains(userMessage.Trim()));
        if (producto != null)
        {
            return $"Tengo el producto '{producto.Name}' en existencia. El precio es de ${producto.Price}. ¿Te gustaría agregarlo al carrito?";
        }

        return "Lo siento, no encontré ese producto, pero puedo ayudarte con nuestra lista de categorías.";
    }

    public async IAsyncEnumerable<string> GetAiResponseStreamAsync(string userMessage, List<ChatMessage> history)
    {
        // Aquí simulamos el efecto de escritura profesional
        var respuesta = await GetAiResponseAsync(userMessage, history);
        foreach (var palabra in respuesta.Split(' '))
        {
            await Task.Delay(100); // Pequeña pausa para que se vea real
            yield return palabra + " ";
        }
    }
}
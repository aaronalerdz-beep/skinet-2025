using Core.Entities;
namespace Core.Interfaces
{    
    public interface IChatService
    {
            Task<string> GetAiResponseAsync(string userMessage, List<ChatMessage> history);

            IAsyncEnumerable<string> GetAiResponseStreamAsync(string userMessage, List<ChatMessage> history);
    }
}
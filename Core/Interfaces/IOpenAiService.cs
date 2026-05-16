
namespace Core.Interfaces;
public interface IOpenAiService
{
    Task<string> GetCompletion(string systemPrompt, string userMessage);
}
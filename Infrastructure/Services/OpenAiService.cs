using OpenAI.Chat;

using Core.Interfaces;
using Microsoft.Extensions.Configuration;
public class OpenAiService : IOpenAiService
{
    private readonly ChatClient _client;

    public OpenAiService(IConfiguration config)
    {
        var apiKey = config["OpenAISettings:ApiKey"];
        _client = new ChatClient(model: "gpt-4o-mini", apiKey: apiKey);
    }

    public async Task<string> GetCompletion(string systemPrompt, string userMessage)
    {
        ChatCompletion completion = await _client.CompleteChatAsync(new ChatMessage[]
        {
            new SystemChatMessage(systemPrompt),
            new UserChatMessage(userMessage)
        });

        return completion.Content[0].Text;
    }
}
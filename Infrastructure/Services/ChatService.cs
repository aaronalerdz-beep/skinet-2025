using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class ChatService : IChatService
{
    private readonly StoreContext _context; 
    private readonly IOpenAiService _openAiService;
    private readonly string responsePrompt = """
    You are a friendly and professional e-commerce assistant. 
    I will provide you with the user's question and the data found in our database.
    
    Rules:
    1. Use the database info to answer the user's request naturally.
    2. Be concise and friendly.
    3. If the user asks for a product and it's out of stock, offer to look for something else.
    4. If the user greets you, greet them back and ask how you can help.
    5. Always mention the price and availability if the data is provided.
    6. Keep the answer short (maximum 2 sentences).
    """;

    private readonly string systemPrompt = """
    You are an expert intent classification assistant for an e-commerce store.
    Your task is to convert the user's message into a strict JSON object.
    
    JSON Schema:
    {
      "Action": "search" | "contact" | "none",
      "Term": "product name or empty",
      "Trust": 0.0 to 1.0
    }

    Rules:
    1. Use 'search' if the user asks about availability, price, stock, or specific items.
    2. Use 'contact' if the user wants to talk to a human, needs support, or requests contact info.
    3. Use 'none' if the user greets you or says something irrelevant.
    4. Correct spelling errors in the 'term' field (e.g., 'motinor' -> 'monitor').
    5. Return ONLY the JSON object. Do not include markdown blocks or explanations.
    
    Example Output:
    { "Action": "search", "Term": "Blue Code Gloves", "Trust": 0.9 }
    """;

    public ChatService(StoreContext context, IOpenAiService openAiService)
    {
        _context = context;
        _openAiService = openAiService;
    }

    public async Task<string> GetAiResponseAsync(string userMessage, List<ChatMessage> history)
    {
        if (string.IsNullOrWhiteSpace(userMessage))
            return "Hi! How can I help you today?";

        var analysis = await AnalysisIntent(userMessage);
        return await CaseMessage(analysis, userMessage);
    }

    public async IAsyncEnumerable<string> GetAiResponseStreamAsync(string userMessage, List<ChatMessage> history)
    {
        var respuesta = await GetAiResponseAsync(userMessage, history);
        foreach (var palabra in respuesta.Split(' '))
        {
            await Task.Delay(100); 
            yield return palabra + " ";
        }
    }

    public async Task<string> CaseMessage(IntentRequest analysis, string userMessage)
    {
        // Declaramos la variable localmente dentro del método para evitar conflictos
        string textresp = string.Empty;

        switch (analysis.Action.ToLower())
        {
            case "search":
                // Aseguramos que Term no sea nulo antes de hacer Trim
                string searchTerm = analysis.Term?.Trim() ?? string.Empty;

                var product = await _context.Products
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.Name.Contains(analysis.Term.Trim()));;

                if (product != null)
                {
                    if (product.QuantityInStock > 0)
                    {
                        textresp = $"Product Name: '{product.Name}' | Stock Status: In Stock | Price: ${product.Price} | Quantity Available: {product.QuantityInStock}. Client Message: {userMessage}";      
                        return await _openAiService.GetCompletion(responsePrompt, textresp);
                    }
                    else
                    {
                        textresp = $"Product Name: '{product.Name}' | Stock Status: Out of Stock. Client Message: {userMessage}";
                        return await _openAiService.GetCompletion(responsePrompt, textresp);
                    }
                }

                textresp = $"Product context: I couldn't find any products related to '{analysis.Term}'. Client Message: {userMessage}";
                return await _openAiService.GetCompletion(responsePrompt, textresp);

            case "contact":
                textresp = $"Store contact info: support@store.com or phone +123456789. Client Message: {userMessage}";
                return await _openAiService.GetCompletion(responsePrompt, textresp);

            case "none":
            default:
                textresp = $"Context: The user is greeting or saying something unrelated to products/contact. Client Message: {userMessage}";
                return await _openAiService.GetCompletion(responsePrompt, textresp);
        }
    }

    public async Task<IntentRequest> AnalysisIntent(string userMessage)
    {
        if (string.IsNullOrWhiteSpace(userMessage))
            return new IntentRequest();

        string aiResponse = await _openAiService.GetCompletion(systemPrompt, userMessage);

        try
        {
            // Sanitización: Si OpenAI de todas formas añade bloques de código markdown ```json, los limpiamos
            if (aiResponse.Contains("```"))
            {
                aiResponse = aiResponse
                    .Replace("```json", "")
                    .Replace("```", "")
                    .Trim();
            }

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var json = JsonSerializer.Deserialize<IntentRequest>(aiResponse, options);

            if (json != null)
            {
                json.Action = json.Action?.ToLower().Trim() ?? "none";
                json.Term ??= string.Empty;
                return json;
            }
        }
        catch (JsonException ex)
        {
            Console.WriteLine($"Error parsing JSON from AI: {ex.Message}. Raw response was: {aiResponse}");
        }

        return new IntentRequest { Action = "none", Term = string.Empty }; 
    }
}
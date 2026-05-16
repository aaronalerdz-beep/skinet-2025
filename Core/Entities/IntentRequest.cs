namespace Core.Entities;

public class IntentRequest
{
    public string Action { get; set; } = "none";
    public string Term { get; set; } = string.Empty;
    public double Trust { get; set; }
}
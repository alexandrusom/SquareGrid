using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text.Json;
using System;

[ApiController]
[Route("api/[controller]")]
public class SavePositionController : ControllerBase
{
    private readonly string _filePath = Path.Combine(Directory.GetCurrentDirectory(), "gridData.json");

    [HttpPost]
    public IActionResult SaveGrid([FromBody] object gridData)
    {
        Console.WriteLine("Received grid data for saving.");
        Console.WriteLine(JsonSerializer.Serialize(gridData, new JsonSerializerOptions { WriteIndented = true }));

        try
        {
            // Serialize the grid data to JSON and save it to a file
            var json = JsonSerializer.Serialize(gridData, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(_filePath, json);

            return Ok(new { message = "Grid saved successfully!" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while saving the grid.", error = ex.Message });
        }
    }

    [HttpGet]
    public IActionResult LoadGrid()
    {
        try
        {
            if (!System.IO.File.Exists(_filePath))
            {
                return NotFound(new { message = "No saved grid data found." });
            }

            // Read the JSON file and deserialize it into an object
            var json = System.IO.File.ReadAllText(_filePath);
            var gridData = JsonSerializer.Deserialize<object>(json);

            return Ok(gridData);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while loading the grid.", error = ex.Message });
        }
    }
}
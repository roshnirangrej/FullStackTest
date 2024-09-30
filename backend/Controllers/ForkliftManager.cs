using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using Newtonsoft.Json;  // for JSON parsing
using CsvHelper;      // for CSV parsing
using CsvHelper.Configuration;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForkliftsController : ControllerBase
    {
  
        //Forklift Age Manager model
        public class Forklift
        {
            public required string Name { get; set; }
            [JsonProperty("Model Number")]
            public required string ModelNumber { get; set; }
            [JsonProperty("Manufacturing Date")]
            public required string ManufacturingDate { get; set; }
            public int Age { get; set; }  
        }

        public class ForkliftMap : ClassMap<Forklift>
{
    public ForkliftMap()
    {
        Map(m => m.Name).Name("Name");
        Map(m => m.ModelNumber).Name("Model Number");
        Map(m => m.ManufacturingDate).Name("Manufacturing Date");
    }
}

        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            
            //Console.WriteLine("File upload endpoint hit!"); 
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            // Get file extension
            var extension = Path.GetExtension(file.FileName).ToLower();
            List<Forklift> forklifts;

            if (extension == ".json")
            {
                forklifts = await ParseJsonFile(file);
            }
            else if (extension == ".csv")
            {
                forklifts = await ParseCsvFile(file);
            }
            else
            {
                return BadRequest("Unsupported file format. Only .json and .csv are allowed.");
            }

            return Ok(forklifts);

     
        }


        // Parse JSON file
        private async Task<List<Forklift>> ParseJsonFile(IFormFile file)
        {
            using (var streamReader = new StreamReader(file.OpenReadStream()))
            {
                var jsonString = await streamReader.ReadToEndAsync();
        
                var forklifts = JsonConvert.DeserializeObject<List<Forklift>>(jsonString);

               
                forklifts.ForEach(f => f.Age = CalculateForkliftAge(f.ManufacturingDate));
                return forklifts;
            }
        }

        //Parse CSV file
        private async Task<List<Forklift>> ParseCsvFile(IFormFile file)
        {
            using (var reader = new StreamReader(file.OpenReadStream()))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                csv.Context.RegisterClassMap<ForkliftMap>();
                var forklifts = csv.GetRecords<Forklift>().ToList();

              
                forklifts.ForEach(f => f.Age = CalculateForkliftAge(f.ManufacturingDate));
                return forklifts;
            }
        }

                
        private int CalculateForkliftAge(string manufacturingDate)
        {
            if (DateTime.TryParse(manufacturingDate, out var manufactureDate))
            {
                var today = DateTime.Today;
                var age = today.Year - manufactureDate.Year;
                if (manufactureDate.Date > today.AddYears(-age)) age--;
                return age;
            }
            return 0; 
        }

        /*forklift tracking and obstacle detection on canvas
        
         NOTE: Exercise 2,3,4 through server side implementation and HTML canvas. 
         
         For better visualisation use greater movement values like Obstcale: (40,50) Command:  F50R90F40 */
        public class ForkliftRequest
    {
        public string Commands { get; set; }  
        public List<Obstacle> Obstacles { get; set; }  
    }

    public class Obstacle
    {
        public int X { get; set; } 
        public int Y { get; set; }  
    }

        public class ParsedCommand
    {
        public char Action { get; set; }
        public int Value { get; set; }
    }

         [HttpPost("canvas")]
        public IActionResult MoveForklift([FromBody] ForkliftRequest request)
        {
            string commands = request.Commands;
            List<Obstacle> obstacles = request.Obstacles;

            

            var result = commandprocessing(commands,obstacles);
            Console.WriteLine("Output of main function: {0}",result);
            return Ok(result);

        }

        private object commandprocessing(string commands,List<Obstacle>obstacles){

            int tempX =0;
            int tempY=0;
            int tempDirection = 0;


            List<string> commandLog = new List<string>();
            bool obstacleEncountered = false;

            var parsedCommands = ParseCommands(commands);
            List<object> positionHistory = new List<object>();

            foreach (var command in parsedCommands)
            {
                if (obstacleEncountered) break; 

                int targetX = tempX;
                int targetY = tempY;

                switch (command.Action)
                {
                    case 'F':
                     
                        (targetX, targetY) = MoveForward(tempDirection, targetX, targetY, command.Value);
                        commandLog.Add($"Move Forward by {command.Value} meters.");
                        break;

                    case 'B':
                      
                        (targetX, targetY) = MoveBackward(tempDirection, targetX, targetY, command.Value);
                        commandLog.Add($"Move Backward by {command.Value} meters.");
                        break;

                    case 'L':
                        tempDirection = (tempDirection - command.Value + 360) % 360; 
                        commandLog.Add($"Turn Left by {command.Value} degrees.");
                        break;

                    case 'R':
                        tempDirection = (tempDirection + command.Value) % 360; 
                        commandLog.Add($"Turn Right by {command.Value} degrees.");
                        break;

                    default:
                        continue; 
                }
                       
        tempX = targetX;
        tempY = targetY;

        positionHistory.Add(new
        {
            X = tempX,
            Y = tempY,
            Direction = tempDirection
        });

               
                if (command.Action == 'F' || command.Action == 'B')
                {
                    if (CheckForObstacle(targetX, targetY, obstacles))
                    {
                        obstacleEncountered = true;
                        commandLog.Add($"Error: Obstacle encountered at ({targetX}, {targetY}).");
                    }
       
                }

            }

            return new
            {
                PositionHistory = positionHistory,
                CommandsReceived = commands,
                Log = commandLog
            };
            
        }
        private List<ParsedCommand> ParseCommands(string cmds)
        {
            var parsedCommands = new List<ParsedCommand>();
            cmds = cmds.ToUpper();
            int i = 0;

            while (i < cmds.Length)
            {
                char action = cmds[i];
                if ("FBLR".Contains(action))
                {
                    i++;
                    string valueStr = string.Empty;

                    while (i < cmds.Length && char.IsDigit(cmds[i]))
                    {
                        valueStr += cmds[i];
                        i++;
                    }

                    if (int.TryParse(valueStr, out int value))
                    {
                        parsedCommands.Add(new ParsedCommand { Action = action, Value = value });
                    }
                }
                else
                {
                    i++;
                }
            }

            return parsedCommands;
        }

          private (int targetX, int targetY) MoveForward(int direction, int x, int y, int value)
        {
            switch (direction)
            {
                case 0: // North
                    y += value;
                    break;
                case 90: // East
                    x += value;
                    break;
                case 180: // South
                    y -= value;
                    break;
                case 270: // West
                    x -= value;
                    break;
            }
            return (x, y);
        }

        private (int targetX, int targetY) MoveBackward(int direction, int x, int y, int value)
        {
            switch (direction)
            {
                case 0: // North
                    y -= value;
                    break;
                case 90: // East
                    x -= value;
                    break;
                case 180: // South
                    y += value;
                    break;
                case 270: // West
                    x += value;
                    break;
            }
            return (x, y);
        }

        private bool CheckForObstacle(int targetX, int targetY, List<Obstacle> obstacles)
        {
            return obstacles.Any(o => o.X == targetX && o.Y == targetY);
        }
    
        

    }
}

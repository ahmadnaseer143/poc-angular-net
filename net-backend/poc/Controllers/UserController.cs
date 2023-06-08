using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


using MySql.Data.MySqlClient;

namespace poc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UserController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private static List<User> users = new List<User>();

        [HttpGet]
        public async Task<ActionResult<List<User>>> Get()
        {
            string query = @"
        SELECT * FROM mydb.users
    ";

            List<User> users = new List<User>();
            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                await mycon.OpenAsync();

                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                {
                    using (MySqlDataReader myReader = (MySqlDataReader)await myCommand.ExecuteReaderAsync())
                    {
                        while (await myReader.ReadAsync())
                        {
                            User user = new User
                            {
                                Id = myReader.GetInt32("Id"),
                                name = myReader.GetString("name"),
                                email = myReader.GetString("email"),
                                mobile = myReader.GetString("mobile")
                            };

                            users.Add(user);
                        }
                    }
                }

                mycon.Close();
            }

            return Ok(users);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(int id)
        {
            string query = @"
        SELECT * FROM mydb.users WHERE Id = @Id
    ";

            User user = null;
            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                await mycon.OpenAsync();

                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@Id", id);

                    using (MySqlDataReader myReader = (MySqlDataReader)await myCommand.ExecuteReaderAsync())
                    {
                        if (await myReader.ReadAsync())
                        {
                            user = new User
                            {
                                Id = myReader.GetInt32("Id"),
                                name = myReader.GetString("name"),
                                email = myReader.GetString("email"),
                                mobile = myReader.GetString("mobile")
                            };
                        }
                    }
                }

                mycon.Close();
            }

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> AddUser(User user)
        {
            string query = @"
        INSERT INTO mydb.users (name, email, mobile)
        VALUES (@name, @email, @mobile)
    ";

            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                await mycon.OpenAsync();

                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@name", user.name);
                    myCommand.Parameters.AddWithValue("@email", user.email);
                    myCommand.Parameters.AddWithValue("@mobile", user.mobile);

                    int rowsAffected = await myCommand.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        user.Id = Convert.ToInt32(myCommand.LastInsertedId);
                        users.Add(user);

                        return Ok(user);
                    }
                    else
                    {
                        return BadRequest("Failed to add user.");
                    }
                }

                mycon.Close();
            }
        }

        
        [HttpPut("{id}")]
        public async Task<ActionResult<User>> UpdateUser(int id, User req)
        {
            string query = @"
        UPDATE mydb.users
        SET name = @name, email = @email, mobile = @mobile
        WHERE Id = @Id
    ";

            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                await mycon.OpenAsync();

                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@name", req.name);
                    myCommand.Parameters.AddWithValue("@email", req.email);
                    myCommand.Parameters.AddWithValue("@mobile", req.mobile);
                    myCommand.Parameters.AddWithValue("@Id", id);

                    int rowsAffected = await myCommand.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        return Ok(req);
                    }
                    else
                    {
                        return BadRequest("Failed to update user.");
                    }
                }
            }
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(int id)
        {
            var user = users.Find(u => u.Id == id);

            if (user == null)
                return NotFound();

            string query = @"
        DELETE FROM mydb.users
        WHERE Id = @Id
    ";

            string sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                await mycon.OpenAsync();

                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@Id", id);

                    int rowsAffected = await myCommand.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        users.Remove(user);

                        return Ok(user);
                    }
                    else
                    {
                        return BadRequest("Failed to delete user.");
                    }
                }

                mycon.Close();
            }
        }

    }
}

 using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DataBank.Models;
using MemeBank.Helpers;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;

namespace DataBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly DataBankContext _context;
        private IConfiguration _configuration;

        public ClassController(DataBankContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Class
        [HttpGet]
        public IEnumerable<ClassItem> GetClassItem()
        {
            return _context.ClassItem;
        }

        // GET: api/Class/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClassItem([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var classItem = await _context.ClassItem.FindAsync(id);

            if (classItem == null)
            {
                return NotFound();
            }

            return Ok(classItem);
        }

        // PUT: api/Class/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClassItem([FromRoute] int id, [FromBody] ClassItem classItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != classItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(classItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Class
        [HttpPost]
        public async Task<IActionResult> PostClassItem([FromBody] ClassItem classItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ClassItem.Add(classItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClassItem", new { id = classItem.Id }, classItem);
        }

        // DELETE: api/Class/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClassItem([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var classItem = await _context.ClassItem.FindAsync(id);
            if (classItem == null)
            {
                return NotFound();
            }

            _context.ClassItem.Remove(classItem);
            await _context.SaveChangesAsync();

            return Ok(classItem);
        }

        private bool ClassItemExists(int id)
        {
            return _context.ClassItem.Any(e => e.Id == id);
        }

        // GET: api/Class/Tags
        //  [Route("tags")]
        //  [HttpGet]
        //  public async Task<List<string>> GetTags()
        //  {
        //      var objects = (from m in _context.ClassItem
        //                     select m.Tags).Distinct();

        //      var returned = await objects.ToListAsync();

        //      return returned;
        //  }

        [Route("tag/{tag}")]
        [HttpGet]
        public async Task<List<ClassItem>> GetClassByTag([FromRoute] String tag)
        {
            var image = (from i in _context.ClassItem
                         where i.Tags.Equals(tag)
                         select i);

            var val = await image.ToListAsync();

            return val;
        }

        [HttpPost, Route("upload")]
        public async Task<IActionResult> UploadFile([FromForm]ClassImageItem obj)
        {
            if (!MultipartRequestHelper.IsMultipartContentType(Request.ContentType))
            {
                return BadRequest($"Expected a multipart request, but got {Request.ContentType}");
            }
            try
            {
                using (var stream = obj.Image.OpenReadStream())
                {
                    var cloudBlock = await UploadToBlob(obj.Image.FileName, null, stream);
                    //// Retrieve the filename of the file you have uploaded
                    //var filename = provider.FileData.FirstOrDefault()?.LocalFileName;
                    if (string.IsNullOrEmpty(cloudBlock.StorageUri.ToString()))
                    {
                        return BadRequest("An error has occured while uploading your file. Please try again.");
                    }

                    ClassItem classItem = new ClassItem();
                    classItem.Title = obj.Title;
                    classItem.Tags = obj.Tags;

                    System.Drawing.Image image = System.Drawing.Image.FromStream(stream);
                    classItem.Height = image.Height.ToString();
                    classItem.Width = image.Width.ToString();
                    classItem.Url = cloudBlock.SnapshotQualifiedUri.AbsoluteUri;
                    classItem.Uploaded = DateTime.Now.ToString();

                    _context.ClassItem.Add(classItem);
                    await _context.SaveChangesAsync();

                    return Ok($"File: {obj.Title} has successfully uploaded");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"An error has occured. Details: {ex.Message}");
            }


        }

        private async Task<CloudBlockBlob> UploadToBlob(string filename, byte[] imageBuffer = null, System.IO.Stream stream = null)
        {

            var accountName = _configuration["AzureBlob:name"];
            var accountKey = _configuration["AzureBlob:key"]; ;
            var storageAccount = new CloudStorageAccount(new StorageCredentials(accountName, accountKey), true);
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            CloudBlobContainer imagesContainer = blobClient.GetContainerReference("images");

            string storageConnectionString = _configuration["AzureBlob:connectionString"];

            // Check whether the connection string can be parsed.
            if (CloudStorageAccount.TryParse(storageConnectionString, out storageAccount))
            {
                try
                {
                    // Generate a new filename for every new blob
                    var fileName = Guid.NewGuid().ToString();
                    fileName += GetFileExtention(filename);

                    // Get a reference to the blob address, then upload the file to the blob.
                    CloudBlockBlob cloudBlockBlob = imagesContainer.GetBlockBlobReference(fileName);

                    if (stream != null)
                    {
                        await cloudBlockBlob.UploadFromStreamAsync(stream);
                    }
                    else
                    {
                        return new CloudBlockBlob(new Uri(""));
                    }

                    return cloudBlockBlob;
                }
                catch (StorageException ex)
                {
                    return new CloudBlockBlob(new Uri(""));
                }
            }
            else
            {
                return new CloudBlockBlob(new Uri(""));
            }

        }

        private string GetFileExtention(string fileName)
        {
            if (!fileName.Contains("."))
                return ""; //no extension
            else
            {
                var extentionList = fileName.Split('.');
                return "." + extentionList.Last(); //assumes last item is the extension 
            }
        }

  
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Momos.Server.DTOs;
using Momos.Server.Entities;
using Momos.Server.Models.Response.Template;
using Momos.Server.Services.FileService.Interface;
using Momos.Server.UnitOfWork.Interface;

namespace Momos.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MomosController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IUnitOfWork _unitOfWork;

        public MomosController(IFileService fileService, IUnitOfWork unitOfWork)
        {
            _fileService = fileService;
            _unitOfWork = unitOfWork;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OperationResponse<Momo>>> Create([FromForm] MomoDto dto)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var momo = new Momo
                    {
                        Name = dto.Name,
                        Description = dto.Description,
                        Price = dto.Price,
                        Tags = dto.Tags != null ? string.Join(',', dto.Tags) : null,
                        ImagePath = dto.Image != null ? await _fileService.SaveImageAsync(dto.Image) : null
                    };
                    _unitOfWork.Momos.Insert(momo);
                    var rowsAffected = await _unitOfWork.CompleteAsync();
                    return CreatedAtAction(nameof(GetById), new { id = momo.Id }, new OperationResponse<Momo>(true, "Created successfully", rowsAffected, momo));
                }
                else
                {
                    return BadRequest(new OperationResponse<Momo>(false, "Failed to create", 0, null).AddValidationError(ModelState));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new OperationResponse<Momo>(false, $"Exception: {ex.Message}", 0, null));
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<QueryResponse<List<Momo>>>> GetAll([FromQuery] string? tags)
        {
            try
            {
                var momos = _unitOfWork.Momos.Set().AsQueryable();
                if (!string.IsNullOrWhiteSpace(tags))
                {
                    var tagList = tags.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                    foreach (var tag in tagList)
                    {
                        var pattern1 = $"{tag},%";
                        var pattern2 = $"%,{tag},%";
                        var pattern3 = $"%,{tag}";
                        var pattern4 = tag;

                        momos = momos.Where(m => m.Tags != null &&
                            (EF.Functions.Like(m.Tags, pattern1) ||
                             EF.Functions.Like(m.Tags, pattern2) ||
                             EF.Functions.Like(m.Tags, pattern3) ||
                             m.Tags == pattern4));
                    }
                }
                return Ok(new QueryResponse<List<Momo>>(true, "Fetched successfully", await momos.ToListAsync()));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new QueryResponse<List<Momo>>(false, $"Exception: {ex.Message}", null));
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<QueryResponse<Momo>>> GetById(int id)
        {
            try
            {
                var momo = await _unitOfWork.Momos.FindAsync(id);
                if (momo == null) return NotFound(new QueryResponse<Momo>(false, "Not found", null));
                return Ok(new QueryResponse<Momo>(true, "Fetched successfully", momo));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new QueryResponse<Momo>(false, $"Exception: {ex.Message}", null));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OperationResponse<Momo>>> Update(int id, [FromForm] MomoDto dto)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var momo = await _unitOfWork.Momos.FindAsync(id);
                    if (momo == null) return NotFound(new OperationResponse<Momo>(false, "Not found", 0, null));
                    momo.Name = dto.Name;
                    momo.Description = dto.Description;
                    momo.Price = dto.Price;
                    momo.Tags = dto.Tags != null ? string.Join(',', dto.Tags) : null;
                    if (dto.Image != null && dto.Image.Length > 0)
                    {
                        if (!string.IsNullOrWhiteSpace(momo.ImagePath))
                        {
                            await _fileService.DeleteImageAsync(momo.ImagePath);
                        }
                        momo.ImagePath = await _fileService.SaveImageAsync(dto.Image);
                    }
                    var rowsAffected = await _unitOfWork.CompleteAsync();
                    return Ok(new OperationResponse<Momo>(true, "Updated successfully", rowsAffected, momo));
                }
                else
                {
                    return BadRequest(new OperationResponse<Momo>(false, "Failed to update", 0, null).AddValidationError(ModelState));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new OperationResponse<Momo>(false, $"Exception: {ex.Message}", 0, null));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OperationResponse<int>>> Delete(int id)
        {
            try
            {
                var momo = await _unitOfWork.Momos.FindAsync(id);
                if (momo == null) return NotFound(new OperationResponse<int>(false, "Not found", 0, default));
                if (!string.IsNullOrWhiteSpace(momo.ImagePath))
                    await _fileService.DeleteImageAsync(momo.ImagePath);
                _unitOfWork.Momos.Delete(momo);
                var rowsAffected = await _unitOfWork.CompleteAsync();
                return BadRequest(new OperationResponse<int>(true, "Deleted sucessfully", rowsAffected, id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new OperationResponse<int>(false, $"Exception: {ex.Message}", 0, default));
            }
        }
    }
}
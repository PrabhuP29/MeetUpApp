using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        public AdminController(UserManager<AppUser> userManager, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUserWithRoles()
        {
            var users = await _userManager.Users
                .Include(r => r.UserRoles)
                .ThenInclude(r => r.Role)
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    Username = u.UserName,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();

            return Ok(users);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            var selectedRoles = roles.Split(",").ToArray();

            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("User not found");

            var userRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) BadRequest("Failed to remove from roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModeration()
        {
            return Ok("Admins or Moderators can do this");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("photos-to-approve")]
        public async Task<ActionResult> GetPhotosForApproval()
        {
            return Ok(await _unitOfWork.PhotoRepository.GetUnapprovedPhotos());
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("approve-photo")]
        public async Task<ActionResult> ApprovePhoto(PhotoForApprovalDto photo){
            Photo ph = await _unitOfWork.PhotoRepository.GetPhotoById(photo.Id);
            if (ph == null) return NotFound("Photo not found");
            ph.IsApproved = photo.IsApproved;
            MemberDto user = await _unitOfWork.UserRepository.GetUserByPhotoIDAsync(photo.Id);
            if (user == null) return NotFound("User not found");
            if(string.IsNullOrEmpty(user.PhotoUrl))
            {
                ph.IsMain = true;
            }

            _unitOfWork.PhotoRepository.Update(ph);
            if(await  _unitOfWork.Complete()){
                return NoContent();
            }

            return BadRequest("Error while approving photo!");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("reject-photo")]
        public async Task<ActionResult> RejectPhoto(PhotoForApprovalDto photo){
            Photo ph = await _unitOfWork.PhotoRepository.GetPhotoById(photo.Id);
            if (ph == null) return NotFound("Photo not found");

            _unitOfWork.PhotoRepository.Remove(ph);
            if(await  _unitOfWork.Complete()){
                return NoContent();
            }

            return BadRequest("Error while rejecting photo!");
        }

    }
}
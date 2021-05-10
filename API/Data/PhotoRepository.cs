using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public PhotoRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<Photo> GetPhotoById(int id)
        {
            return await _context.Photos
                            .IgnoreQueryFilters()
                            .Where(p => p.Id == id)
                            .FirstOrDefaultAsync();
                            // .ProjectTo<PhotoForApprovalDto>(_mapper.ConfigurationProvider)
                            // .AsQueryable();
            
            // return await query.FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos()
        {
            var query = _context.Photos
                            .IgnoreQueryFilters()
                            .Where(p => !p.IsApproved)
                            .ProjectTo<PhotoForApprovalDto>(_mapper.ConfigurationProvider)
                            .AsQueryable();
            
            return await query.ToListAsync();
        }

        public void Remove(Photo photo)
        {
            //Photo pToRemove = _context.Photos.Where(p => p.Id == photo.Id).FirstOrDefault();
            _context.Photos.Remove(photo);
        }

        public void Update(Photo photo)
        {
            _context.Entry(photo).State = EntityState.Modified;
        }
    }
}
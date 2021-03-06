using System.Threading.Tasks;
using API.Interfaces;
using AutoMapper;

namespace API.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UnitOfWork(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        IPhotoRepository IUnitOfWork.PhotoRepository =>  new PhotoRepository(_context, _mapper);

        IUserRepository IUnitOfWork.UserRepository => new UserRepository(_context, _mapper);

        IMessageRepository IUnitOfWork.MessageRepository => new MessageRepository(_context, _mapper);

        ILikesRepository IUnitOfWork.LikesRepository => new LikesRepository(_context);

        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return _context.ChangeTracker.HasChanges();
        }
    }
}
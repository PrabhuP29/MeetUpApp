using System;
using System.Linq;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Photo, PhotoDto>();
            CreateMap<AppUser, MemberDto>()
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => 
                src.Photos.FirstOrDefault(x=>x.IsMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.SenderPhotoUrl, 
                    opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(x=>x.IsMain).Url))
                .ForMember(dest => dest.RecipientPhotoUrl,
                    opt => opt.MapFrom(src => src.Recipient.Photos.FirstOrDefault(x=>x.IsMain).Url));
            //UTC converted applied on builder in the datacontext class, no need of this now
            //CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
            CreateMap<Photo, PhotoForApprovalDto>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => 
                src.AppUser.UserName));
        }
    }
}
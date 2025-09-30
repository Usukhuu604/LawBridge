import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetLawyerByIdQuery } from "@/generated";
import { Star, Mail, FileText, GraduationCap, Shield } from "lucide-react";

interface LawyerInfoProps {
  lawyerId: string;
  showDetails?: boolean;
  className?: string;
}

const LawyerInfo: React.FC<LawyerInfoProps> = ({
  lawyerId,
  showDetails = false,
  className = "",
}) => {
  const {
    data: lawyerData,
    loading,
    error,
  } = useGetLawyerByIdQuery({
    variables: { lawyerId },
    skip: !lawyerId,
  });

  if (loading) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
      </div>
    );
  }

  if (error || !lawyerData?.getLawyerById) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-gray-200 text-gray-600">
            ?
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-gray-600">Өмгөөлөгч олдсонгүй</p>
          <p className="text-sm text-gray-500">ID: {lawyerId}</p>
        </div>
      </div>
    );
  }

  const lawyer = lawyerData.getLawyerById;

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={
              lawyer.profilePicture
                ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${lawyer.profilePicture}`
                : undefined
            }
            alt={`${lawyer.firstName} ${lawyer.lastName}`}
          />
          <AvatarFallback className="bg-primary-custom text-white">
            {`${lawyer.firstName[0]}${lawyer.lastName[0]}`}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">
            {lawyer.firstName} {lawyer.lastName}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{lawyer.rating}/5</span>
            {lawyer.specialization && lawyer.specialization.length > 0 && (
              <>
                <span>•</span>
                <span>{lawyer.specialization[0].categoryName}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-start space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={
              lawyer.profilePicture
                ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${lawyer.profilePicture}`
                : undefined
            }
            alt={`${lawyer.firstName} ${lawyer.lastName}`}
          />
          <AvatarFallback className="bg-primary-custom text-white text-lg">
            {`${lawyer.firstName[0]}${lawyer.lastName[0]}`}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {lawyer.firstName} {lawyer.lastName}
            </h3>
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 border-green-200"
            >
              {lawyer.status}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>{lawyer.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Лиценз: {lawyer.licenseNumber}</span>
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span>{lawyer.university}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Үнэлгээ: {lawyer.rating}/5</span>
            </div>
            {lawyer.specialization && lawyer.specialization.length > 0 && (
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>{lawyer.specialization[0].categoryName}</span>
              </div>
            )}
          </div>

          {lawyer.bio && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">{lawyer.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyerInfo;

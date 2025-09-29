"use client";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  User,
  Mail,
  Award,
  GraduationCap,
  FileText,
  Star,
  Calendar,
  Badge,
  Eye,
  EyeOff,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Building,
} from "lucide-react";

interface Achievement {
  _id: string;
  title: string;
  description?: string;
}

interface Lawyer {
  _id: string;
  lawyerId: string;
  clerkUserId?: string;
  clientId?: string;
  firstName: string;
  lastName: string;
  email: string;
  licenseNumber: string;
  bio?: string;
  university?: string;
  achievements: Achievement[];
  status: string;
  document?: string;
  rating?: number;
  profilePicture?: string;
  createdAt: string;
  updatedAt?: string;
}

const GET_PENDING_LAWYERS = gql`
  query GetPendingLawyers {
    getLawyersByStatus(status: PENDING) {
      _id
      lawyerId
      clerkUserId
      clientId
      firstName
      lastName
      email
      licenseNumber
      bio
      university
      achievements {
        _id
        title
        description
      }
      status
      document
      rating
      profilePicture
      createdAt
      updatedAt
    }
  }
`;

const MANAGE_LAWYER_REQUEST = gql`
  mutation ManageLawyerRequest($lawyerId: ID!, $status: LawyerRequestStatus!) {
    manageLawyerRequest(input: { lawyerId: $lawyerId, status: $status }) {
      _id
      status
    }
  }
`;

export default function LawyerApprovalDashboard() {
  const { data, loading, error, refetch } = useQuery(GET_PENDING_LAWYERS);
  const [manageLawyerRequest, { loading: updating }] = useMutation(
    MANAGE_LAWYER_REQUEST
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleUpdateStatus = async (
    lawyerId: string,
    status: "VERIFIED" | "REJECTED"
  ) => {
    setProcessingId(lawyerId);
    try {
      await manageLawyerRequest({ variables: { lawyerId, status } });
      refetch();
      // Show success notification (you can integrate with a toast library)
      console.log(`Lawyer ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Error updating lawyer status:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const toggleDetails = (lawyerId: string) => {
    setShowDetails((prev) => ({
      ...prev,
      [lawyerId]: !prev[lawyerId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 font-medium">
            Loading lawyer requests...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Error Loading Requests
          </h2>
          <p className="text-red-600 mb-4">{error.message}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const lawyers: Lawyer[] = data?.getLawyersByStatus || [];
  const filteredLawyers = lawyers.filter(
    (lawyer) =>
      `${lawyer.firstName} ${lawyer.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lawyer.university || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen ">
      <div className="max-w-9xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-10 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Lawyer Verification Dashboard
              </h1>
              <p className="text-slate-600 text-lg">
                Review and manage pending lawyer applications
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Pending Requests
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {lawyers.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or university..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lawyers List */}
        {filteredLawyers.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 max-w-md mx-auto">
              <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No Pending Requests
              </h3>
              <p className="text-slate-500">
                {searchTerm
                  ? "No lawyers match your search criteria."
                  : "All caught up! No pending lawyer requests at the moment."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredLawyers.map((lawyer) => (
              <div
                key={lawyer._id}
                className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Main Card Content */}
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Profile Picture */}
                    <div className="relative">
                      <img
                        src={lawyer.profilePicture || "/api/placeholder/80/80"}
                        alt={`${lawyer.firstName} ${lawyer.lastName}`}
                        className="w-20 h-20 rounded-xl object-cover border-2 border-slate-200 shadow-md"
                      />
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        PENDING
                      </div>
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">
                          {lawyer.firstName} {lawyer.lastName}
                        </h3>
                        <div className="flex items-center gap-4 text-slate-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">{lawyer.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge className="h-4 w-4" />
                            <span className="text-sm font-mono">
                              {lawyer.licenseNumber}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Key Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-xs text-slate-500 font-medium">
                              Education
                            </p>
                            <p className="text-sm font-semibold text-slate-700">
                              {lawyer.university}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <div>
                            <p className="text-xs text-slate-500 font-medium">
                              Rating
                            </p>
                            <p className="text-sm font-semibold text-slate-700">
                              {lawyer.rating || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                          <Calendar className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-xs text-slate-500 font-medium">
                              Applied
                            </p>
                            <p className="text-sm font-semibold text-slate-700">
                              {new Date(lawyer.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bio Preview */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {lawyer.bio
                            ? lawyer.bio.length > 120
                              ? `${lawyer.bio.substring(0, 120)}...`
                              : lawyer.bio
                            : "No bio provided"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() =>
                          handleUpdateStatus(lawyer.lawyerId, "VERIFIED")
                        }
                        disabled={updating || processingId === lawyer.lawyerId}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
                      >
                        {processingId === lawyer.lawyerId ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Approve
                      </Button>

                      <Button
                        onClick={() =>
                          handleUpdateStatus(lawyer.lawyerId, "REJECTED")
                        }
                        disabled={updating || processingId === lawyer.lawyerId}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
                      >
                        {processingId === lawyer.lawyerId ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        Reject
                      </Button>

                      <Button
                        onClick={() => toggleDetails(lawyer.lawyerId)}
                        variant="outline"
                        className="px-6 py-2 rounded-lg flex items-center gap-2 border-slate-300 hover:bg-slate-50"
                      >
                        {showDetails[lawyer.lawyerId] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        {showDetails[lawyer.lawyerId] ? "Hide" : "Details"}
                      </Button>
                    </div>
                  </div>

                  {/* Expandable Details Section */}
                  {showDetails[lawyer.lawyerId] && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Technical Details */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            System Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Lawyer ID:</span>
                              <span className="font-mono text-slate-700">
                                {lawyer.lawyerId}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">
                                Clerk User ID:
                              </span>
                              <span className="font-mono text-slate-700">
                                {lawyer.clerkUserId}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Client ID:</span>
                              <span className="font-mono text-slate-700">
                                {lawyer.clientId}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Document:</span>
                              <span className="text-slate-700">
                                {lawyer.document || "None"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">
                                Last Updated:
                              </span>
                              <span className="text-slate-700">
                                {lawyer.updatedAt
                                  ? new Date(lawyer.updatedAt).toLocaleString()
                                  : "Never"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Achievements */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Achievements
                          </h4>
                          {lawyer.achievements &&
                          lawyer.achievements.length > 0 ? (
                            <div className="space-y-3">
                              {lawyer.achievements.map((achievement) => (
                                <div
                                  key={achievement._id}
                                  className="bg-blue-50 rounded-lg p-3"
                                >
                                  <h5 className="font-medium text-blue-900 mb-1">
                                    {achievement.title}
                                  </h5>
                                  {achievement.description && (
                                    <p className="text-sm text-blue-700">
                                      {achievement.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-500 text-sm">
                              No achievements listed
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Full Bio */}
                      {lawyer.bio && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Full Biography
                          </h4>
                          <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {lawyer.bio}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useQuery, gql } from "@apollo/client";
import { useState, useMemo } from "react";
import {
  Award,
  User,
  Mail,
  Badge,
  GraduationCap,
  Star,
  Search,
  MoreVertical,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

const GET_LAWYERS = gql`
  query GetLawyers {
    getLawyers {
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

export default function LawyersManagementDashboard() {
  const { data, loading, error } = useQuery(GET_LAWYERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const lawyers: Lawyer[] = data?.getLawyers || [];

  // Filter and sort logic
  const filteredAndSortedLawyers = useMemo(() => {
    const filtered = lawyers.filter((lawyer) => {
      const matchesSearch =
        `${lawyer.firstName} ${lawyer.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.university?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || lawyer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case "email":
          aValue = a.email;
          bValue = b.email;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "rating":
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case "created":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.firstName;
          bValue = b.firstName;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [lawyers, searchTerm, statusFilter, sortBy, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = lawyers.length;
    const verified = lawyers.filter((l) => l.status === "VERIFIED").length;
    const pending = lawyers.filter((l) => l.status === "PENDING").length;
    const rejected = lawyers.filter((l) => l.status === "REJECTED").length;
    const avgRating =
      lawyers.reduce((sum, l) => sum + (l.rating || 0), 0) / total;

    return {
      total,
      verified,
      pending,
      rejected,
      avgRating: avgRating.toFixed(1),
    };
  }, [lawyers]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <User className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 font-medium">
            Loading lawyers database...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Error Loading Data
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

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Lawyers Management
              </h1>
              <p className="text-slate-600 text-lg">
                Comprehensive overview of all registered lawyers
              </p>
            </div>
            {/* Removed Export and Add Lawyer buttons */}
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Total Lawyers
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-slate-500 font-medium">Verified</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.verified}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-slate-500 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.pending}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-slate-500 font-medium">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.rejected}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Avg Rating
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.avgRating}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search lawyers by name, email, license, or university..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Filters and Controls */}
              <div className="flex gap-3 items-center">
                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex border border-slate-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 ${
                      viewMode === "table"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredAndSortedLawyers.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 max-w-md mx-auto">
              <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No Lawyers Found
              </h3>
              <p className="text-slate-500">
                {searchTerm || statusFilter !== "ALL"
                  ? "No lawyers match your current filters."
                  : "No lawyers have been registered yet."}
              </p>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedLawyers.map((lawyer) => (
              <div
                key={lawyer._id}
                className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={lawyer.profilePicture || "/api/placeholder/60/60"}
                        alt={`${lawyer.firstName} ${lawyer.lastName}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                      />
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {lawyer.firstName} {lawyer.lastName}
                        </h3>
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            lawyer.status
                          )}`}
                        >
                          {getStatusIcon(lawyer.status)}
                          {lawyer.status}
                        </div>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-slate-100 rounded">
                      <MoreVertical className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="truncate">{lawyer.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Badge className="h-4 w-4 text-slate-500" />
                      <span className="font-mono">{lawyer.licenseNumber}</span>
                    </div>

                    {lawyer.university && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <span className="truncate">{lawyer.university}</span>
                      </div>
                    )}

                    {lawyer.rating && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{lawyer.rating}/5.0</span>
                      </div>
                    )}

                    {lawyer.achievements && lawyer.achievements.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Award className="h-4 w-4 text-purple-500" />
                        <span>{lawyer.achievements.length} achievements</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-800"
                      >
                        Lawyer
                        {sortBy === "name" &&
                          (sortOrder === "asc" ? (
                            <SortAsc className="h-3 w-3" />
                          ) : (
                            <SortDesc className="h-3 w-3" />
                          ))}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("email")}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-800"
                      >
                        Contact
                        {sortBy === "email" &&
                          (sortOrder === "asc" ? (
                            <SortAsc className="h-3 w-3" />
                          ) : (
                            <SortDesc className="h-3 w-3" />
                          ))}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Education
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-800"
                      >
                        Status
                        {sortBy === "status" &&
                          (sortOrder === "asc" ? (
                            <SortAsc className="h-3 w-3" />
                          ) : (
                            <SortDesc className="h-3 w-3" />
                          ))}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("rating")}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-800"
                      >
                        Rating
                        {sortBy === "rating" &&
                          (sortOrder === "asc" ? (
                            <SortAsc className="h-3 w-3" />
                          ) : (
                            <SortDesc className="h-3 w-3" />
                          ))}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Achievements
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("created")}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-800"
                      >
                        Joined
                        {sortBy === "created" &&
                          (sortOrder === "asc" ? (
                            <SortAsc className="h-3 w-3" />
                          ) : (
                            <SortDesc className="h-3 w-3" />
                          ))}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredAndSortedLawyers.map((lawyer) => (
                    <tr
                      key={lawyer._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              lawyer.profilePicture || "/api/placeholder/40/40"
                            }
                            alt={`${lawyer.firstName} ${lawyer.lastName}`}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-medium text-slate-900">
                              {lawyer.firstName} {lawyer.lastName}
                            </div>
                            <div className="text-sm text-slate-500 font-mono">
                              {lawyer.licenseNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {lawyer.email}
                        </div>
                        <div className="text-sm text-slate-500">
                          {lawyer.lawyerId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {lawyer.university || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            lawyer.status
                          )}`}
                        >
                          {getStatusIcon(lawyer.status)}
                          {lawyer.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lawyer.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">
                              {lawyer.rating}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {lawyer.achievements &&
                        lawyer.achievements.length > 0 ? (
                          <div className="max-w-xs">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              <Award className="h-3 w-3" />
                              {lawyer.achievements.length}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {new Date(lawyer.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-slate-500">
                          {new Date(lawyer.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Showing {filteredAndSortedLawyers.length} of {lawyers.length} lawyers
        </div>
      </div>
    </div>
  );
}

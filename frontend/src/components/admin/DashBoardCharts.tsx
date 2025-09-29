"use client";
import { useQuery, gql } from "@apollo/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const GET_APPOINTMENTS = gql`
  query GetAppointments {
    getAppointments {
      createdAt
      status
    }
  }
`;

const GET_LAWYERS = gql`
  query GetLawyers {
    getLawyers {
      _id
      status
    }
  }
`;

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      createdAt
    }
  }
`;

const STATUS_COLORS = {
  VERIFIED: "#22c55e",
  PENDING: "#f59e42",
  REJECTED: "#ef4444",
};

function groupByMonth(data: { createdAt: string }[]) {
  const result: Record<string, number> = {};
  data.forEach((item) => {
    const date = new Date(item.createdAt);
    const key = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    result[key] = (result[key] || 0) + 1;
  });
  return Object.entries(result)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export default function DashBoardCharts() {
  const { data: appointmentsData } = useQuery(GET_APPOINTMENTS);
  const { data: lawyersData } = useQuery(GET_LAWYERS);
  const { data: postsData } = useQuery(GET_POSTS);

  // Appointments per month
  const appointmentsPerMonth = appointmentsData?.getAppointments
    ? groupByMonth(appointmentsData.getAppointments)
    : [];

  // Posts per month
  const postsPerMonth = postsData?.getPosts
    ? groupByMonth(postsData.getPosts)
    : [];

  // Lawyer status distribution
  const lawyerStatusCounts = lawyersData?.getLawyers
    ? lawyersData.getLawyers.reduce(
        (acc: Record<string, number>, l: { status: string }) => {
          acc[l.status] = (acc[l.status] || 0) + 1;
          return acc;
        },
        {}
      )
    : {};
  const lawyerStatusData = Object.entries(lawyerStatusCounts).map(
    ([status, value]) => ({ status, value })
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {/* Appointments per Month Bar Chart */}
      <div className="bg-white rounded-xl p-6 shadow border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Appointments per Month</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={appointmentsPerMonth}>
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis allowDecimals={false} stroke="#64748b" />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Lawyer Status Pie Chart */}
      <div className="bg-white rounded-xl p-6 shadow border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Lawyer Status Distribution</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={lawyerStatusData}
              dataKey="value"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {lawyerStatusData.map((entry) => (
                <Cell
                  key={`cell-${entry.status}`}
                  fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || "#a3a3a3"}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Posts per Month Line Chart */}
      <div className="bg-white rounded-xl p-6 shadow border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Posts per Month</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={postsPerMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis allowDecimals={false} stroke="#64748b" />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#a21caf" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
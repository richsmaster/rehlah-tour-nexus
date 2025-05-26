
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, Calendar, Globe, MessageCircle, User, Search, FileSearch } from "lucide-react";
import { CustomerManagement } from "./CustomerManagement";
import { ProgramsManagement } from "./ProgramsManagement";
import { BookingManagement } from "./BookingManagement";
import { InternalChat } from "./InternalChat";

interface DashboardProps {
  currentUser: any;
}

export const Dashboard = ({ currentUser }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for charts with green theme
  const monthlyBookings = [
    { month: "يناير", bookings: 45, revenue: 125000 },
    { month: "فبراير", bookings: 52, revenue: 145000 },
    { month: "مارس", bookings: 61, revenue: 165000 },
    { month: "أبريل", bookings: 73, revenue: 195000 },
    { month: "مايو", bookings: 68, revenue: 180000 },
    { month: "يونيو", bookings: 84, revenue: 220000 },
  ];

  const destinationData = [
    { name: "تايلاند", bookings: 120, color: "#059669" },
    { name: "ماليزيا", bookings: 98, color: "#10B981" },
    { name: "تركيا", bookings: 87, color: "#34D399" },
    { name: "الإمارات", bookings: 65, color: "#6EE7B7" },
  ];

  const stats = [
    {
      title: "إجمالي العملاء",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "الحجوزات الشهرية",
      value: "84",
      change: "+8%",
      icon: Calendar,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "البرامج النشطة",
      value: "45",
      change: "+3%",
      icon: Globe,
      color: "from-teal-500 to-green-600"
    },
    {
      title: "الإيرادات الشهرية",
      value: "220,000 ر.س",
      change: "+15%",
      icon: FileSearch,
      color: "from-green-600 to-emerald-700"
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
          <TabsTrigger value="overview" className="flex items-center space-x-reverse space-x-2">
            <FileSearch className="w-4 h-4" />
            <span>لوحة التحكم</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center space-x-reverse space-x-2">
            <Users className="w-4 h-4" />
            <span>العملاء</span>
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center space-x-reverse space-x-2">
            <Globe className="w-4 h-4" />
            <span>البرامج</span>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center space-x-reverse space-x-2">
            <Calendar className="w-4 h-4" />
            <span>الحجوزات</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center space-x-reverse space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>التواصل</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>الحجوزات والإيرادات الشهرية</CardTitle>
                <CardDescription>نظرة عامة على الأداء الشهري</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyBookings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#059669" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>الوجهات الأكثر طلباً</CardTitle>
                <CardDescription>توزيع الحجوزات حسب الوجهة</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={destinationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="bookings"
                      label={({ name, bookings }) => `${name}: ${bookings}`}
                    >
                      {destinationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>النشاط الأخير</CardTitle>
              <CardDescription>آخر العمليات والتحديثات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "حجز جديد", customer: "أحمد محمد", program: "برنامج تايلاند 7 أيام", time: "منذ 5 دقائق" },
                  { action: "تعديل حجز", customer: "فاطمة علي", program: "برنامج ماليزيا 10 أيام", time: "منذ 15 دقيقة" },
                  { action: "استفسار جديد", customer: "محمد الأحمد", program: "برنامج تركيا 5 أيام", time: "منذ 30 دقيقة" },
                  { action: "دفع مؤكد", customer: "سارة محمود", program: "برنامج الإمارات 3 أيام", time: "منذ ساعة" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-reverse space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.customer} - {activity.program}</p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <CustomerManagement currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="programs">
          <ProgramsManagement currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="bookings">
          <BookingManagement currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="chat">
          <InternalChat currentUser={currentUser} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

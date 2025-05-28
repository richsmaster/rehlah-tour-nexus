
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { 
  User, 
  Settings, 
  Bell, 
  MessageCircle, 
  Calendar, 
  FileText, 
  Globe, 
  Users, 
  BarChart3,
  LogOut,
  Shield,
  CreditCard,
  Heart,
  Clock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const customerMenuItems = [
  {
    title: "الملف الشخصي",
    url: "/profile",
    icon: User,
  },
  {
    title: "حجوزاتي",
    url: "/my-bookings",
    icon: Calendar,
  },
  {
    title: "البرامج المفضلة",
    url: "/favorites",
    icon: Heart,
  },
  {
    title: "تاريخ الرحلات",
    url: "/trip-history",
    icon: Clock,
  },
  {
    title: "الفواتير والدفع",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "الرسائل",
    url: "/messages",
    icon: MessageCircle,
  },
  {
    title: "الإشعارات",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "الإعدادات",
    url: "/settings",
    icon: Settings,
  },
];

const employeeMenuItems = [
  {
    title: "لوحة التحكم",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "الملف الشخصي",
    url: "/profile",
    icon: User,
  },
  {
    title: "إدارة العملاء",
    url: "/customers",
    icon: Users,
  },
  {
    title: "إدارة البرامج",
    url: "/programs",
    icon: Globe,
  },
  {
    title: "إدارة الحجوزات",
    url: "/bookings",
    icon: Calendar,
  },
  {
    title: "التقارير",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "التواصل الداخلي",
    url: "/internal-chat",
    icon: MessageCircle,
  },
  {
    title: "الإشعارات",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "الإعدادات",
    url: "/settings",
    icon: Settings,
  },
];

const adminMenuItems = [
  {
    title: "لوحة التحكم الرئيسية",
    url: "/admin-dashboard",
    icon: BarChart3,
  },
  {
    title: "الملف الشخصي",
    url: "/profile",
    icon: User,
  },
  {
    title: "إدارة المستخدمين",
    url: "/users",
    icon: Shield,
  },
  {
    title: "إدارة الموظفين",
    url: "/employees",
    icon: Users,
  },
  {
    title: "إدارة العملاء",
    url: "/customers",
    icon: Users,
  },
  {
    title: "إدارة البرامج",
    url: "/programs",
    icon: Globe,
  },
  {
    title: "إدارة الحجوزات",
    url: "/bookings",
    icon: Calendar,
  },
  {
    title: "التقارير المتقدمة",
    url: "/advanced-reports",
    icon: FileText,
  },
  {
    title: "إعدادات النظام",
    url: "/system-settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { user, userProfile, signOut } = useAuth();

  const getMenuItems = () => {
    const role = userProfile?.role || 'customer';
    
    switch (role) {
      case 'admin':
        return adminMenuItems;
      case 'employee':
        return employeeMenuItems;
      default:
        return customerMenuItems;
    }
  };

  const getUserRoleLabel = () => {
    const role = userProfile?.role || 'customer';
    
    switch (role) {
      case 'admin':
        return 'مدير';
      case 'employee':
        return 'موظف';
      default:
        return 'عميل';
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar className="border-r border-gray-200" dir="rtl">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-reverse space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.full_name} />
            <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">
              {userProfile?.full_name || user?.email}
            </h3>
            <p className="text-sm text-gray-500">{getUserRoleLabel()}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <a 
                      href={item.url}
                      className="flex items-center space-x-reverse space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>الحساب</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => signOut()}
                  className="w-full text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-center text-xs text-gray-500">
          نظام إدارة السياحة
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

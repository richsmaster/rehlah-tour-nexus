
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Lock, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (userData: any) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      if (username && password && userType) {
        const userData = {
          name: username === "admin" ? "أحمد المدير" : username === "agent" ? "سارة العميل" : "موظف النظام",
          username,
          role: userType,
          permissions: getPermissions(userType)
        };
        
        onLogin(userData);
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحباً ${userData.name}`,
        });
      } else {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى إدخال جميع البيانات المطلوبة",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const getPermissions = (role: string) => {
    switch (role) {
      case "manager":
        return ["view_all", "edit_all", "delete", "reports", "user_management"];
      case "booking_agent":
        return ["view_bookings", "edit_bookings", "customer_management"];
      case "reception":
        return ["view_customers", "customer_service"];
      default:
        return ["view_basic"];
    }
  };

  return (
    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">تسجيل الدخول</CardTitle>
        <CardDescription className="text-gray-600">
          أدخل بياناتك للوصول إلى النظام
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-right flex items-center justify-end space-x-reverse space-x-2">
              <span>اسم المستخدم</span>
              <User className="w-4 h-4" />
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              className="text-right"
              dir="rtl"
            />
            <p className="text-xs text-gray-500 text-right">
              جرب: admin أو agent
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-right flex items-center justify-end space-x-reverse space-x-2">
              <span>كلمة المرور</span>
              <Lock className="w-4 h-4" />
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              className="text-right"
              dir="rtl"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-right flex items-center justify-end space-x-reverse space-x-2">
              <span>نوع المستخدم</span>
              <Building className="w-4 h-4" />
            </Label>
            <Select value={userType} onValueChange={setUserType} dir="rtl">
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اختر نوع المستخدم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">مدير</SelectItem>
                <SelectItem value="booking_agent">موظف حجوزات</SelectItem>
                <SelectItem value="reception">موظف استقبال</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>للتجربة:</p>
          <p>المدير: admin / أي كلمة مرور</p>
          <p>الموظف: agent / أي كلمة مرور</p>
        </div>
      </CardContent>
    </Card>
  );
};

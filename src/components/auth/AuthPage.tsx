
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, User, Lock, Mail, Building } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const AuthPage = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    fullName: '', 
    role: '' 
  });
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Login attempt:', loginData.email);

    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      console.error('Login error:', error);
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message === 'Invalid login credentials' ? 
          'بيانات الدخول غير صحيحة' : 
          error.message === 'Email not confirmed' ?
          'يرجى تأكيد البريد الإلكتروني أولاً' :
          error.message,
        variant: 'destructive',
      });
    } else {
      console.log('Login successful');
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بك في النظام',
      });
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.role) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى اختيار المنصب المطلوب',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    console.log('Signup attempt:', signupData.email, signupData.role);

    const { error } = await signUp(signupData.email, signupData.password, signupData.fullName, signupData.role);
    
    if (error) {
      console.error('Signup error:', error);
      toast({
        title: 'خطأ في التسجيل',
        description: error.message === 'User already registered' ?
          'المستخدم مسجل مسبقاً' :
          error.message,
        variant: 'destructive',
      });
    } else {
      console.log('Signup successful');
      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'مرحباً بك في النظام! يمكنك الآن الدخول والعمل.',
      });
      // Reset form
      setSignupData({ email: '', password: '', fullName: '', role: '' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3Ccircle cx='53' cy='7' r='7'/%3E%3Ccircle cx='7' cy='53' r='7'/%3E%3Ccircle cx='53' cy='53' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4 shadow-lg">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">نظام إدارة السياحة</h1>
          <p className="text-gray-600">مرحباً بك في نظام CRM المتخصص للشركات السياحية</p>
        </div>
        
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">الدخول إلى النظام</CardTitle>
            <CardDescription className="text-gray-600">
              سجل دخولك أو أنشئ حساب جديد
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup">حساب جديد</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-right flex items-center justify-end space-x-reverse space-x-2">
                      <span>البريد الإلكتروني</span>
                      <Mail className="w-4 h-4" />
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      placeholder="أدخل البريد الإلكتروني"
                      className="text-right"
                      dir="rtl"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-right flex items-center justify-end space-x-reverse space-x-2">
                      <span>كلمة المرور</span>
                      <Lock className="w-4 h-4" />
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      placeholder="أدخل كلمة المرور"
                      className="text-right"
                      dir="rtl"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-right flex items-center justify-end space-x-reverse space-x-2">
                      <span>الاسم الكامل</span>
                      <User className="w-4 h-4" />
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                      placeholder="أدخل الاسم الكامل"
                      className="text-right"
                      dir="rtl"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-right flex items-center justify-end space-x-reverse space-x-2">
                      <span>البريد الإلكتروني</span>
                      <Mail className="w-4 h-4" />
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      placeholder="أدخل البريد الإلكتروني"
                      className="text-right"
                      dir="rtl"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-right flex items-center justify-end space-x-reverse space-x-2">
                      <span>كلمة المرور</span>
                      <Lock className="w-4 h-4" />
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      placeholder="أدخل كلمة المرور"
                      className="text-right"
                      dir="rtl"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-right flex items-center justify-end space-x-reverse space-x-2">
                      <span>المنصب</span>
                      <Building className="w-4 h-4" />
                    </Label>
                    <Select value={signupData.role} onValueChange={(value) => setSignupData({...signupData, role: value})} dir="rtl">
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر المنصب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">مدير عام</SelectItem>
                        <SelectItem value="manager">مدير</SelectItem>
                        <SelectItem value="booking_agent">موظف حجوزات</SelectItem>
                        <SelectItem value="reception">موظف استقبال</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

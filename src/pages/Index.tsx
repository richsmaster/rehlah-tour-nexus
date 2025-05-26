
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/components/auth/AuthPage';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Button } from '@/components/ui/button';
import { LogOut, Globe, Eye } from 'lucide-react';

const Index = () => {
  const { user, userProfile, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show auth page
  if (!user) {
    return <AuthPage />;
  }

  // If user is not approved, show pending message
  if (!userProfile?.is_approved && userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4 shadow-lg">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">في انتظار الموافقة</h1>
          <p className="text-gray-600 mb-6">
            تم إنشاء حسابك بنجاح. سيتم مراجعة طلبك والموافقة عليه من قبل الإدارة قريباً.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            سيصل إيميل الموافقة إلى: klidmorre@gmail.com
          </p>
          <Button 
            onClick={() => signOut()}
            variant="outline"
            className="flex items-center space-x-reverse space-x-2 mx-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </div>
    );
  }

  // Main dashboard for approved users
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-reverse space-x-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">نظام إدارة السياحة</h1>
              <p className="text-sm text-gray-600">مرحباً، {userProfile?.full_name || user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-reverse space-x-2">
            <Button 
              onClick={() => window.open('/programs', '_blank')}
              variant="outline"
              className="flex items-center space-x-reverse space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>عرض البرامج للعملاء</span>
            </Button>
            
            <Button 
              onClick={() => signOut()}
              variant="outline"
              className="flex items-center space-x-reverse space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </header>

      <Dashboard currentUser={{ userProfile, user }} />
    </div>
  );
};

export default Index;

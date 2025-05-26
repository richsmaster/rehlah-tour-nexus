
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, MapPin, Clock, Users, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Program {
  id: string;
  name: string;
  country: string;
  duration: string;
  price: string;
  cities: string[];
  hotels: string[];
  activities: string[];
  includes: string[];
  description?: string;
  is_available: boolean;
}

export const PublicProgramsPage = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البرامج...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-green-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg mb-2">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">برامجنا السياحية</h1>
              <p className="text-gray-600">اكتشف أجمل الوجهات السياحية معنا</p>
            </div>
          </div>
        </div>
      </header>

      {/* Programs Grid */}
      <main className="container mx-auto px-6 py-8">
        {programs.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد برامج متاحة حالياً</h3>
            <p className="text-gray-500">تابعونا للحصول على أحدث البرامج السياحية</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Card key={program.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="text-lg font-bold">{program.name}</CardTitle>
                  <CardDescription className="text-green-100 flex items-center space-x-reverse space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{program.country}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center space-x-reverse space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{program.duration}</span>
                    </Badge>
                    <div className="text-lg font-bold text-green-600">{program.price}</div>
                  </div>

                  {program.description && (
                    <p className="text-gray-600 text-sm">{program.description}</p>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">المدن:</h4>
                      <div className="flex flex-wrap gap-1">
                        {program.cities.map((city, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {city}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">الأنشطة:</h4>
                      <div className="flex flex-wrap gap-1">
                        {program.activities.slice(0, 3).map((activity, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-green-50">
                            {activity}
                          </Badge>
                        ))}
                        {program.activities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{program.activities.length - 3} المزيد
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">يشمل:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {program.includes.slice(0, 3).map((item, index) => (
                          <li key={index} className="flex items-center space-x-reverse space-x-2">
                            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                        {program.includes.length > 3 && (
                          <li className="text-green-600 text-xs">والمزيد...</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                    استفسر عن البرنامج
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-green-200 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-reverse space-x-4">
              <div className="flex items-center space-x-reverse space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>+966 50 123 4567</span>
              </div>
              <div className="flex items-center space-x-reverse space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>info@travel.com</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 نظام إدارة السياحة. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

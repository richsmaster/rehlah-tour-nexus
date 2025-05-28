import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Clock, Image, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ProgramDaysManagement } from './ProgramDaysManagement';
import { AdditionalServicesManagement } from './AdditionalServicesManagement';
import { CategoriesManagement } from './CategoriesManagement';

interface Country {
  id: string;
  name: string;
  code: string;
}

interface City {
  id: string;
  name: string;
  country_id: string;
}

interface ProgramCategory {
  id: string;
  name: string;
  description?: string;
}

interface AdditionalService {
  id: string;
  name: string;
  description?: string;
  price: number;
  service_type: string;
  is_optional: boolean;
  created_at: string;
}

interface ProgramDay {
  id: string;
  program_id: string;
  day_number: number;
  title: string;
  description?: string;
  city_id?: string;
  sort_order: number;
  tours: DayTour[];
}

interface DayTour {
  id: string;
  day_id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  activity_type?: string;
  images: string[];
  notes?: string;
  sort_order: number;
}

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
  category_id?: string;
  min_participants?: number;
  max_participants?: number;
  difficulty_level?: string;
  season?: string;
  featured_image?: string;
  gallery: string[];
  created_at: string;
}

interface AdvancedProgramsManagementProps {
  currentUser: any;
}

export const AdvancedProgramsManagement = ({ currentUser }: AdvancedProgramsManagementProps) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<ProgramCategory[]>([]);
  const [services, setServices] = useState<AdditionalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [programDays, setProgramDays] = useState<ProgramDay[]>([]);
  const [activeTab, setActiveTab] = useState('programs');
  
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    duration: '',
    price: '',
    cities: '',
    hotels: '',
    activities: '',
    includes: '',
    description: '',
    is_available: true,
    category_id: '',
    min_participants: 1,
    max_participants: 50,
    difficulty_level: 'متوسط',
    season: '',
    featured_image: '',
    gallery: [] as string[]
  });

  const { toast } = useToast();

  const canManagePrograms = currentUser?.userProfile?.is_approved || 
                           currentUser?.userProfile?.role === 'admin';

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [programsRes, countriesRes, citiesRes, categoriesRes, servicesRes] = await Promise.all([
        supabase.from('programs').select('*').order('created_at', { ascending: false }),
        supabase.from('countries').select('*').order('name'),
        supabase.from('cities').select('*').order('name'),
        supabase.from('program_categories').select('*').order('name'),
        supabase.from('additional_services').select('*').order('name')
      ]);

      if (programsRes.error) throw programsRes.error;
      if (countriesRes.error) throw countriesRes.error;
      if (citiesRes.error) throw citiesRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (servicesRes.error) throw servicesRes.error;

      // تحويل البيانات إلى النوع المطلوب مع معالجة المصفوفات
      const transformedPrograms: Program[] = (programsRes.data || []).map(program => ({
        ...program,
        gallery: Array.isArray(program.gallery) ? program.gallery.filter((item): item is string => typeof item === 'string') : [],
        cities: Array.isArray(program.cities) ? program.cities : [],
        hotels: Array.isArray(program.hotels) ? program.hotels : [],
        activities: Array.isArray(program.activities) ? program.activities : [],
        includes: Array.isArray(program.includes) ? program.includes : [],
        description: program.description || '',
        category_id: program.category_id || '',
        min_participants: program.min_participants || 1,
        max_participants: program.max_participants || 50,
        difficulty_level: program.difficulty_level || 'متوسط',
        season: program.season || '',
        featured_image: program.featured_image || '',
        created_at: program.created_at || new Date().toISOString()
      }));

      const transformedServices: AdditionalService[] = (servicesRes.data || []).map(service => ({
        ...service,
        created_at: service.created_at || new Date().toISOString(),
        description: service.description || '',
        is_optional: service.is_optional ?? true
      }));

      setPrograms(transformedPrograms);
      setCountries(countriesRes.data || []);
      setCities(citiesRes.data || []);
      setCategories(categoriesRes.data || []);
      setServices(transformedServices);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل البيانات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProgramDays = async (programId: string) => {
    try {
      const { data: daysData, error: daysError } = await supabase
        .from('program_days')
        .select('*')
        .eq('program_id', programId)
        .order('day_number', { ascending: true });

      if (daysError) throw daysError;

      const daysWithTours = await Promise.all(
        (daysData || []).map(async (day) => {
          const { data: toursData, error: toursError } = await supabase
            .from('day_tours')
            .select('*')
            .eq('day_id', day.id)
            .order('sort_order', { ascending: true });

          if (toursError) throw toursError;

          // تحويل بيانات الجولات لضمان توافق الأنواع
          const processedTours: DayTour[] = (toursData || []).map(tour => ({
            ...tour,
            images: Array.isArray(tour.images) ? tour.images : [],
            description: tour.description || undefined,
            start_time: tour.start_time || undefined,
            end_time: tour.end_time || undefined,
            location: tour.location || undefined,
            activity_type: tour.activity_type || undefined,
            notes: tour.notes || undefined
          }));

          return {
            ...day,
            tours: processedTours
          };
        })
      );

      setProgramDays(daysWithTours);
    } catch (error) {
      console.error('Error fetching program days:', error);
    }
  };

  const handleProgramSelect = async (program: Program) => {
    setSelectedProgram(program);
    await fetchProgramDays(program.id);
    setActiveTab('days');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      country: '',
      duration: '',
      price: '',
      cities: '',
      hotels: '',
      activities: '',
      includes: '',
      description: '',
      is_available: true,
      category_id: '',
      min_participants: 1,
      max_participants: 50,
      difficulty_level: 'متوسط',
      season: '',
      featured_image: '',
      gallery: []
    });
    setEditingProgram(null);
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      country: program.country,
      duration: program.duration,
      price: program.price,
      cities: program.cities.join(', '),
      hotels: program.hotels.join(', '),
      activities: program.activities.join(', '),
      includes: program.includes.join(', '),
      description: program.description || '',
      is_available: program.is_available,
      category_id: program.category_id || '',
      min_participants: program.min_participants || 1,
      max_participants: program.max_participants || 50,
      difficulty_level: program.difficulty_level || 'متوسط',
      season: program.season || '',
      featured_image: program.featured_image || '',
      gallery: program.gallery || []
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const programData = {
      name: formData.name,
      country: formData.country,
      duration: formData.duration,
      price: formData.price,
      cities: formData.cities.split(',').map(item => item.trim()).filter(Boolean),
      hotels: formData.hotels.split(',').map(item => item.trim()).filter(Boolean),
      activities: formData.activities.split(',').map(item => item.trim()).filter(Boolean),
      includes: formData.includes.split(',').map(item => item.trim()).filter(Boolean),
      description: formData.description,
      is_available: formData.is_available,
      category_id: formData.category_id || null,
      min_participants: formData.min_participants,
      max_participants: formData.max_participants,
      difficulty_level: formData.difficulty_level,
      season: formData.season,
      featured_image: formData.featured_image,
      gallery: formData.gallery
    };

    try {
      if (editingProgram) {
        const { error } = await supabase
          .from('programs')
          .update(programData)
          .eq('id', editingProgram.id);

        if (error) throw error;
        toast({
          title: 'تم التحديث بنجاح',
          description: 'تم تحديث البرنامج بنجاح',
        });
      } else {
        const { error } = await supabase
          .from('programs')
          .insert([programData]);

        if (error) throw error;
        toast({
          title: 'تم الإضافة بنجاح',
          description: 'تم إضافة البرنامج الجديد بنجاح',
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchAllData();
    } catch (error) {
      console.error('Error saving program:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حفظ البرنامج',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا البرنامج؟')) return;

    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف البرنامج بنجاح',
      });
      fetchAllData();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف البرنامج',
        variant: 'destructive',
      });
    }
  };

  const handleDaysUpdate = () => {
    if (selectedProgram) {
      fetchProgramDays(selectedProgram.id);
    }
  };

  if (loading && programs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل النظام المتقدم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">النظام المتكامل لإدارة البرامج السياحية</h2>
          <p className="text-gray-600">إدارة شاملة للبرامج والجولات والخدمات الإضافية</p>
        </div>
        
        {canManagePrograms && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة برنامج متقدم
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {editingProgram ? 'تعديل البرنامج المتقدم' : 'إضافة برنامج متقدم جديد'}
                </DialogTitle>
                <DialogDescription>
                  {editingProgram ? 'قم بتعديل بيانات البرنامج المتقدم' : 'أدخل بيانات البرنامج المتقدم الجديد'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
                    <TabsTrigger value="advanced">المعلومات المتقدمة</TabsTrigger>
                    <TabsTrigger value="media">الوسائط والصور</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">اسم البرنامج</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="برنامج تايلاند الكلاسيكي المتقدم"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">الدولة</Label>
                        <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الدولة" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.id} value={country.name}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">المدة</Label>
                        <Input
                          id="duration"
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: e.target.value})}
                          placeholder="7 أيام / 6 ليالي"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price">السعر</Label>
                        <Input
                          id="price"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          placeholder="3,500 ر.س"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">فئة البرنامج</Label>
                        <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الفئة" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">الوصف التفصيلي</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="وصف شامل ومفصل عن البرنامج السياحي"
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min_participants">الحد الأدنى للمشاركين</Label>
                        <Input
                          id="min_participants"
                          type="number"
                          value={formData.min_participants}
                          onChange={(e) => setFormData({...formData, min_participants: parseInt(e.target.value)})}
                          min="1"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="max_participants">الحد الأقصى للمشاركين</Label>
                        <Input
                          id="max_participants"
                          type="number"
                          value={formData.max_participants}
                          onChange={(e) => setFormData({...formData, max_participants: parseInt(e.target.value)})}
                          min="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="difficulty_level">مستوى الصعوبة</Label>
                        <Select value={formData.difficulty_level} onValueChange={(value) => setFormData({...formData, difficulty_level: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="سهل">سهل</SelectItem>
                            <SelectItem value="متوسط">متوسط</SelectItem>
                            <SelectItem value="صعب">صعب</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="season">الموسم المناسب</Label>
                      <Input
                        id="season"
                        value={formData.season}
                        onChange={(e) => setFormData({...formData, season: e.target.value})}
                        placeholder="الصيف، الشتاء، طوال السنة"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cities">المدن (مفصولة بفاصلة)</Label>
                      <Input
                        id="cities"
                        value={formData.cities}
                        onChange={(e) => setFormData({...formData, cities: e.target.value})}
                        placeholder="بانكوك, بوكيت, شيانغ ماي"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hotels">الفنادق (مفصولة بفاصلة)</Label>
                      <Input
                        id="hotels"
                        value={formData.hotels}
                        onChange={(e) => setFormData({...formData, hotels: e.target.value})}
                        placeholder="فندق 5 نجوم في بانكوك, منتجع شاطئي في بوكيت"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activities">الأنشطة (مفصولة بفاصلة)</Label>
                      <Input
                        id="activities"
                        value={formData.activities}
                        onChange={(e) => setFormData({...formData, activities: e.target.value})}
                        placeholder="جولة المعابد, رحلة الجزر, عرض الألوان والأصوات"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="includes">يشمل (مفصول بفاصلة)</Label>
                      <Input
                        id="includes"
                        value={formData.includes}
                        onChange={(e) => setFormData({...formData, includes: e.target.value})}
                        placeholder="الطيران, الإقامة, الإفطار, التنقلات"
                        required
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="featured_image">الصورة الرئيسية (رابط)</Label>
                      <Input
                        id="featured_image"
                        value={formData.featured_image}
                        onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>معرض الصور</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {formData.gallery.map((image, index) => (
                          <div key={index} className="relative">
                            <img src={image} alt={`صورة ${index + 1}`} className="w-full h-20 object-cover rounded" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1"
                              onClick={() => {
                                const newGallery = formData.gallery.filter((_, i) => i !== index);
                                setFormData({...formData, gallery: newGallery});
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          className="h-20 border-dashed"
                          onClick={() => {
                            const url = prompt('أدخل رابط الصورة:');
                            if (url) {
                              setFormData({...formData, gallery: [...formData.gallery, url]});
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    {loading ? 'جاري الحفظ...' : editingProgram ? 'تحديث' : 'إضافة'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="programs">البرامج</TabsTrigger>
          <TabsTrigger value="days">الأيام والجولات</TabsTrigger>
          <TabsTrigger value="services">الخدمات الإضافية</TabsTrigger>
          <TabsTrigger value="categories">الفئات والتصنيفات</TabsTrigger>
        </TabsList>

        <TabsContent value="programs">
          <Card>
            <CardHeader>
              <CardTitle>البرامج السياحية المتقدمة</CardTitle>
              <CardDescription>إدارة شاملة لجميع البرامج السياحية</CardDescription>
            </CardHeader>
            <CardContent>
              {programs.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد برامج</h3>
                  <p className="text-gray-500 mb-4">لم يتم إضافة أي برامج سياحية بعد</p>
                  {canManagePrograms && (
                    <Button 
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      إضافة برنامج جديد
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {programs.map((program) => (
                    <Card key={program.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader 
                        className="pb-2 cursor-pointer"
                        onClick={() => handleProgramSelect(program)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{program.name}</CardTitle>
                            <CardDescription className="flex items-center space-x-reverse space-x-2 mt-1">
                              <MapPin className="w-4 h-4" />
                              <span>{program.country}</span>
                            </CardDescription>
                          </div>
                          <Badge variant={program.is_available ? "default" : "secondary"}>
                            {program.is_available ? 'متاح' : 'غير متاح'}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="flex items-center space-x-reverse space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{program.duration}</span>
                          </Badge>
                          <div className="text-lg font-bold text-green-600">{program.price}</div>
                        </div>

                        {program.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">{program.description}</p>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {program.cities.slice(0, 3).map((city, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {city}
                            </Badge>
                          ))}
                          {program.cities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{program.cities.length - 3} المزيد
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleProgramSelect(program)}
                          >
                            <Calendar className="w-4 h-4 ml-1" />
                            إدارة الأيام
                          </Button>
                          
                          {canManagePrograms && (
                            <div className="flex items-center space-x-reverse space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(program);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(program.id);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="days">
          {selectedProgram && (
            <ProgramDaysManagement
              program={selectedProgram}
              programDays={programDays}
              cities={cities}
              onDaysUpdate={handleDaysUpdate}
              canManage={canManagePrograms}
            />
          )}
        </TabsContent>

        <TabsContent value="services">
          <AdditionalServicesManagement 
            services={services}
            onServicesUpdate={fetchAllData}
            canManage={canManagePrograms}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesManagement 
            categories={categories}
            countries={countries}
            cities={cities}
            onCategoriesUpdate={fetchAllData}
            canManage={canManagePrograms}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

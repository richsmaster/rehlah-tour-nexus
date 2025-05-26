
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, MapPin, Clock, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  created_at: string;
}

interface ProgramsManagementProps {
  currentUser: any;
}

export const ProgramsManagement = ({ currentUser }: ProgramsManagementProps) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
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
    is_available: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل البرامج',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
      is_available: true
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
      is_available: program.is_available
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
      is_available: formData.is_available
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
      fetchPrograms();
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
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف البرنامج',
        variant: 'destructive',
      });
    }
  };

  const canManagePrograms = currentUser?.userProfile?.is_approved || 
                           currentUser?.userProfile?.role === 'admin';

  if (loading && programs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البرامج...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة البرامج السياحية</h2>
          <p className="text-gray-600">إدارة وتحديث البرامج السياحية المتاحة</p>
        </div>
        
        {canManagePrograms && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة برنامج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {editingProgram ? 'تعديل البرنامج' : 'إضافة برنامج جديد'}
                </DialogTitle>
                <DialogDescription>
                  {editingProgram ? 'قم بتعديل بيانات البرنامج' : 'أدخل بيانات البرنامج الجديد'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم البرنامج</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="برنامج تايلاند الكلاسيكي"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">الدولة</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      placeholder="تايلاند"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="وصف مفصل عن البرنامج السياحي"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
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

      <Card>
        <CardHeader>
          <CardTitle>قائمة البرامج</CardTitle>
          <CardDescription>جميع البرامج السياحية المتاحة</CardDescription>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم البرنامج</TableHead>
                    <TableHead className="text-right">الدولة</TableHead>
                    <TableHead className="text-right">المدة</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    {canManagePrograms && <TableHead className="text-right">الإجراءات</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell className="font-medium">{program.name}</TableCell>
                      <TableCell>{program.country}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center space-x-reverse space-x-1 w-fit">
                          <Clock className="w-3 h-3" />
                          <span>{program.duration}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">{program.price}</TableCell>
                      <TableCell>
                        <Badge variant={program.is_available ? "default" : "secondary"}>
                          {program.is_available ? 'متاح' : 'غير متاح'}
                        </Badge>
                      </TableCell>
                      {canManagePrograms && (
                        <TableCell>
                          <div className="flex items-center space-x-reverse space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(program)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(program.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

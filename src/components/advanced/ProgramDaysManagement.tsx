
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Clock, MapPin, Image, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface City {
  id: string;
  name: string;
  country_id: string;
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

interface Program {
  id: string;
  name: string;
  country: string;
}

interface ProgramDaysManagementProps {
  program: Program;
  programDays: ProgramDay[];
  cities: City[];
  onDaysUpdate: () => void;
  canManage: boolean;
}

export const ProgramDaysManagement = ({ 
  program, 
  programDays, 
  cities, 
  onDaysUpdate, 
  canManage 
}: ProgramDaysManagementProps) => {
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<ProgramDay | null>(null);
  const [loading, setLoading] = useState(false);

  const [dayFormData, setDayFormData] = useState({
    day_number: 1,
    title: '',
    description: '',
    city_id: ''
  });

  const { toast } = useToast();

  const resetDayForm = () => {
    setDayFormData({
      day_number: programDays.length + 1,
      title: '',
      description: '',
      city_id: ''
    });
    setEditingDay(null);
  };

  const handleEditDay = (day: ProgramDay) => {
    setEditingDay(day);
    setDayFormData({
      day_number: day.day_number,
      title: day.title,
      description: day.description || '',
      city_id: day.city_id || ''
    });
    setIsDayDialogOpen(true);
  };

  const handleSubmitDay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dayData = {
      program_id: program.id,
      day_number: dayFormData.day_number,
      title: dayFormData.title,
      description: dayFormData.description,
      city_id: dayFormData.city_id || null,
      sort_order: dayFormData.day_number
    };

    try {
      if (editingDay) {
        const { error } = await supabase
          .from('program_days')
          .update(dayData)
          .eq('id', editingDay.id);

        if (error) throw error;
        toast({
          title: 'تم التحديث بنجاح',
          description: 'تم تحديث اليوم بنجاح',
        });
      } else {
        const { error } = await supabase
          .from('program_days')
          .insert([dayData]);

        if (error) throw error;
        toast({
          title: 'تم الإضافة بنجاح',
          description: 'تم إضافة اليوم الجديد بنجاح',
        });
      }

      setIsDayDialogOpen(false);
      resetDayForm();
      onDaysUpdate();
    } catch (error) {
      console.error('Error saving day:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حفظ اليوم',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDay = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا اليوم؟')) return;

    try {
      const { error } = await supabase
        .from('program_days')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف اليوم بنجاح',
      });
      onDaysUpdate();
    } catch (error) {
      console.error('Error deleting day:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف اليوم',
        variant: 'destructive',
      });
    }
  };

  const getCityName = (cityId?: string) => {
    if (!cityId) return '';
    const city = cities.find(c => c.id === cityId);
    return city?.name || '';
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">إدارة أيام البرنامج: {program.name}</h3>
          <p className="text-gray-600">تنظيم الأيام والجولات السياحية</p>
        </div>
        
        {canManage && (
          <Dialog open={isDayDialogOpen} onOpenChange={setIsDayDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                onClick={resetDayForm}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة يوم جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {editingDay ? 'تعديل اليوم' : 'إضافة يوم جديد'}
                </DialogTitle>
                <DialogDescription>
                  {editingDay ? 'قم بتعديل بيانات اليوم' : 'أدخل بيانات اليوم الجديد'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmitDay} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="day_number">رقم اليوم</Label>
                    <Input
                      id="day_number"
                      type="number"
                      value={dayFormData.day_number}
                      onChange={(e) => setDayFormData({...dayFormData, day_number: parseInt(e.target.value)})}
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">المدينة</Label>
                    <Select value={dayFormData.city_id} onValueChange={(value) => setDayFormData({...dayFormData, city_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">عنوان اليوم</Label>
                  <Input
                    id="title"
                    value={dayFormData.title}
                    onChange={(e) => setDayFormData({...dayFormData, title: e.target.value})}
                    placeholder="اليوم الأول - الوصول والاستقرار"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">وصف اليوم</Label>
                  <Textarea
                    id="description"
                    value={dayFormData.description}
                    onChange={(e) => setDayFormData({...dayFormData, description: e.target.value})}
                    placeholder="وصف مفصل لأنشطة اليوم"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDayDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'جاري الحفظ...' : editingDay ? 'تحديث' : 'إضافة'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {programDays.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد أيام مضافة</h3>
              <p className="text-gray-500 mb-4">ابدأ بإضافة أيام البرنامج السياحي</p>
              {canManage && (
                <Button 
                  onClick={() => setIsDayDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  إضافة اليوم الأول
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          programDays.map((day) => (
            <Card key={day.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-reverse space-x-2">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      اليوم {day.day_number}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{day.title}</CardTitle>
                      {day.city_id && (
                        <CardDescription className="flex items-center space-x-reverse space-x-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{getCityName(day.city_id)}</span>
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  
                  {canManage && (
                    <div className="flex items-center space-x-reverse space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditDay(day)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteDay(day.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {day.description && (
                  <p className="text-gray-600 mb-4">{day.description}</p>
                )}
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">الجولات والأنشطة:</h4>
                  {day.tours.length === 0 ? (
                    <p className="text-gray-500 text-sm">لم يتم إضافة جولات لهذا اليوم بعد</p>
                  ) : (
                    <div className="grid gap-2">
                      {day.tours.map((tour) => (
                        <div key={tour.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{tour.title}</h5>
                            {(tour.start_time || tour.end_time) && (
                              <div className="flex items-center space-x-reverse space-x-1 text-sm text-gray-600">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {tour.start_time && tour.end_time 
                                    ? `${tour.start_time} - ${tour.end_time}`
                                    : tour.start_time || tour.end_time
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                          {tour.location && (
                            <p className="text-sm text-gray-600 mt-1">📍 {tour.location}</p>
                          )}
                          {tour.description && (
                            <p className="text-sm text-gray-700 mt-2">{tour.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

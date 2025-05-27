
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, GripVertical, Clock, MapPin, Image } from 'lucide-react';
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
  duration: string;
  price: string;
  cities: string[];
  hotels: string[];
  activities: string[];
  includes: string[];
  description?: string;
  is_available: boolean;
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
  const [isTourDialogOpen, setIsTourDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<ProgramDay | null>(null);
  const [editingTour, setEditingTour] = useState<DayTour | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [dayFormData, setDayFormData] = useState({
    day_number: 1,
    title: '',
    description: '',
    city_id: '',
    sort_order: 0
  });

  const [tourFormData, setTourFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    activity_type: '',
    images: [] as string[],
    notes: '',
    sort_order: 0
  });

  const { toast } = useToast();

  const resetDayForm = () => {
    setDayFormData({
      day_number: programDays.length + 1,
      title: '',
      description: '',
      city_id: '',
      sort_order: programDays.length
    });
    setEditingDay(null);
  };

  const resetTourForm = () => {
    setTourFormData({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      location: '',
      activity_type: '',
      images: [],
      notes: '',
      sort_order: 0
    });
    setEditingTour(null);
  };

  const handleDayEdit = (day: ProgramDay) => {
    setEditingDay(day);
    setDayFormData({
      day_number: day.day_number,
      title: day.title,
      description: day.description || '',
      city_id: day.city_id || '',
      sort_order: day.sort_order
    });
    setIsDayDialogOpen(true);
  };

  const handleTourEdit = (tour: DayTour) => {
    setEditingTour(tour);
    setSelectedDayId(tour.day_id);
    setTourFormData({
      title: tour.title,
      description: tour.description || '',
      start_time: tour.start_time || '',
      end_time: tour.end_time || '',
      location: tour.location || '',
      activity_type: tour.activity_type || '',
      images: tour.images || [],
      notes: tour.notes || '',
      sort_order: tour.sort_order
    });
    setIsTourDialogOpen(true);
  };

  const handleDaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dayData = {
      program_id: program.id,
      day_number: dayFormData.day_number,
      title: dayFormData.title,
      description: dayFormData.description,
      city_id: dayFormData.city_id || null,
      sort_order: dayFormData.sort_order
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

  const handleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tourData = {
      day_id: selectedDayId,
      title: tourFormData.title,
      description: tourFormData.description,
      start_time: tourFormData.start_time || null,
      end_time: tourFormData.end_time || null,
      location: tourFormData.location,
      activity_type: tourFormData.activity_type,
      images: tourFormData.images,
      notes: tourFormData.notes,
      sort_order: tourFormData.sort_order
    };

    try {
      if (editingTour) {
        const { error } = await supabase
          .from('day_tours')
          .update(tourData)
          .eq('id', editingTour.id);

        if (error) throw error;
        toast({
          title: 'تم التحديث بنجاح',
          description: 'تم تحديث الجولة بنجاح',
        });
      } else {
        const { error } = await supabase
          .from('day_tours')
          .insert([tourData]);

        if (error) throw error;
        toast({
          title: 'تم الإضافة بنجاح',
          description: 'تم إضافة الجولة الجديدة بنجاح',
        });
      }

      setIsTourDialogOpen(false);
      resetTourForm();
      onDaysUpdate();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حفظ الجولة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDayDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا اليوم؟ سيتم حذف جميع الجولات المرتبطة به.')) return;

    try {
      const { error } = await supabase
        .from('program_days')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف اليوم وجميع جولاته بنجاح',
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

  const handleTourDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الجولة؟')) return;

    try {
      const { error } = await supabase
        .from('day_tours')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف الجولة بنجاح',
      });
      onDaysUpdate();
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف الجولة',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">إدارة أيام برنامج: {program.name}</h3>
          <p className="text-gray-600">تنظيم الأيام والجولات السياحية</p>
        </div>
        
        {canManage && (
          <div className="flex items-center space-x-reverse space-x-2">
            <Dialog open={isDayDialogOpen} onOpenChange={setIsDayDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
                
                <form onSubmit={handleDaySubmit} className="space-y-4">
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
                      placeholder="اليوم الأول: الوصول واستكشاف المدينة"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">وصف اليوم</Label>
                    <Textarea
                      id="description"
                      value={dayFormData.description}
                      onChange={(e) => setDayFormData({...dayFormData, description: e.target.value})}
                      placeholder="وصف تفصيلي لأنشطة اليوم"
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

            <Dialog open={isTourDialogOpen} onOpenChange={setIsTourDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  onClick={resetTourForm}
                  disabled={programDays.length === 0}
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة جولة
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                  <DialogTitle>
                    {editingTour ? 'تعديل الجولة' : 'إضافة جولة جديدة'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTour ? 'قم بتعديل بيانات الجولة' : 'أدخل بيانات الجولة الجديدة'}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleTourSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="day_select">اختر اليوم</Label>
                    <Select 
                      value={selectedDayId} 
                      onValueChange={setSelectedDayId}
                      disabled={!!editingTour}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر اليوم لإضافة الجولة إليه" />
                      </SelectTrigger>
                      <SelectContent>
                        {programDays.map((day) => (
                          <SelectItem key={day.id} value={day.id}>
                            اليوم {day.day_number}: {day.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tour_title">عنوان الجولة</Label>
                    <Input
                      id="tour_title"
                      value={tourFormData.title}
                      onChange={(e) => setTourFormData({...tourFormData, title: e.target.value})}
                      placeholder="جولة المعابد الذهبية"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_time">وقت البداية</Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={tourFormData.start_time}
                        onChange={(e) => setTourFormData({...tourFormData, start_time: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="end_time">وقت النهاية</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={tourFormData.end_time}
                        onChange={(e) => setTourFormData({...tourFormData, end_time: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">الموقع</Label>
                      <Input
                        id="location"
                        value={tourFormData.location}
                        onChange={(e) => setTourFormData({...tourFormData, location: e.target.value})}
                        placeholder="معبد وات فو"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="activity_type">نوع النشاط</Label>
                      <Input
                        id="activity_type"
                        value={tourFormData.activity_type}
                        onChange={(e) => setTourFormData({...tourFormData, activity_type: e.target.value})}
                        placeholder="جولة ثقافية"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tour_description">وصف الجولة</Label>
                    <Textarea
                      id="tour_description"
                      value={tourFormData.description}
                      onChange={(e) => setTourFormData({...tourFormData, description: e.target.value})}
                      placeholder="وصف تفصيلي للجولة وما تتضمنه"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>صور الجولة</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {tourFormData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img src={image} alt={`صورة ${index + 1}`} className="w-full h-16 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 w-4 h-4 p-0"
                            onClick={() => {
                              const newImages = tourFormData.images.filter((_, i) => i !== index);
                              setTourFormData({...tourFormData, images: newImages});
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        className="h-16 border-dashed"
                        onClick={() => {
                          const url = prompt('أدخل رابط الصورة:');
                          if (url) {
                            setTourFormData({...tourFormData, images: [...tourFormData.images, url]});
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات</Label>
                    <Textarea
                      id="notes"
                      value={tourFormData.notes}
                      onChange={(e) => setTourFormData({...tourFormData, notes: e.target.value})}
                      placeholder="ملاحظات إضافية أو تعليمات خاصة"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsTourDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit" disabled={loading || !selectedDayId}>
                      {loading ? 'جاري الحفظ...' : editingTour ? 'تحديث' : 'إضافة'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {programDays.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد أيام</h3>
            <p className="text-gray-500 mb-4">لم يتم إضافة أي أيام لهذا البرنامج بعد</p>
            {canManage && (
              <Button 
                onClick={() => setIsDayDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                إضافة اليوم الأول
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {programDays.map((day) => (
            <Card key={day.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      اليوم {day.day_number}: {day.title}
                    </CardTitle>
                    {day.description && (
                      <CardDescription className="mt-1">{day.description}</CardDescription>
                    )}
                    {cities.find(c => c.id === day.city_id) && (
                      <div className="flex items-center space-x-reverse space-x-2 mt-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600">
                          {cities.find(c => c.id === day.city_id)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {canManage && (
                    <div className="flex items-center space-x-reverse space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDayId(day.id);
                          resetTourForm();
                          setIsTourDialogOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4 ml-1" />
                        إضافة جولة
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDayEdit(day)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDayDelete(day.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                {day.tours.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    لا توجد جولات لهذا اليوم
                  </div>
                ) : (
                  <div className="space-y-3">
                    {day.tours.map((tour) => (
                      <div key={tour.id} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{tour.title}</h4>
                            {tour.description && (
                              <p className="text-gray-600 text-sm mt-1">{tour.description}</p>
                            )}
                            
                            <div className="flex items-center space-x-reverse space-x-4 mt-2 text-sm text-gray-500">
                              {tour.start_time && tour.end_time && (
                                <div className="flex items-center space-x-reverse space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{tour.start_time} - {tour.end_time}</span>
                                </div>
                              )}
                              {tour.location && (
                                <div className="flex items-center space-x-reverse space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{tour.location}</span>
                                </div>
                              )}
                              {tour.activity_type && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {tour.activity_type}
                                </span>
                              )}
                            </div>
                            
                            {tour.images.length > 0 && (
                              <div className="flex items-center space-x-reverse space-x-2 mt-2">
                                <Image className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-500">{tour.images.length} صورة</span>
                              </div>
                            )}
                          </div>
                          
                          {canManage && (
                            <div className="flex items-center space-x-reverse space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleTourEdit(tour)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleTourDelete(tour.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

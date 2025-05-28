
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Clock, MapPin, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface DayToursManagementProps {
  dayId: string;
  dayTitle: string;
  tours: DayTour[];
  onToursUpdate: () => void;
  canManage: boolean;
}

export const DayToursManagement = ({ 
  dayId, 
  dayTitle, 
  tours, 
  onToursUpdate, 
  canManage 
}: DayToursManagementProps) => {
  const [isTourDialogOpen, setIsTourDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<DayTour | null>(null);
  const [loading, setLoading] = useState(false);

  const [tourFormData, setTourFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    activity_type: '',
    notes: ''
  });

  const { toast } = useToast();

  const resetTourForm = () => {
    setTourFormData({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      location: '',
      activity_type: '',
      notes: ''
    });
    setEditingTour(null);
  };

  const handleEditTour = (tour: DayTour) => {
    setEditingTour(tour);
    setTourFormData({
      title: tour.title,
      description: tour.description || '',
      start_time: tour.start_time || '',
      end_time: tour.end_time || '',
      location: tour.location || '',
      activity_type: tour.activity_type || '',
      notes: tour.notes || ''
    });
    setIsTourDialogOpen(true);
  };

  const handleSubmitTour = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tourData = {
      day_id: dayId,
      title: tourFormData.title,
      description: tourFormData.description || null,
      start_time: tourFormData.start_time || null,
      end_time: tourFormData.end_time || null,
      location: tourFormData.location || null,
      activity_type: tourFormData.activity_type || null,
      notes: tourFormData.notes || null,
      sort_order: tours.length + 1,
      images: []
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
      onToursUpdate();
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

  const handleDeleteTour = async (id: string) => {
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
      onToursUpdate();
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف الجولة',
        variant: 'destructive',
      });
    }
  };

  const activityTypes = [
    'زيارة معالم',
    'نشاط ترفيهي',
    'جولة ثقافية',
    'رياضة مائية',
    'تسوق',
    'طعام وشراب',
    'استراحة',
    'انتقال',
    'أخرى'
  ];

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-800">الجولات والأنشطة - {dayTitle}</h4>
        
        {canManage && (
          <Dialog open={isTourDialogOpen} onOpenChange={setIsTourDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onClick={resetTourForm}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة جولة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {editingTour ? 'تعديل الجولة' : 'إضافة جولة جديدة'}
                </DialogTitle>
                <DialogDescription>
                  {editingTour ? 'قم بتعديل بيانات الجولة' : 'أدخل بيانات الجولة الجديدة'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmitTour} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tour_title">عنوان الجولة</Label>
                  <Input
                    id="tour_title"
                    value={tourFormData.title}
                    onChange={(e) => setTourFormData({...tourFormData, title: e.target.value})}
                    placeholder="زيارة المعالم التاريخية"
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
                      placeholder="اسم المكان أو العنوان"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activity_type">نوع النشاط</Label>
                    <Select value={tourFormData.activity_type} onValueChange={(value) => setTourFormData({...tourFormData, activity_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع النشاط" />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tour_description">وصف الجولة</Label>
                  <Textarea
                    id="tour_description"
                    value={tourFormData.description}
                    onChange={(e) => setTourFormData({...tourFormData, description: e.target.value})}
                    placeholder="وصف مفصل للجولة والأنشطة المتضمنة"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <Textarea
                    id="notes"
                    value={tourFormData.notes}
                    onChange={(e) => setTourFormData({...tourFormData, notes: e.target.value})}
                    placeholder="أي ملاحظات أو تعليمات خاصة"
                    rows={2}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsTourDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'جاري الحفظ...' : editingTour ? 'تحديث' : 'إضافة'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-3">
        {tours.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="text-center py-6">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">لم يتم إضافة جولات لهذا اليوم بعد</p>
              {canManage && (
                <Button 
                  size="sm"
                  variant="outline" 
                  onClick={() => setIsTourDialogOpen(true)}
                  className="mt-2"
                >
                  إضافة أول جولة
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          tours.map((tour) => (
            <Card key={tour.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{tour.title}</h5>
                  {canManage && (
                    <div className="flex items-center space-x-reverse space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditTour(tour)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTour(tour.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  {(tour.start_time || tour.end_time) && (
                    <div className="flex items-center space-x-reverse space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {tour.start_time && tour.end_time 
                          ? `${tour.start_time} - ${tour.end_time}`
                          : tour.start_time || tour.end_time
                        }
                      </span>
                    </div>
                  )}
                  
                  {tour.location && (
                    <div className="flex items-center space-x-reverse space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{tour.location}</span>
                    </div>
                  )}
                  
                  {tour.activity_type && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {tour.activity_type}
                    </div>
                  )}
                  
                  {tour.description && (
                    <p className="text-gray-700 mt-2">{tour.description}</p>
                  )}
                  
                  {tour.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                      <p className="text-yellow-800 text-xs">
                        <strong>ملاحظة:</strong> {tour.notes}
                      </p>
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

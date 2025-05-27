
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Plane, UtensilsCrossed, Ticket, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdditionalService {
  id: string;
  name: string;
  description?: string;
  price: number;
  service_type: string;
  is_optional: boolean;
  created_at: string;
}

interface AdditionalServicesManagementProps {
  services: AdditionalService[];
  onServicesUpdate: () => void;
  canManage: boolean;
}

export const AdditionalServicesManagement = ({ 
  services, 
  onServicesUpdate, 
  canManage 
}: AdditionalServicesManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdditionalService | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    service_type: 'other',
    is_optional: true
  });

  const { toast } = useToast();

  const serviceTypes = [
    { value: 'airport_transfer', label: 'نقل المطار', icon: Plane },
    { value: 'meal', label: 'وجبات', icon: UtensilsCrossed },
    { value: 'ticket', label: 'تذاكر', icon: Ticket },
    { value: 'other', label: 'خدمات أخرى', icon: Package }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      service_type: 'other',
      is_optional: true
    });
    setEditingService(null);
  };

  const handleEdit = (service: AdditionalService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      service_type: service.service_type,
      is_optional: service.is_optional
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const serviceData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      service_type: formData.service_type,
      is_optional: formData.is_optional
    };

    try {
      if (editingService) {
        const { error } = await supabase
          .from('additional_services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;
        toast({
          title: 'تم التحديث بنجاح',
          description: 'تم تحديث الخدمة بنجاح',
        });
      } else {
        const { error } = await supabase
          .from('additional_services')
          .insert([serviceData]);

        if (error) throw error;
        toast({
          title: 'تم الإضافة بنجاح',
          description: 'تم إضافة الخدمة الجديدة بنجاح',
        });
      }

      setIsDialogOpen(false);
      resetForm();
      onServicesUpdate();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حفظ الخدمة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;

    try {
      const { error } = await supabase
        .from('additional_services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف الخدمة بنجاح',
      });
      onServicesUpdate();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف الخدمة',
        variant: 'destructive',
      });
    }
  };

  const getServiceIcon = (type: string) => {
    const serviceType = serviceTypes.find(t => t.value === type);
    if (serviceType) {
      const IconComponent = serviceType.icon;
      return <IconComponent className="w-4 h-4" />;
    }
    return <Package className="w-4 h-4" />;
  };

  const getServiceTypeLabel = (type: string) => {
    const serviceType = serviceTypes.find(t => t.value === type);
    return serviceType?.label || 'خدمات أخرى';
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">إدارة الخدمات الإضافية</h3>
          <p className="text-gray-600">إدارة خدمات النقل والوجبات والتذاكر وغيرها</p>
        </div>
        
        {canManage && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة خدمة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
                </DialogTitle>
                <DialogDescription>
                  {editingService ? 'قم بتعديل بيانات الخدمة' : 'أدخل بيانات الخدمة الجديدة'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الخدمة</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="استقبال من المطار"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service_type">نوع الخدمة</Label>
                    <Select value={formData.service_type} onValueChange={(value) => setFormData({...formData, service_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center space-x-reverse space-x-2">
                              <type.icon className="w-4 h-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">السعر (ر.س)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">وصف الخدمة</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="وصف تفصيلي للخدمة وما تتضمنه"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-reverse space-x-2">
                  <input
                    type="checkbox"
                    id="is_optional"
                    checked={formData.is_optional}
                    onChange={(e) => setFormData({...formData, is_optional: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_optional">خدمة اختيارية</Label>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'جاري الحفظ...' : editingService ? 'تحديث' : 'إضافة'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الخدمات الإضافية</CardTitle>
          <CardDescription>جميع الخدمات الإضافية المتاحة للبرامج السياحية</CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد خدمات إضافية</h3>
              <p className="text-gray-500 mb-4">لم يتم إضافة أي خدمات إضافية بعد</p>
              {canManage && (
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  إضافة الخدمة الأولى
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم الخدمة</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">الوصف</TableHead>
                    {canManage && <TableHead className="text-right">الإجراءات</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-reverse space-x-2">
                          {getServiceIcon(service.service_type)}
                          <span>{getServiceTypeLabel(service.service_type)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {service.price.toFixed(2)} ر.س
                      </TableCell>
                      <TableCell>
                        <Badge variant={service.is_optional ? "secondary" : "default"}>
                          {service.is_optional ? 'اختيارية' : 'مطلوبة'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {service.description || '-'}
                      </TableCell>
                      {canManage && (
                        <TableCell>
                          <div className="flex items-center space-x-reverse space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(service)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(service.id)}
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

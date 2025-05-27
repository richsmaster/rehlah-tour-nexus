
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, FolderOpen, MapPin, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface CategoriesManagementProps {
  categories: ProgramCategory[];
  countries: Country[];
  cities: City[];
  onCategoriesUpdate: () => void;
  canManage: boolean;
}

export const CategoriesManagement = ({ 
  categories, 
  countries, 
  cities, 
  onCategoriesUpdate, 
  canManage 
}: CategoriesManagementProps) => {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);
  const [isCityDialogOpen, setIsCityDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProgramCategory | null>(null);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(false);

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: ''
  });

  const [countryFormData, setCountryFormData] = useState({
    name: '',
    code: ''
  });

  const [cityFormData, setCityFormData] = useState({
    name: '',
    country_id: ''
  });

  const { toast } = useToast();

  const resetCategoryForm = () => {
    setCategoryFormData({ name: '', description: '' });
    setEditingCategory(null);
  };

  const resetCountryForm = () => {
    setCountryFormData({ name: '', code: '' });
    setEditingCountry(null);
  };

  const resetCityForm = () => {
    setCityFormData({ name: '', country_id: '' });
    setEditingCity(null);
  };

  const handleEditCategory = (category: ProgramCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || ''
    });
    setIsCategoryDialogOpen(true);
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('program_categories')
          .update(categoryFormData)
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast({
          title: 'تم التحديث بنجاح',
          description: 'تم تحديث الفئة بنجاح',
        });
      } else {
        const { error } = await supabase
          .from('program_categories')
          .insert([categoryFormData]);

        if (error) throw error;
        toast({
          title: 'تم الإضافة بنجاح',
          description: 'تم إضافة الفئة الجديدة بنجاح',
        });
      }

      setIsCategoryDialogOpen(false);
      resetCategoryForm();
      onCategoriesUpdate();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حفظ الفئة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;

    try {
      const { error } = await supabase
        .from('program_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف الفئة بنجاح',
      });
      onCategoriesUpdate();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف الفئة',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">إدارة الفئات والتصنيفات</h3>
          <p className="text-gray-600">إدارة فئات البرامج والدول والمدن</p>
        </div>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">فئات البرامج</TabsTrigger>
          <TabsTrigger value="countries">الدول</TabsTrigger>
          <TabsTrigger value="cities">المدن</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>فئات البرامج السياحية</CardTitle>
                  <CardDescription>تصنيف البرامج حسب النوع والهدف</CardDescription>
                </div>
                
                {canManage && (
                  <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={resetCategoryForm}
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة فئة جديدة
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl" dir="rtl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingCategory ? 'قم بتعديل بيانات الفئة' : 'أدخل بيانات الفئة الجديدة'}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={handleSubmitCategory} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">اسم الفئة</Label>
                          <Input
                            id="name"
                            value={categoryFormData.name}
                            onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                            placeholder="برامج عائلية"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">وصف الفئة</Label>
                          <Textarea
                            id="description"
                            value={categoryFormData.description}
                            onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                            placeholder="وصف تفصيلي لنوع البرامج في هذه الفئة"
                            rows={3}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                            إلغاء
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {loading ? 'جاري الحفظ...' : editingCategory ? 'تحديث' : 'إضافة'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد فئات</h3>
                  <p className="text-gray-500 mb-4">لم يتم إضافة أي فئات بعد</p>
                  {canManage && (
                    <Button 
                      onClick={() => setIsCategoryDialogOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      إضافة الفئة الأولى
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">اسم الفئة</TableHead>
                        <TableHead className="text-right">الوصف</TableHead>
                        {canManage && <TableHead className="text-right">الإجراءات</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {category.description || '-'}
                          </TableCell>
                          {canManage && (
                            <TableCell>
                              <div className="flex items-center space-x-reverse space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditCategory(category)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteCategory(category.id)}
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
        </TabsContent>

        <TabsContent value="countries">
          <Card>
            <CardHeader>
              <CardTitle>الدول المتاحة</CardTitle>
              <CardDescription>إدارة قائمة الدول السياحية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {countries.map((country) => (
                  <div key={country.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-reverse space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{country.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{country.code}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cities">
          <Card>
            <CardHeader>
              <CardTitle>المدن المتاحة</CardTitle>
              <CardDescription>إدارة قائمة المدن السياحية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cities.map((city) => {
                  const country = countries.find(c => c.id === city.country_id);
                  return (
                    <div key={city.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-reverse space-x-2 mb-2">
                        <Building className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{city.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{country?.name}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

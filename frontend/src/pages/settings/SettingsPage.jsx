import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import useAuthStore from '../../store/useAuthStore';
import authApi from '../../api/auth';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });
  const [passForm, setPassForm] = useState({
    old_password: '', new_password: '', new_password_confirm: '',
  });

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePassChange = (e) => {
    setPassForm({ ...passForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profileForm);
      toast.success("Profil yangilandi");
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik");
    } finally { setSaving(false); }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (passForm.new_password !== passForm.new_password_confirm) {
      toast.error("Yangi parollar mos kelmadi");
      return;
    }
    setChangingPass(true);
    try {
      await authApi.changePassword(passForm);
      toast.success("Parol muvaffaqiyatli o'zgartirildi");
      setPassForm({ old_password: '', new_password: '', new_password_confirm: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.errors?.old_password?.[0] || "Xatolik");
    } finally { setChangingPass(false); }
  };

  return (
    <div>
      <PageHeader title="Sozlamalar" subtitle="Profil va xavfsizlik sozlamalari" />

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold border-b pb-3">Profil ma'lumotlari</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{user?.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Rol</p>
            <p className="font-medium text-gray-900">{user?.role_display || user?.role}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Ism" name="first_name" value={profileForm.first_name} onChange={handleProfileChange} required />
            <Input label="Familiya" name="last_name" value={profileForm.last_name} onChange={handleProfileChange} required />
          </div>
          <Input label="Telefon" name="phone" value={profileForm.phone} onChange={handleProfileChange} placeholder="+998901234567" />
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" loading={saving}>Saqlash</Button>
          </div>
        </form>

        {/* Password */}
        <form onSubmit={handlePassSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold border-b pb-3">Parolni o'zgartirish</h3>
          <Input label="Joriy parol" name="old_password" type="password" value={passForm.old_password} onChange={handlePassChange} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Yangi parol" name="new_password" type="password" value={passForm.new_password} onChange={handlePassChange} required />
            <Input label="Yangi parol (takror)" name="new_password_confirm" type="password" value={passForm.new_password_confirm} onChange={handlePassChange} required />
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" loading={changingPass}>Parolni o'zgartirish</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

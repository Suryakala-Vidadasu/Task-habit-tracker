import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { User, Lock, Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { initials, getErrorMessage } from "../utils/helpers";
import api from "../services/api";

const Profile = () => {
  const { user, updateUserInPlace, logout } = useAuth();
  const navigate = useNavigate();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const profileForm = useForm({ defaultValues: { name: user?.name || "" } });
  const passwordForm = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSaveProfile = async ({ name }) => {
    setSavingProfile(true);
    try {
      // PATCH /api/users/me is a natural extension point on the backend for this;
      // wired here so the UI is ready once that endpoint is added.
      await api.put("/auth/me", { name });
      updateUserInPlace({ name });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed");
      passwordForm.reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete("/auth/me");
      toast.success("Account deleted");
      await logout();
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900 dark:text-white">Profile</h1>

      <Card className="mb-5">
        <div className="mb-5 flex items-center gap-4">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-lg font-bold text-white">
              {initials(user?.name || "U")}
            </div>
          )}
          <div>
            <p className="font-display text-base font-semibold text-ink-900 dark:text-white">
              {user?.name}
            </p>
            <p className="text-sm text-ink-900/45 dark:text-white/35">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
          <Input
            label="Full name"
            icon={User}
            {...profileForm.register("name", { required: "Name is required" })}
            error={profileForm.formState.errors.name?.message}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={savingProfile}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>

      <Card className="mb-5">
        <h2 className="mb-4 font-display text-base font-semibold text-ink-900 dark:text-white">
          Change password
        </h2>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
          <Input
            label="Current password"
            type="password"
            icon={Lock}
            {...passwordForm.register("currentPassword", { required: "Required" })}
          />
          <Input
            label="New password"
            type="password"
            icon={Lock}
            {...passwordForm.register("newPassword", {
              required: "Required",
              minLength: { value: 8, message: "At least 8 characters" },
            })}
            error={passwordForm.formState.errors.newPassword?.message}
          />
          <Input
            label="Confirm new password"
            type="password"
            icon={Lock}
            {...passwordForm.register("confirmPassword", { required: "Required" })}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={savingPassword}>
              Update password
            </Button>
          </div>
        </form>
      </Card>

      <Card className="border border-red-500/20">
        <h2 className="mb-1.5 font-display text-base font-semibold text-red-500">Danger zone</h2>
        <p className="mb-4 text-sm text-ink-900/50 dark:text-white/40">
          Deleting your account permanently removes all your tasks and habits. This cannot be undone.
        </p>
        <Button variant="danger" icon={Trash2} onClick={() => setDeleteOpen(true)}>
          Delete account
        </Button>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={deleting}
        title="Delete your account?"
        description="This will permanently delete your account, tasks, and habit history. This action cannot be undone."
        confirmLabel="Delete account"
      />
    </div>
  );
};

export default Profile;

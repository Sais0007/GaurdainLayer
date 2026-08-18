import React from 'react';
import UserForm from './UserForm';
import { toast } from 'sonner';

export interface UserEditProps {
  user: any;
  onBack: () => void;
  onSave?: (updatedUser: any) => void;
}

export default function UserEdit({ user, onBack, onSave }: UserEditProps) {
  const handleSave = (updatedData: any) => {
    toast.success(`Successfully updated user settings for ${updatedData.userAlias || updatedData.name || updatedData.email}`);
    if (onSave) {
      onSave(updatedData);
    } else {
      onBack();
    }
  };

  return (
    <div className="p-6 bg-transparent dark:bg-neutral-950">
      <UserForm
        mode="edit"
        initialUser={user}
        onBack={onBack}
        onSave={handleSave}
      />
    </div>
  );
}

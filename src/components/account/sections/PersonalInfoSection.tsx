import type { User } from 'firebase/auth';
import { LogOut, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CUSTOMER_DISPLAY_NAME_MAX_LENGTH, normalizeCustomerDisplayName } from '@/lib/customer';
import { SectionHeading } from '../shared/primitives';
import { CARD_CLASS, PRIMARY_BUTTON, SECONDARY_BUTTON } from '../shared/styles';

export function PersonalInfoSection({
  profileBusy,
  profileName,
  user,
  onProfileNameChange,
  onSaveProfile,
  onSignOut,
}: {
  profileBusy: boolean;
  profileName: string;
  user: User;
  onProfileNameChange: (name: string) => void;
  onSaveProfile: () => void;
  onSignOut: () => void;
}) {
  const savedName = user.displayName ?? '';
  const nameChanged = normalizeCustomerDisplayName(profileName) !== normalizeCustomerDisplayName(savedName);

  return (
    <section>
      <SectionHeading title="Personal information" detail="The name shown across your Sankhya account and Chotu sign-in." />
      <article className={CARD_CLASS}>
        <form onSubmit={(event) => { event.preventDefault(); onSaveProfile(); }}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12px] font-medium text-[#404b55]">Name</span>
              <input
                type="text"
                value={profileName}
                onChange={(event) => onProfileNameChange(event.target.value)}
                maxLength={CUSTOMER_DISPLAY_NAME_MAX_LENGTH}
                autoComplete="name"
                className="mt-2 min-h-10 w-full rounded-[7px] border border-[#d6dee4] bg-white px-3 text-[13px] text-[#1f2933] outline-none transition focus:border-[#d7b7a5] focus:ring-4 focus:ring-[#f5f0ed]"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-medium text-[#404b55]">Email</span>
              <input
                type="email"
                value={user.email ?? ''}
                readOnly
                className="mt-2 min-h-10 w-full rounded-[7px] border border-[#e1e6ea] bg-[#f7f8f9] px-3 text-[13px] text-[#6b7782] outline-none"
              />
            </label>
          </div>
          <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#e1e6ea] pt-5 sm:flex-row sm:items-center">
            <Button type="submit" disabled={profileBusy || !nameChanged || !normalizeCustomerDisplayName(profileName)} className={PRIMARY_BUTTON}>
              <Save className="size-4" />{profileBusy ? 'Saving' : 'Save changes'}
            </Button>
            <Button type="button" variant="outline" onClick={onSignOut} className={SECONDARY_BUTTON}>
              <LogOut className="size-4" />Sign out
            </Button>
          </div>
        </form>
      </article>
    </section>
  );
}

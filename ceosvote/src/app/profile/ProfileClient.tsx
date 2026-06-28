"use client";

import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import IconOnlyButton from "@/components/common/IconOnlyButton";
import type { PartLeaderCandidate } from "@/types/profile";
interface ProfileClientProps {
  profile: PartLeaderCandidate;
}

export default function ProfileClient({ profile }: ProfileClientProps) {
  const router = useRouter();

  return (
    <div className="app-page">
      <div className="app-container app-page-stack items-start max-[863px]:items-center">
        <AppHeader />

        <section className="profile-card card-surface rounded-20">
          <div className="profile-close-slot">
            <IconOnlyButton onClick={() => router.push("/vote")} />
          </div>

          <div className="profile-top">
            <div className="profile-media-info">
              {/* 이미지 프레임 및 Image 컴포넌트 삭제 완료 */}

              <div className="profile-info">{/* 이름 h2 헤더 삭제 완료 */}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

interface ProfileFieldProps {
  label: string;
  value: string;
}

function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="flex items-start gap-1">
      <span className="shrink-0 text-t20-semibold mobile-text-b16-semibold text-left text-gray-9 [font-feature-settings:'liga'_off,'clig'_off]">
        {label}
      </span>
      <span className="min-w-0 flex-1 text-left text-t20-reg-loose mobile-text-b16-med text-gray-9 [font-feature-settings:'liga'_off,'clig'_off]">
        {value}
      </span>
    </div>
  );
}

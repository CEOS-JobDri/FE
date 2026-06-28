"use client";

import Image from "next/image";
import IconOnlyButton from "@/components/common/IconOnlyButton";
// Import된 타입들을 활용합니다.
import { type PartLeaderPart, type PartLeaderCandidate } from "@/types/profile"; // 경로 확인 필요

interface ProfileViewProps {
  part: PartLeaderPart;
  candidate: PartLeaderCandidate;
  onClose: () => void;
  imageUrl: string;
  name: string;
}

export default function PartLeaderProfileView({
  part,
  candidate,
  onClose,
  imageUrl,
  name,
}: ProfileViewProps) {
  return (
    <section className="profile-card fe-profile-card card-surface rounded-20">
      <div className="profile-close-slot">
        <IconOnlyButton onClick={onClose} />
      </div>

      <div className="profile-top">
        <div className="profile-media-info fe-profile-media-info">
          <div className="profile-image-frame">
            <Image
              // imageUrl이 없을 경우를 대비한 fallback 처리
              src="./profile1.jpg"
              alt={candidate.name || "후보"}
              width={636}
              height={482}
            />
          </div>
          <div className="profile-info fe-profile-info">
            <h2 className="text-h24-bold">{candidate.name}</h2>
            <div className="flex flex-col gap-[5px]">
              <div>팀: {candidate.team}</div>
              <div>파트: {part === "FRONTEND" ? "프론트엔드" : "백엔드"}</div>
              <div>기수: 23기</div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-detail">
        <h3>상세 정보:</h3>
        <p>열심히 하겠습니다!</p>
      </div>
    </section>
  );
}

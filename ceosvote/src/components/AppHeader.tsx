"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import LogoutModal from "@/components/common/LogoutModal";
import TextOnlyButton from "@/components/common/TextOnlyButton";
import { clearToken, getAuthUser } from "@/utils/auth";
import type { UserSummary } from "@/types/auth";

export default function AppHeader() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [user, setUser] = useState<UserSummary | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 직후 유저 정보를 가져와서 세팅합니다.
    setUser(getAuthUser());
    setIsMounted(true);
  }, []);

  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const handleLogout = () => {
    clearToken();
    setUser(null); // 로그아웃 시 유저 상태 초기화
    closeLogoutModal();
    router.push("/login");
  };

  // 서버와 클라이언트가 공통으로 렌더링할 기본 구조를 하나로 통합합니다.
  return (
    <>
      <header className="app-header">
        <Link href="/main" className="neurimbo-head app-header-title">
          CEOS VOTE
        </Link>

        <nav className="app-header-nav">
          <Link href="/vote">
            <TextOnlyButton label="투표하기" size="small" styleType="primary" />
          </Link>

          {/* Hydration 안전 구역: 마운트 여부와 유저 상태에 따라 렌더링 */}
          {!isMounted ? (
            // SSR 및 첫 렌더링 시에는 버튼들 자리만 비워둡니다 (깜빡임 방지용 빈 영역)
            <div style={{ width: "120px", height: "32px" }} />
          ) : user ? (
            // 마운트 완료 & 로그인(유저 정보 있음) 상태
            <>
              {/* 유저의 role이 ADMIN일 때만 ADMIN 버튼 노출 */}
              {user.role === "ADMIN" && (
                <TextOnlyButton
                  label="ADMIN"
                  size="small"
                  styleType="secondary"
                  className="text-text-neutral-default hover:text-text-neutral-default"
                  onClick={() => router.push("/admin")}
                />
              )}
              <TextOnlyButton
                label="로그아웃"
                size="small"
                styleType="secondary"
                className="text-text-neutral-default hover:text-text-neutral-default"
                onClick={() => setIsLogoutModalOpen(true)}
              />
            </>
          ) : (
            // 마운트 완료 & 비로그인 상태
            <Link href="/login">
              <TextOnlyButton
                label="로그인"
                size="small"
                styleType="secondary"
                className="text-text-neutral-default hover:text-text-neutral-default"
              />
            </Link>
          )}
        </nav>
      </header>

      {isLogoutModalOpen && (
        <LogoutModal onCancel={closeLogoutModal} onConfirm={handleLogout} />
      )}
    </>
  );
}

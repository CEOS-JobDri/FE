"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import LogoutModal from "@/components/common/LogoutModal";
import TextOnlyButton from "@/components/common/TextOnlyButton";
import { clearToken, getToken } from "@/utils/auth";

export default function AppHeader() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getToken()));

  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    closeLogoutModal();
    router.push("/login");
  };

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
          {isLoggedIn ? (
            <TextOnlyButton
              label="로그아웃"
              size="small"
              styleType="secondary"
              className="text-text-neutral-default hover:text-text-neutral-default"
              onClick={() => setIsLogoutModalOpen(true)}
            />
          ) : (
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

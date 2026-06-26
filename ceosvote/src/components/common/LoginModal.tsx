"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";
import Button from "@/components/common/Button";
import { login } from "@/services/auth";
import { saveAuthUser, saveToken } from "@/utils/auth";

export default function LoginModal() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loginIdFocused, setLoginIdFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isActive = loginId.length > 0 && password.length > 0;

  const handleLogin = async () => {
    if (!isActive || loading) return;
    setError("");
    setLoading(true);
    try {
      const response = await login({ loginId, password });
      saveToken(response.accessToken);

      if (response.user) {
        saveAuthUser(response.user);
      }

      router.push("/main");
    } catch (e) {
      setError(e instanceof Error ? e.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background-page">
      <div className="flex flex-col items-center gap-8 bg-fill-quaternary-default rounded-20 px-10 py-10 w-70 sm:w-100 shadow-modal">
        {/* 타이틀 */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="neurimbo-head text-fill-primary-default tracking-tight">
            CEOS VOTE
          </h1>
          <p className="neurimbo-body text-text-neutral-description">
            세오스 투표하기
          </p>
        </div>

        {/* 인풋 */}
        <div className="flex flex-col gap-3 w-full">
          <div
            className={clsx(
              "flex items-center gap-2 border rounded-10 px-4 py-3 bg-fill-quaternary-default transition-colors",
              loginIdFocused
                ? "border-fill-primary-default"
                : "border-line-neutral-default",
            )}
          >
            <Icon
              type="PROFILE"
              className="w-5 h-5 text-icon-neutral-assistive shrink-0"
            />
            <input
              className="w-full bg-transparent outline-none text-sub14-reg text-text-neutral-default placeholder:text-text-neutral-disabled"
              placeholder="아이디를 입력해주세요."
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              onFocus={() => setLoginIdFocused(true)}
              onBlur={() => setLoginIdFocused(false)}
            />
          </div>

          <div
            className={clsx(
              "flex items-center gap-2 border rounded-10 px-4 py-3 bg-fill-quaternary-default transition-colors",
              pwFocused
                ? "border-fill-primary-default"
                : "border-line-neutral-default",
            )}
          >
            <Icon
              type="PASSWORD"
              className="w-5 h-5 text-icon-neutral-assistive shrink-0"
            />
            <input
              type="password"
              className="w-full bg-transparent outline-none text-sub14-reg text-text-neutral-default placeholder:text-text-neutral-disabled"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && <p className="text-cap12-med text-red-primary">{error}</p>}
        </div>

        {/* 버튼 */}
        <div className="flex flex-col items-center gap-4 w-full">
          <Button
            label={loading ? "로그인 중..." : "로그인"}
            styleType="secondary"
            size="large"
            active={isActive && !loading}
            className="w-full justify-center"
            onClick={handleLogin}
          />
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-sub14-med text-fill-primary-default hover:opacity-70 transition-opacity"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

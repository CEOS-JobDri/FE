"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";
import Button from "@/components/common/Button";
import {
  // sendEmailVerification,
  // verifyEmailCode,
  signup,
} from "@/services/auth";
import { saveToken } from "@/utils/auth";

type Step = "email" | "verify" | "name" | "password";
type Part = "프론트엔드" | "백엔드";

const MEMBERS: Record<Part, string[]> = {
  프론트엔드: [
    "남기림",
    "김민서",
    "이윤서",
    "구민교",
    "김홍연",
    "오유진",
    "박유민",
    "권오진",
    "이승연",
    "황영준",
  ],
  백엔드: [
    "황신애",
    "최승원",
    "김동욱",
    "임종훈",
    "김태희",
    "최우혁",
    "안준석",
    "김도현",
    "김태익",
    "오지송",
  ],
};

const TEAMS = ["JOBDRI", "IPX", "GROUPEAT", "CONX", "DITDA"] as const;

function InputField({
  label,
  type = "text",
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
  iconType,
  placeholder = "내용을 입력해주세요.",
  disabled = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  iconType: "PROFILE" | "PASSWORD";
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sub14-med text-text-neutral-description">
        {label}
      </label>
      <div
        className={clsx(
          "flex items-center gap-2 border rounded-10 px-4 py-3 transition-colors",
          disabled
            ? "bg-fill-quaternary-assistive border-line-neutral-default"
            : focused
              ? "bg-fill-quaternary-default border-fill-primary-default"
              : "bg-fill-quaternary-default border-line-neutral-default",
        )}
      >
        <Icon
          type={iconType}
          className="w-5 h-5 text-icon-neutral-assistive shrink-0"
        />
        <input
          type={type}
          className="w-full bg-transparent outline-none text-sub14-reg text-text-neutral-default placeholder:text-text-neutral-disabled disabled:text-text-neutral-disabled"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default function SignupModal() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  // const [code, setCode] = useState("");
  const [selectedPart, setSelectedPart] = useState<Part>("프론트엔드");
  const [selectedName, setSelectedName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<(typeof TEAMS)[number]>(
    TEAMS[0],
  );
  const [password, setPassword] = useState("");
  const [loginId, setLoginId] = useState("");
  const [confirm, setConfirm] = useState("");

  const [emailFocused, setEmailFocused] = useState(false);
  // const [codeFocused, setCodeFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [idFocused, setIdFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleSendCode = async () => {
  //   if (!email || loading) return;
  //   setError("");
  //   setLoading(true);
  //   try {
  //     await sendEmailVerification({ email });
  //     setStep("verify");
  //   } catch (e) {
  //     setError(
  //       e instanceof Error ? e.message : "인증번호 발송에 실패했습니다.",
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleVerifyCode = async () => {
  //   if (!code || loading) return;
  //   setError("");
  //   setLoading(true);
  //   try {
  //     await verifyEmailCode({ email, code });
  //     setStep("name");
  //   } catch (e) {
  //     setError(
  //       e instanceof Error ? e.message : "인증번호가 올바르지 않습니다.",
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSignup = async () => {
    if (!password || !confirm || !selectedName || loading) return;
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signup({
        name: selectedName,
        email,
        password,
        loginId,
        part: selectedPart === "프론트엔드" ? "FRONTEND" : "BACKEND",
        team: selectedTeam,
      });
      router.push("/main");
    } catch (e) {
      setError(e instanceof Error ? e.message : "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background-page">
      <div className="flex flex-col items-center gap-8 bg-fill-quaternary-default rounded-20 px-10 py-10 w-[400px] shadow-modal">
        {/* 타이틀 */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="neurimbo-head text-fill-primary-default tracking-tight">
            CEOS VOTE
          </h1>
          <p className="neurimbo-body text-text-neutral-description">
            회원가입
          </p>
        </div>

        {/* Step 1: 이메일 */}
        {step === "email" && (
          <div className="flex flex-col gap-4 w-full">
            <InputField
              label="이메일"
              value={email}
              onChange={setEmail}
              focused={emailFocused}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              iconType="PROFILE"
            />
            {error && (
              <p className="text-cap12-med text-red-primary">{error}</p>
            )}
            <Button
              label={"다음으로"}
              styleType="secondary"
              size="large"
              active={email.length > 0 && !loading}
              className="w-full justify-center"
              onClick={() => setStep("name")}
            />
          </div>
        )}

        {/* Step 2: 인증번호
        {step === "verify" && (
          <div className="flex flex-col gap-4 w-full">
            <InputField
              label="이메일"
              value={email}
              onChange={() => {}}
              focused={false}
              onFocus={() => {}}
              onBlur={() => {}}
              iconType="PROFILE"
              disabled
            />
            <InputField
              label="인증번호"
              value={code}
              onChange={setCode}
              focused={codeFocused}
              onFocus={() => setCodeFocused(true)}
              onBlur={() => setCodeFocused(false)}
              iconType="PASSWORD"
              placeholder="인증번호를 입력해주세요."
            />
            {error && (
              <p className="text-cap12-med text-red-primary">{error}</p>
            )}
            <Button
              label={loading ? "확인 중..." : "인증번호 확인"}
              styleType="tertiary"
              size="large"
              active={code.length > 0 && !loading}
              className="w-full justify-center"
              onClick={handleVerifyCode}
            />
          </div>
        )} */}

        {/* Step 3: 이름 선택 */}
        {step === "name" && (
          <div className="flex flex-col gap-4 w-full">
            {/* 파트 탭 */}
            <div className="flex border border-line-neutral-default rounded-10 overflow-hidden">
              {(["프론트엔드", "백엔드"] as Part[]).map((part) => (
                <button
                  key={part}
                  type="button"
                  onClick={() => {
                    setSelectedPart(part);
                    setSelectedName("");
                  }}
                  className={clsx(
                    "flex-1 py-2 text-sub14-med transition-colors",
                    selectedPart === part
                      ? "bg-fill-primary-default text-text-neutral-white"
                      : "bg-fill-quaternary-default text-text-neutral-description hover:bg-fill-quaternary-assistive",
                  )}
                >
                  {part}
                </button>
              ))}
            </div>

            {/* 이름 그리드 */}
            <div className="grid grid-cols-4 gap-2">
              {MEMBERS[selectedPart].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedName(name)}
                  className={clsx(
                    "py-2 rounded-8 text-sub14-med transition-colors border",
                    selectedName === name
                      ? "bg-fill-primary-default text-text-neutral-white border-fill-primary-default"
                      : "bg-fill-quaternary-default text-text-neutral-description border-line-neutral-default hover:border-fill-primary-default",
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
            <div>
              <p className="neurimbo-body m-2">팀</p>
              <div className="grid grid-cols-4 gap-2 ">
                {TEAMS.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedTeam(name)}
                    className={clsx(
                      "py-2 rounded-8 text-sub14-med transition-colors border",
                      selectedTeam === name
                        ? "bg-fill-primary-default text-text-neutral-white border-fill-primary-default"
                        : "bg-fill-quaternary-default text-text-neutral-description border-line-neutral-default hover:border-fill-primary-default",
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-cap12-med text-red-primary">{error}</p>
            )}
            <Button
              label="다음"
              styleType="secondary"
              size="large"
              active={selectedName.length > 0}
              className="w-full justify-center"
              onClick={() => setStep("password")}
            />
          </div>
        )}

        {/* Step 4: 비밀번호 */}
        {step === "password" && (
          <div className="flex flex-col gap-4 w-full">
            <InputField
              label="아이디"
              type="loginId"
              value={loginId}
              onChange={setLoginId}
              focused={idFocused}
              onFocus={() => setIdFocused(true)}
              onBlur={() => setIdFocused(false)}
              iconType="PASSWORD"
            />
            <InputField
              label="비밀번호"
              type="password"
              value={password}
              onChange={setPassword}
              focused={pwFocused}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
              iconType="PASSWORD"
            />
            <InputField
              label="비밀번호 확인"
              type="password"
              value={confirm}
              onChange={setConfirm}
              focused={confirmFocused}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
              iconType="PASSWORD"
            />
            {error && (
              <p className="text-cap12-med text-red-primary">{error}</p>
            )}
            <Button
              label={loading ? "가입 중..." : "회원가입"}
              styleType="secondary"
              size="large"
              active={password.length > 0 && confirm.length > 0 && !loading}
              className="w-full justify-center"
              onClick={handleSignup}
            />
          </div>
        )}
      </div>
    </div>
  );
}

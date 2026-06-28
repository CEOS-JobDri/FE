"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import useSWR from "swr";
import Button from "@/components/common/Button";
import {
  getCandidates,
  createCandidate,
  deleteCandidate,
} from "@/services/auth";
import { Candidate } from "@/types/auth";
import { getAuthUser } from "@/utils/auth";

type Part = "FRONTEND" | "BACKEND";

export default function AdminPage() {
  const router = useRouter();
  const [selectedPart, setSelectedPart] = useState<Part>("FRONTEND");
  const [newName, setNewName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 권한 검증 상태 관리
  const [isCheckLoading, setIsCheckLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 💡 컴포넌트 마운트 시 getAuthUser()를 통해 "role"이 "ADMIN"인지 확인
  useEffect(() => {
    // 클라이언트 마운트 직후 실행됨
    const user = getAuthUser();

    if (!user || user.role !== "ADMIN") {
      // 유저 정보가 없거나, 역할이 ADMIN이 아니면 모달 띄우기
      setShowAuthModal(true);
    } else {
      // 권한이 확인되면 대시보드 오픈
      setIsCheckLoading(false);
    }
  }, []);

  const {
    data: candidates = [],
    error,
    isLoading,
    mutate,
  } = useSWR(
    !showAuthModal && !isCheckLoading
      ? `/api/admin/candidates?part=${selectedPart}`
      : null,
    () => getCandidates(selectedPart),
  );

  const handleAuthModalConfirm = () => {
    setShowAuthModal(false);
    router.push("/main");
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return alert("이름을 입력해주세요.");
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      await createCandidate({
        name: newName.trim(),
        part: selectedPart,
      });

      setNewName("");
      mutate();

      setTimeout(() => {
        alert("성공적으로 등록되었습니다!");
      }, 100);
    } catch (e) {
      alert("등록 실패: " + (e instanceof Error ? e.message : "오류 발생"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCandidate = async (candidateId: number, name: string) => {
    if (
      !confirm(
        `[경고] ${name} 후보자를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      )
    )
      return;
    if (isProcessing) return;

    const updatedCandidates = candidates.filter((c) => c.id !== candidateId);
    mutate(updatedCandidates, false);

    try {
      setIsProcessing(true);
      await deleteCandidate(candidateId);
      mutate();
    } catch (e) {
      alert("삭제 실패: " + (e instanceof Error ? e.message : "오류 발생"));
      mutate();
    } finally {
      setIsProcessing(false);
    }
  };

  // 깜빡임 방지
  if (isCheckLoading && !showAuthModal) {
    return (
      <div className="min-h-screen bg-background-page flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fill-primary-default"></div>
      </div>
    );
  }

  return (
    <>
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-20 p-8 w-[360px] flex flex-col items-center gap-6 shadow-caption text-center">
            <div className="flex flex-col gap-2">
              <h2 className="text-sub18-med font-bold text-red-primary">
                접근 제한
              </h2>
              <p className="text-sub14-reg text-text-neutral-description whitespace-pre-line">
                어드민 접근 권한이 없습니다.
              </p>
            </div>
            <Button
              label="확인"
              styleType="primary"
              size="large"
              active={true}
              className="w-full justify-center"
              onClick={handleAuthModalConfirm}
            />
          </div>
        </div>
      )}

      {!showAuthModal && (
        <div className="min-h-screen bg-background-page p-6 md:p-12 flex flex-col items-center">
          <div className="w-full max-w-5xl flex flex-col gap-10">
            <header className="flex flex-col gap-2">
              {/* ✨ 추가된 뒤로가기 버튼 */}
              <button
                onClick={() => router.back()}
                className="w-fit flex items-center gap-1 text-sub14-med text-text-neutral-description hover:text-fill-primary-default transition-colors mb-2"
              >
                ← 뒤로가기
              </button>
              <h1 className="neurimbo-head text-4xl text-fill-primary-default">
                관리자 대시보드
              </h1>
              <p className="text-text-neutral-description">
                후보자 등록 및 득표 현황을 실시간으로 관리합니다.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* 1. 컨트롤 섹션 */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <label className="text-sub14-med text-text-neutral-description ml-1">
                    파트 선택
                  </label>
                  <div className="flex bg-fill-quaternary-default border border-line-neutral-default rounded-12 overflow-hidden p-1">
                    {(["FRONTEND", "BACKEND"] as Part[]).map((part) => (
                      <button
                        key={part}
                        onClick={() => setSelectedPart(part)}
                        className={clsx(
                          "flex-1 py-2.5 rounded-10 text-sub14-med transition-all",
                          selectedPart === part
                            ? "bg-fill-primary-default text-white "
                            : "text-text-neutral-description hover:bg-fill-quaternary-assistive",
                        )}
                      >
                        {part === "FRONTEND" ? "프론트엔드" : "백엔드"}
                      </button>
                    ))}
                  </div>
                </section>

                {/* 후보자 등록 폼 */}
                <section className="bg-white p-6 rounded-20  border border-line-neutral-default">
                  <h2 className="text-sub18-med font-bold mb-4">후보자 추가</h2>
                  <form
                    onSubmit={handleAddCandidate}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label className="text-cap12-med text-text-neutral-description">
                        이름
                      </label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-line-neutral-default rounded-10 text-sub14-reg outline-none focus:border-fill-primary-default transition-colors"
                        placeholder="후보자 성함 입력"
                      />
                    </div>

                    <Button
                      label={isProcessing ? "처리 중..." : "신규 등록"}
                      styleType="primary"
                      size="large"
                      active={newName.length > 0 && !isLoading && !isProcessing}
                      className="w-full justify-center mt-2"
                      type="submit"
                    />
                  </form>
                </section>
              </div>

              {/* 2. 리스트 섹션 */}
              <div className="lg:col-span-8 bg-white p-6 rounded-20  border border-line-neutral-default min-h-[500px]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-sub18-med font-bold">
                    {selectedPart === "FRONTEND" ? "프론트엔드" : "백엔드"}{" "}
                    후보자 현황
                  </h2>
                  <span className="text-sub14-reg text-text-neutral-disabled">
                    총 {candidates.length}명
                  </span>
                </div>

                {isLoading && candidates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-text-neutral-disabled gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fill-primary-default"></div>
                    <p>데이터 로딩 중...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-64 text-red-primary border-2 border-dashed border-red-200 rounded-12">
                    <p>{error.message}</p>
                  </div>
                ) : candidates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-text-neutral-disabled border-2 border-dashed border-line-neutral-default rounded-12">
                    <p>등록된 후보자가 없습니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidates.map((person) => (
                      <div
                        key={person.id}
                        className="flex justify-between items-center p-4 border border-line-neutral-default rounded-12 "
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sub16-med font-bold">
                              {person.name}
                            </span>
                          </div>
                          <p className="text-sub14-med text-fill-primary-default">
                            득표 수 : {person.voteCount}표
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteCandidate(person.id, person.name)
                          }
                          className="p-2 text-sub14-med text-text-neutral-disabled hover:text-red-primary transition-colors"
                          title="삭제"
                          disabled={isProcessing}
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

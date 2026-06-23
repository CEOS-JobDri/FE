import type { VotePoll } from "@/types/vote";

const mockVotePoll: VotePoll = {
  id: "popular-vote",
  title: "인기투표",
  candidates: [
    {
      id: "pororo",
      name: "뽀로로",
      imageUrl: "/profile1.jpg",
    },
    {
      id: "crong",
      name: "크롱",
      imageUrl: "/profile1.jpg",
    },
    {
      id: "eddy",
      name: "에디",
      imageUrl: "/profile1.jpg",
    },
    {
      id: "loopy",
      name: "루피",
      imageUrl: "/profile1.jpg",
    },
  ],
  results: {
    pororo: 0,
    crong: 0,
    eddy: 0,
    loopy: 0,
  },
  votedCandidateId: null,
};

export async function getVotePoll(): Promise<VotePoll> {
  return {
    ...mockVotePoll,
    candidates: mockVotePoll.candidates.map((candidate) => ({ ...candidate })),
    results: { ...mockVotePoll.results },
  };
}

export async function submitVote(
  poll: VotePoll,
  candidateId: string,
): Promise<VotePoll> {
  return {
    ...poll,
    results: {
      ...poll.results,
      [candidateId]: (poll.results[candidateId] ?? 0) + 1,
    },
    votedCandidateId: candidateId,
  };
}

export async function resetVotePoll(poll: VotePoll): Promise<VotePoll> {
  return {
    ...poll,
    results: Object.fromEntries(
      poll.candidates.map((candidate) => [candidate.id, 0]),
    ),
    votedCandidateId: null,
  };
}

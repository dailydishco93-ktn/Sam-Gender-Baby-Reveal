export type VoteTarget = "boy" | "girl";

export interface Voter {
  name: string;
  vote: VoteTarget;
  timestamp: number;
}

export type AppPhase = "voting" | "countdown" | "spinning" | "reveal";

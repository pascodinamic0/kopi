export type QAResult = {
  ok: boolean;
  checks: { id: string; title: string; ok: boolean; detail?: string }[];
};


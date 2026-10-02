export type Category = "model" | "product" | "research" | "industry" | "policy";

export interface SourceLink {
  name: string;
  url: string;
}

export interface TrendEntry {
  id: string;
  date: string; // YYYY-MM-DD, collection date
  category: Category;
  title: string;
  summary: string;
  sources: SourceLink[];
  terms: string[]; // glossary keys referenced in title/summary
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  origin?: string;
}

export type Glossary = Record<string, GlossaryTerm>;

export const CATEGORY_LABEL: Record<Category, string> = {
  model: "모델",
  product: "제품/서비스",
  research: "연구",
  industry: "산업/비즈니스",
  policy: "정책/안전",
};

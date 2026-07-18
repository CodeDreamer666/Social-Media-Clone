export const interestValues = [
  "Coding",
  "Design",
  "Psychology",
  "Finance",
  "Books",
  "Study",
  "Productivity",
  "Life_thoughts",
  "Business",
  "Art",
  "Technology",
  "Self_improvement",
] as const;

export type InterestValue = (typeof interestValues)[number];

export const interestOptions: { label: string; value: InterestValue }[] = [
  { label: "Coding", value: "Coding" },
  { label: "Design", value: "Design" },
  { label: "Psychology", value: "Psychology" },
  { label: "Finance", value: "Finance" },
  { label: "Books", value: "Books" },
  { label: "Study", value: "Study" },
  { label: "Productivity", value: "Productivity" },
  { label: "Life thoughts", value: "Life_thoughts" },
  { label: "Business", value: "Business" },
  { label: "Art", value: "Art" },
  { label: "Technology", value: "Technology" },
  { label: "Self improvement", value: "Self_improvement" },
];

export function getInterestLabel(interest: string | null) {
  return (
    interestOptions.find((option) => option.value === interest)?.label ??
    "Uncategorized"
  );
}

export function getFeedInterests(interests: InterestValue[]) {
  return interests.length === 3 ? interests : [];
}

export interface PoemStyle {
  id: string;
  label: string;
  poet: string;
  description: string;
  instruction: string;
}

export const POEM_STYLES: PoemStyle[] = [
  {
    id: "free-verse",
    label: "Free Verse",
    poet: "Maya Angelou",
    description: "Expressive and powerful",
    instruction:
      "Write in the style of Maya Angelou — free verse, powerful imagery, warm and uplifting. Use vivid metaphors and a rhythmic, confident voice. 4–8 lines.",
  },
  {
    id: "haiku",
    label: "Haiku",
    poet: "Matsuo Bashō",
    description: "Minimal and contemplative",
    instruction:
      "Write in the style of Matsuo Bashō — a traditional haiku (5-7-5 syllable structure, 3 lines). Capture a single vivid moment with nature imagery. Be serene and contemplative.",
  },
  {
    id: "sonnet",
    label: "Sonnet",
    poet: "Shakespeare",
    description: "Dramatic and lyrical",
    instruction:
      "Write in the style of Shakespeare — a short excerpt of a sonnet (4–6 lines) with iambic pentameter, rhyming couplets, and dramatic flair. Use 'thee' and 'thou' sparingly for flavor.",
  },
  {
    id: "limerick",
    label: "Limerick",
    poet: "Edward Lear",
    description: "Witty and playful",
    instruction:
      "Write in the style of Edward Lear — a limerick (5 lines, AABBA rhyme scheme). Be humorous, whimsical, and lighthearted. Make it fun and clever.",
  },
  {
    id: "beat",
    label: "Beat",
    poet: "Allen Ginsberg",
    description: "Raw and energetic",
    instruction:
      "Write in the style of Allen Ginsberg and the Beat poets — raw, energetic, stream-of-consciousness. Use long lines, exclamation, and rebellious optimism. 4–6 lines.",
  },
  {
    id: "romantic",
    label: "Romantic",
    poet: "Emily Dickinson",
    description: "Intimate and mysterious",
    instruction:
      "Write in the style of Emily Dickinson — short dashes, slant rhyme, intimate and mysterious tone. Capitalize important Nouns for emphasis. 4–6 lines.",
  },
];

export const DEFAULT_STYLE = POEM_STYLES[0];

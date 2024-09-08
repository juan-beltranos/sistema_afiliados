interface CharactersAndScenarios {
  theme: string;
  character: string;
  scenario: string;
}

interface ColoringBook {
  theme: string;
  numberOfImages: number;
  key: string;
  language: string;
  difficulty: string;
  format: string;
  publishAmazon: boolean;
  category: string;
}

interface LanguagePrompts {
  title: string;
  subtitle: string;
  keywords: string;
  description: string;
}

export type { CharactersAndScenarios, ColoringBook, LanguagePrompts };

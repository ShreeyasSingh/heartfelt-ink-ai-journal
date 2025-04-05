
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  userId: string;
  isPublished: boolean;
  publishId?: string;
  images: string[];
  mood?: string;
  tags: string[];
  style: JournalStyle;
}

export interface JournalStyle {
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
}

export interface AIResponse {
  answer: string;
  isLoading: boolean;
  error: string | null;
}

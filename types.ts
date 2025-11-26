
export interface Chapter {
  id: number;
  title: string;
  wordCount: number;
  active?: boolean;
}

export interface RevisionSegment {
    type: 'original' | 'revised';
    content: string;
    reason?: string;
}

export interface RevisionChangeCard {
    title: string;
    type: 'logic' | 'character' | 'pacing';
    before: string;
    after: string;
    description: string;
}

export interface FinalRevision {
    revisedText: RevisionSegment[];
    // New metrics for visualization
    stats: {
        logic: { before: number; after: number };
        pacing: { before: number; after: number };
        expectation: { before: number; after: number };
    };
    changes: RevisionChangeCard[];
}

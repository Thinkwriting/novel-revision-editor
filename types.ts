
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

// 全书设定
export interface BookSettings {
    tags: string[];           // 标签：悬疑、言情、仙侠等
    channel: string;          // 频道：番茄、起点、晋江等
    corePlot: string;         // 核心梗
    corePlotConfirmed: boolean; // 用户是否确认
}

// 平台数据分析结果
export interface PlatformDataAnalysis {
    hasData: boolean;
    clickRate?: number;       // 点击率
    retentionRate?: number;   // 留存率
    readerFeedback: string[]; // 评论区提取的读者反馈
    painPoints: string[];     // 识别的痛点
    readerWants: string[];    // 读者想看什么
}

// 偏差检测结果
export interface DeviationAnalysis {
    deviationScore: number;   // 偏离度 0-100
    deviationReason: string;  // 偏离原因
    returnSuggestions: string[]; // 回归主线建议
    currentChapterRole: 'rising' | 'falling' | 'climax' | 'transition'; // 当前章节节奏定位
}

// 归因分析点
export interface AttributionPoint {
    position: number;         // 在文中的位置百分比
    type: 'attract' | 'dropout'; // 吸引点还是劝退点
    plotDescription: string;  // 对应的具体情节
    reason: string;           // 原因分析
}

// 诊断报告
export interface DiagnosticReport {
    bookSettings: BookSettings;
    platformAnalysis: PlatformDataAnalysis;
    deviationAnalysis: DeviationAnalysis;
    attributionPoints: AttributionPoint[];
    readerExpectation: string;  // 读者期待
    chapterSatisfaction: number; // 本章满足度 0-100
}

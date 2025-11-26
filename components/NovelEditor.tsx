
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import AIAuditForm, { AuditConfig } from './AIAuditForm';
import RevisionResultDisplay from './RevisionResultDisplay';
import { Book, Edit, PenTool, Mic, Film, Loader, Layers, ArrowLeft, CheckCircle, Star, Crown } from './Icons';
import { marked } from 'marked';
import { FinalRevision, RevisionSegment } from '../types';


const initialNovelText = `周屿接过书，翻开第一页。他站在那里读了很久，最后把书买下了。

苏瑶在书店工作三个月后，生活逐渐有了规律。每天早上九点开门，晚上七点关门，中间的时间她负责整理书架、接待顾客、偶尔推荐几本书。书店老板很少过问她的私事，只是偶尔提醒她多休息。

周屿成了书店的常客。他每周来两次，总在文字区停留很久。有时候他会拿起一本书翻几页，有时候只是站在书架前发呆。苏瑶注意到他总是选择靠窗的位置，阳光洒在他身上的时候，他会微微眯起眼睛。

“这本书怎么样？”周屿有一次拿着一本书集问她。

苏瑶看了看封面：“我没读过，但作者的另一本散文集不错。”

周屿点点头，把书放回书架：“你推荐什么？”

苏瑶想了想，从旁边抽出一本薄薄的小说：“这本。讲一个人在城市里寻找失去的记忆。”

周屿接过书，翻开第一页。他站在那里读了很久，最后把书买下了。

“谢谢推荐。”他说，“下次来告诉你读后感。”`;

const EditorButton: React.FC<{ children: React.ReactNode, active?: boolean, onClick?: () => void }> = ({ children, active, onClick }) => {
    const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 border flex-shrink-0";
    const activeClasses = "bg-custom-secondary text-white border-custom-secondary";
    const inactiveClasses = "bg-white text-custom-primary border-custom-primary hover:bg-yellow-50";
    
    return (
        <button onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    );
};

// Updated to Fanqie/Platform Style Curve
const ReaderInterestCurve = () => (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mt-6 mb-6">
        <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-gray-800 flex items-center text-sm">
                <span className="mr-2 text-lg">📉</span> 读者留存与情绪监控
            </h3>
            <div className="flex space-x-3 text-xs">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-400 mr-1"></span>情绪值</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-300 mr-1"></span>留存基准</span>
            </div>
        </div>
       
        <div className="relative h-48 w-full">
             <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                {/* Grid lines */}
                <line x1="0" y1="150" x2="400" y2="150" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="0" y1="0" x2="0" y2="150" stroke="#f3f4f6" strokeWidth="1" />
                <text x="5" y="10" fontSize="10" fill="#9ca3af">100%</text>
                <text x="5" y="145" fontSize="10" fill="#9ca3af">0%</text>
                
                {/* Retention Benchmark Line (Gray dashed) */}
                <path d="M0,50 Q200,60 400,80" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4 4" />

                {/* The Curve */}
                <path 
                    d="M0,120 C40,120 60,130 100,130 C140,130 160,80 200,60 C240,40 280,100 320,30 C360,-20 400,50 400,50" 
                    fill="none" 
                    stroke="#f4a261" 
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                
                {/* Area under curve */}
                <path 
                     d="M0,120 C40,120 60,130 100,130 C140,130 160,80 200,60 C240,40 280,100 320,30 C360,-20 400,50 400,50 L400,150 L0,150 Z"
                     fill="url(#gradient)"
                     opacity="0.2"
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f4a261" />
                        <stop offset="100%" stopColor="#fff" />
                    </linearGradient>
                </defs>
                
                {/* Points of Interest - Platform Specific Pain Points */}
                {/* Drop off point */}
                <circle cx="100" cy="130" r="4" fill="#ef4444" stroke="white" strokeWidth="2" />
                <line x1="100" y1="130" x2="100" y2="90" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
                <g transform="translate(100, 85)">
                    <rect x="-40" y="-12" width="80" height="16" rx="4" fill="#fee2e2" />
                    <text textAnchor="middle" y="0" fontSize="9" fill="#b91c1c" fontWeight="bold">⚠ 跳出点: 黄金三秒未达标</text>
                </g>
                
                {/* Cool point */}
                <circle cx="320" cy="30" r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                <g transform="translate(320, 15)">
                     <rect x="-30" y="-12" width="60" height="16" rx="4" fill="#d1fae5" />
                    <text textAnchor="middle" y="0" fontSize="9" fill="#047857" fontWeight="bold">★ 完读率提升点</text>
                </g>
             </svg>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-red-50 p-2 rounded text-xs text-red-700">
                <span className="font-bold">平台痛点诊断:</span> 开篇前300字留存率预估低于平均值15%，建议加强冲突。
            </div>
            <div className="bg-green-50 p-2 rounded text-xs text-green-700">
                <span className="font-bold">吸睛指数:</span> 85/100。结尾悬念设置符合“番茄”追读算法逻辑。
            </div>
        </div>
    </div>
);

// Diagnostic Report Card Component - 去AI味优化版
const DiagnosticReportCard = () => {
    return (
        <div className="relative bg-[#fffdf5] border-2 border-[#f4e4bc] rounded-xl overflow-hidden shadow-sm mb-6 font-sans">
            {/* Header / Badge */}
            <div className="bg-[#faecd8] p-4 flex justify-between items-center border-b border-[#f4e4bc]">
                <div className="flex items-center space-x-2">
                    <div className="bg-white p-1.5 rounded-full border border-orange-200 shadow-sm">
                        <span className="text-xl">📝</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[#8c6b48]">深度诊断报告</h2>
                        <p className="text-xs text-[#a68b6c]">诊断时间: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-[#a68b6c] uppercase font-bold tracking-wider">综合评分</div>
                    <div className="flex text-yellow-500">
                        <Star className="w-4 h-4" />
                        <Star className="w-4 h-4" />
                        <Star className="w-4 h-4" />
                        <Star className="w-4 h-4" />
                        <Star className="w-4 h-4 text-gray-300" />
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-8">
                {/* Intro - 去AI味 */}
                <div className="bg-white p-4 rounded-lg border border-[#f4e4bc] text-sm text-gray-700 leading-relaxed shadow-sm relative">
                    <span className="absolute -top-2 -left-2 text-2xl">📋</span>
                    <span className="font-bold text-orange-600 ml-4">诊断摘要：</span>
                    本章《书店来客》整体框架完整，文笔流畅。经分析发现：<span className="text-green-600 font-medium">文字细腻度较高</span>，但<span className="text-red-600 font-medium">开篇300字留存风险较大</span>，结尾悬念钩子不足。详见以下分析：
                </div>

                {/* Section 1: Positioning */}
                <div>
                    <h3 className="flex items-center text-base font-bold text-[#8c6b48] mb-4 uppercase tracking-wide border-b border-[#f4e4bc] pb-2">
                        <span className="w-1 h-5 bg-orange-400 mr-2 rounded-full"></span>
                        第一部分：核心卖点识别
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Core Trope - 改为具体情节概括 */}
                        <div className="bg-white p-4 rounded-xl border border-dashed border-orange-200">
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                🧩 核心梗概提炼
                            </h4>
                            {/* 具体情节概括而非空洞标签 */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100 mb-3">
                                <p className="text-sm text-gray-800 font-medium leading-relaxed">
                                    "神秘常客固定时间造访书店，与店员产生微妙联系，身份成谜"
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">日常悬疑</span>
                                <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-xs">身份反差</span>
                                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">暗线推进</span>
                            </div>
                            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                <span className="font-bold">卖点分析：</span> 这类"熟悉的陌生人"设定在晋江/番茄有稳定受众，关键是要在前三章揭示身份线索制造追读欲。
                            </div>
                        </div>

                        {/* Benchmark - 深度对比 */}
                        <div className="bg-white p-4 rounded-xl border border-dashed border-orange-200">
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                📚 对标作品分析
                            </h4>
                            <div className="space-y-3">
                                {/* 对标书1 - 详细分析 */}
                                <div className="bg-gray-50 p-2 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-gray-800">《他来了，请闭眼》</span>
                                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">高度相似</span>
                                    </div>
                                    <p className="text-[11px] text-gray-600">相似点：神秘男主+日常场景+身份悬疑</p>
                                    <p className="text-[11px] text-blue-600 font-medium">成功关键：开篇即抛出"犯罪侧写师"身份钩子</p>
                                </div>
                                {/* 对标书2 */}
                                <div className="bg-gray-50 p-2 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-gray-800">《余生，请多指教》</span>
                                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">部分相似</span>
                                    </div>
                                    <p className="text-[11px] text-gray-600">相似点：治愈系日常+细水长流</p>
                                    <p className="text-[11px] text-blue-600 font-medium">成功关键：女主职业特殊性带来持续看点</p>
                                </div>
                            </div>
                            <p className="text-[11px] text-orange-600 mt-2 font-medium">💡 建议：借鉴前者的悬念铺设节奏</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Deep Audit */}
                <div>
                    <h3 className="flex items-center text-base font-bold text-[#8c6b48] mb-4 uppercase tracking-wide border-b border-[#f4e4bc] pb-2">
                        <span className="w-1 h-5 bg-red-500 mr-2 rounded-full"></span>
                        第二部分：问题定位与修改建议
                    </h3>

                    <div className="space-y-4">
                        {/* Logic Flaw - Diagram */}
                        <div className="bg-red-50 rounded-xl p-4 border border-red-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">严重</div>
                            <h4 className="text-sm font-bold text-red-800 mb-3 flex items-center">
                                🚫 结构问题：段落重复
                            </h4>
                            <div className="flex items-center justify-center space-x-2 mb-3 bg-white/60 p-2 rounded-lg">
                                <div className="text-center">
                                    <div className="text-xs text-gray-500 mb-1">开篇第一段</div>
                                    <div className="bg-white border border-gray-300 p-2 rounded text-xs text-gray-400 line-through">周屿接过书...</div>
                                </div>
                                <div className="text-red-500 text-xl font-bold">=</div>
                                <div className="text-center">
                                    <div className="text-xs text-gray-500 mb-1">倒数第二段</div>
                                    <div className="bg-white border border-gray-300 p-2 rounded text-xs text-gray-400 line-through">周屿接过书...</div>
                                </div>
                            </div>
                            <p className="text-xs text-red-700 bg-red-100/50 p-2 rounded">
                                <span className="font-bold">影响：</span> 读者易误认为排版错误而流失。<span className="font-bold">建议：</span> 删除开篇重复段落，或改写为不同视角。
                            </p>
                        </div>

                        {/* Pacing & Hook - VS Comparison */}
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 relative">
                            <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">中等</div>
                            <h4 className="text-sm font-bold text-yellow-800 mb-3 flex items-center">
                                ⚡ 结尾钩子不足
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/60 p-2 rounded">
                                    <div className="text-xs text-gray-500 font-bold mb-1">❌ 当前结尾</div>
                                    <p className="text-xs text-gray-600">"下次来告诉你读后感" —— 缺乏悬念，无追读动力</p>
                                </div>
                                <div className="bg-white p-2 rounded border border-yellow-200 shadow-sm relative">
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full p-0.5"><Star className="w-3 h-3"/></div>
                                    <div className="text-xs text-yellow-700 font-bold mb-1">✅ 建议方向</div>
                                    <p className="text-xs text-gray-800">增加悬念元素，如暗示男主身份、留下谜题等</p>
                                </div>
                            </div>
                        </div>

                        {/* Character Design - Profile Cards */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center">
                                👥 人物塑造分析
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center bg-white p-2 rounded shadow-sm">
                                    <span className="text-lg mr-2">👩</span>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-gray-800">女主 苏瑶：主动性不足</div>
                                        <div className="text-[10px] text-gray-500">当前表现过于被动，缺乏内心戏和主观判断。</div>
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">增加心理描写</span>
                                </div>
                                <div className="flex items-center bg-white p-2 rounded shadow-sm">
                                    <span className="text-lg mr-2">👨</span>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-gray-800">男主 周屿：神秘感缺乏支撑</div>
                                        <div className="text-[10px] text-gray-500">行为怪异但缺乏细节铺垫，显得刻意。</div>
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">增加具体怪癖</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Summary / Direction */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200 shadow-sm relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-orange-900 mb-1">📌 总结</h4>
                            <p className="text-xs text-orange-700">本章基础扎实，主要问题在于开篇节奏和结尾钩子。修复重复段落、强化悬念后，留存率预计可提升30%以上。</p>
                        </div>
                        <div className="animate-bounce text-orange-400">
                            <span className="text-2xl">👇</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mockRevision: FinalRevision = {
    revisedText: [
        { type: 'original', content: '苏瑶在书店工作三个月后，生活逐渐有了规律。每天早上九点开门，晚上七点关门，中间的时间她负责整理书架、接待顾客、偶尔推荐几本书。\n\n' },
        { type: 'revised', content: '周屿成了书店最奇怪的常客。无论刮风下雨，他每周二和周五下午两点准时出现，雷打不动。', reason: '具体化了“常客”的概念，增加了“刮风下雨”和“准时出现”的细节，瞬间建立起人物的偏执感和神秘感。' },
        { type: 'original', content: '他总在文字区停留很久，有时候只是站在书架前发呆。苏瑶注意到他总是选择靠窗的位置，午后的阳光镀在他身上，会让他平日里略显冷峻的轮廓柔和下来。\n\n“这本书怎么样？”周屿有一次拿着一本诗集问她。\n\n' },
        { type: 'revised', content: '苏瑶这次没忍住，在他再次拿起那本《失落的信号》时走了过去：“先生，这本书你已经看了十二次了，还没决定买吗？”\n\n周屿的手指顿了一下，转头看向她，眼神里没有被拆穿的尴尬，反而多了一丝玩味：“我在等它即使被翻烂了，也没人买走的那一刻。”', reason: '彻底重写了对话。原版是无聊的推销，改版让苏瑶主动出击（打破摄像头人设），周屿的回答则充满了戏剧张力和潜台词，瞬间拉满了两人之间的推拉感。' },
        { type: 'revised', content: '\n\n苏瑶愣住了。周屿笑了笑，第一次没有把书放回去，而是拿着它走向柜台：“不过今天不用等了。结账吧。”\n\n他付完款，将书推回给苏瑶，压低声音说道：“帮我保管好。这本书里，少了一页代码，只有你能找得到。”\n\n说完，他转身推门而去，留下苏瑶对着那本塑封完好的新书，后背发凉。', reason: '【黄金三秒钩子】这是最关键的改动！删除了平淡的“下次告诉你读后感”，改为“书里少页代码”+“只有你能找到”的悬疑钩子。这不仅制造了巨大的悬念（完好的书为什么少页？为什么只有她能找到？），直接锁死了读者的追读欲望，符合番茄/起点的留存逻辑。' }
    ],
    stats: {
        logic: { before: 55, after: 98 },
        pacing: { before: 60, after: 95 },
        expectation: { before: 65, after: 99 }
    },
    changes: [
        {
            title: '主角去NPC化',
            type: 'character',
            before: '被动问答 (这本书怎么样?)',
            after: '主动博弈 (看了12次还不买?)',
            description: '女主不再是背景板，主动挑起话头，瞬间立住“观察敏锐、性格直率”的人设。'
        },
        {
            title: '植入黄金钩子',
            type: 'logic',
            before: '平淡道别 (下次聊)',
            after: '惊悚悬疑 (少了一页代码)',
            description: '在结尾处植入强悬念，直接拉高读者的期待值，有效提升完读率和次日留存。'
        }
    ]
};

// --- New Component: Technical Progress Visualizer (替代虚假群聊) ---
interface AgentProcessVisualizerProps {
    onComplete: () => void;
    type: 'audit' | 'revision';
    masterName?: string;
}

interface ProcessStep {
    label: string;
    description: string;
    icon: string;
}

const AgentProcessVisualizer: React.FC<AgentProcessVisualizerProps> = ({ onComplete, type, masterName }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [stepProgress, setStepProgress] = useState(0);

    // 审稿流程步骤 - 技术化描述
    const auditSteps: ProcessStep[] = [
        {
            label: '文本预处理',
            description: '正在进行分词与句法分析，提取核心语义结构...',
            icon: '📊'
        },
        {
            label: '剧情逻辑拓扑分析',
            description: '构建情节关系图谱，检测因果链断裂与逻辑漏洞...',
            icon: '🔍'
        },
        {
            label: '爆款数据库比对',
            description: '正在比对千万级爆款小说数据库，匹配相似题材与成功模式...',
            icon: '📚'
        },
        {
            label: '读者情绪曲线建模',
            description: '模拟读者阅读心理，构建情绪波动曲线与留存预测模型...',
            icon: '📈'
        },
        {
            label: '商业化潜力评估',
            description: '分析付费卡点设置、黄金三章留存率、追读指数...',
            icon: '💰'
        },
        {
            label: '生成诊断报告',
            description: '汇总分析结果，生成深度诊断报告...',
            icon: '📝'
        }
    ];

    // 改稿流程步骤
    const getRevisionStyleName = (val?: string) => {
        if (!val) return '通用优化';
        if (val.includes('tangjia')) return '强化冲突模式';
        if (val.includes('chendong')) return '宏大叙事模式';
        if (val.includes('feiwo')) return '情感深化模式';
        return '通用优化模式';
    };

    const styleName = getRevisionStyleName(masterName);

    const revisionSteps: ProcessStep[] = [
        {
            label: '原文结构解析',
            description: '解析段落结构、对话分布、叙事节奏...',
            icon: '🔬'
        },
        {
            label: '问题定位修复',
            description: '定位诊断报告中标记的问题点，制定修复方案...',
            icon: '🔧'
        },
        {
            label: `应用${styleName}`,
            description: `正在注入${styleName}的叙事技法与文风特征...`,
            icon: '✨'
        },
        {
            label: '文字精修润色',
            description: '优化遣词造句，增强感官描写，提升文字质感...',
            icon: '✍️'
        },
        {
            label: '生成对比报告',
            description: '生成修改前后对比与改动说明...',
            icon: '📋'
        }
    ];

    const steps = type === 'audit' ? auditSteps : revisionSteps;

    useEffect(() => {
        if (currentStep < steps.length) {
            // 模拟每个步骤的进度
            const progressInterval = setInterval(() => {
                setStepProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + 5;
                });
            }, 80);

            // 步骤完成后进入下一步
            const stepTimer = setTimeout(() => {
                setStepProgress(0);
                setCurrentStep(prev => prev + 1);
            }, 1800);

            return () => {
                clearInterval(progressInterval);
                clearTimeout(stepTimer);
            };
        } else {
            // 全部完成
            const finishTimer = setTimeout(() => {
                onComplete();
            }, 500);
            return () => clearTimeout(finishTimer);
        }
    }, [currentStep, steps.length, onComplete]);

    const overallProgress = Math.round(((currentStep + stepProgress / 100) / steps.length) * 100);

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white rounded-lg relative overflow-hidden">
            {/* 顶部总进度条 */}
            <div className="bg-white border-b border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center">
                        <Loader className="w-4 h-4 mr-2 animate-spin text-custom-primary" />
                        {type === 'audit' ? '深度诊断分析中' : '智能改稿处理中'}
                    </h3>
                    <span className="text-sm font-bold text-custom-primary">{Math.min(overallProgress, 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-custom-primary to-orange-400 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
            </div>

            {/* 步骤列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isPending = index > currentStep;

                    return (
                        <div
                            key={index}
                            className={`p-4 rounded-xl border transition-all duration-300 ${
                                isCompleted
                                    ? 'bg-green-50 border-green-200'
                                    : isActive
                                        ? 'bg-blue-50 border-blue-200 shadow-sm'
                                        : 'bg-gray-50 border-gray-100 opacity-50'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl">{step.icon}</span>
                                    <span className={`font-bold text-sm ${
                                        isCompleted ? 'text-green-700' : isActive ? 'text-blue-700' : 'text-gray-400'
                                    }`}>
                                        {step.label}
                                    </span>
                                </div>
                                {isCompleted && (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                                {isActive && (
                                    <span className="text-xs text-blue-600 font-medium">{stepProgress}%</span>
                                )}
                            </div>

                            {(isActive || isCompleted) && (
                                <p className={`text-xs ml-8 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                                    {isCompleted ? '已完成' : step.description}
                                </p>
                            )}

                            {isActive && (
                                <div className="mt-2 ml-8">
                                    <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-100"
                                            style={{ width: `${stepProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {currentStep >= steps.length && (
                    <div className="text-center py-6 animate-in zoom-in duration-300">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <p className="text-green-700 font-bold">
                            {type === 'audit' ? '诊断分析完成！' : '改稿处理完成！'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">正在加载结果...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Component ---

const NovelEditor: React.FC = () => {
    const [showRightPanel, setShowRightPanel] = useState(false);
    const [originalText, setOriginalText] = useState(initialNovelText);
    const [revisionStep, setRevisionStep] = useState<'audit' | 'loadingReport' | 'reportAndRevisionSetup' | 'loadingRevision' | 'result'>('audit');
    
    const [auditConfig, setAuditConfig] = useState<AuditConfig>({
        editor: 'focus-commercial',
        linkChapters: [],
        uploadedFiles: [],
    });
    
    const [revisionMaster, setRevisionMaster] = useState('author-tangjia');
    const [customRequest, setCustomRequest] = useState('');

    const [finalRevision, setFinalRevision] = useState<FinalRevision | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleToggleRevision = () => {
        const willShow = !showRightPanel;
        setShowRightPanel(willShow);
        
        if (willShow) {
             // Reset state when opening tool
            setRevisionStep('audit');
            setFinalRevision(null);
            setError('');
            setIsLoading(false);
            setAuditConfig({ editor: 'focus-commercial', linkChapters: [], uploadedFiles: [] });
        }
    };

    const handleGenerateDiagnostic = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setRevisionStep('loadingReport');
        setError('');
        // The AgentProcessVisualizer will handle the timing and call onComplete
    };

    const onDiagnosticComplete = () => {
        setRevisionStep('reportAndRevisionSetup');
        setIsLoading(false);
    };

    const handleGenerateRevision = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setRevisionStep('loadingRevision');
        setError('');
        // The AgentProcessVisualizer will handle the timing and call onComplete
    };

    const onRevisionComplete = () => {
         setFinalRevision(mockRevision);
         setRevisionStep('result');
         setIsLoading(false);
    };

    const handleAcceptRevision = () => {
        if (finalRevision) {
            const cleanText = finalRevision.revisedText.map(segment => segment.content).join('');
            setOriginalText(cleanText);
            setShowRightPanel(false); // Close panel on accept
        }
    };

    const handleBackToReport = () => {
        setRevisionStep('reportAndRevisionSetup');
    };
    
    const renderRightPanelContent = () => {
        // Special Case: Visualized workflow for the report generation
        if (revisionStep === 'loadingReport') {
            return <AgentProcessVisualizer onComplete={onDiagnosticComplete} type="audit" />;
        }

        // Special Case: Visualized workflow for the revision generation
        if (revisionStep === 'loadingRevision') {
            return <AgentProcessVisualizer onComplete={onRevisionComplete} type="revision" masterName={revisionMaster} />;
        }

        if (isLoading) {
             return (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Loader className="w-12 h-12 animate-spin mb-4" />
                    <p className="text-lg font-medium text-gray-700">
                        处理中...
                    </p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-red-500">
                   <p>{error}</p>
                   <button onClick={() => setRevisionStep('audit')} className="mt-4 bg-gray-200 text-gray-700 px-4 py-1 rounded-lg text-sm hover:bg-gray-300">返回重试</button>
               </div>
           );
        }

        switch (revisionStep) {
            case 'audit':
                return <AIAuditForm config={auditConfig} setConfig={setAuditConfig} onSubmit={handleGenerateDiagnostic} />;
            
            case 'reportAndRevisionSetup':
                return (
                     <div className='space-y-6 pb-10'>
                        {/* New Diagnostic Report Card */}
                        <DiagnosticReportCard />
                        
                        {/* Visual Data: Reader Interest Curve */}
                        <ReaderInterestCurve />

                        {/* Revision Setup */}
                        <div className="border-t-2 border-gray-100 mt-8 pt-6">
                             <h2 className="text-xl font-bold mb-4 text-custom-text flex items-center"><span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mr-2">STEP 2</span> 选择改稿风格</h2>
                             <div className="bg-white border border-gray-200 p-6 rounded-lg space-y-4 shadow-sm relative">
                                <div>
                                    <label htmlFor="revision-master" className="text-base font-bold text-gray-800">改稿风格</label>
                                    <p className="text-sm text-gray-500 mb-2">根据诊断结果，选择适合的改稿方向</p>
                                    <select id="revision-master" value={revisionMaster} onChange={e => setRevisionMaster(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-custom-primary focus:border-custom-primary bg-white text-sm">
                                        <option value="author-tangjia">强化冲突型（适合节奏偏慢的章节）</option>
                                        <option value="author-chendong">宏大叙事型（适合世界观构建）</option>
                                        <option value="author-feiwo">情感深化型（适合情感线薄弱的章节）</option>
                                    </select>
                                </div>
                                <div>
                                     <label htmlFor="custom-request" className="text-base font-bold text-gray-800">自定义需求</label>
                                      <p className="text-sm text-gray-500 mb-2">输入您的具体要求，改稿更精准</p>
                                    <textarea 
                                        id="custom-request"
                                        rows={3}
                                        className="w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-custom-primary focus:border-custom-primary bg-white"
                                        placeholder="例如：请让女主的性格更活泼一点..."
                                        value={customRequest}
                                        onChange={(e) => setCustomRequest(e.target.value)}
                                    />
                                </div>
                                
                                {/* One-Click Revision Button */}
                                <div className="pt-2">
                                    <button onClick={handleGenerateRevision} className="w-full bg-gradient-to-r from-custom-primary to-custom-primary-hover text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex justify-center items-center">
                                        <PenTool className="w-4 h-4 mr-2" />
                                        开始智能改稿
                                    </button>
                                </div>
                             </div>
                        </div>
                    </div>
                );

            case 'result':
                return finalRevision ? <RevisionResultDisplay revision={finalRevision} /> : <p>未找到修改结果。</p>;

            default:
                return null;
        }
    };

    return (
        <>
        <style>
            {`
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            ::-webkit-scrollbar-track {
                background: transparent; 
            }
            ::-webkit-scrollbar-thumb {
                background: #e5e7eb; 
                border-radius: 10px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #d1d5db; 
            }
            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            `}
        </style>
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8">
            <div className="flex items-center mb-6 flex-shrink-0 w-full">
                 <div className="flex items-center w-full">
                    <div className="flex items-center space-x-3 flex-grow overflow-x-auto no-scrollbar">
                        <EditorButton>AI小说大纲</EditorButton>
                        <EditorButton active={showRightPanel} onClick={handleToggleRevision}>小说改稿精修器</EditorButton>
                        <EditorButton>小说扩写</EditorButton>
                        <EditorButton>小说改写</EditorButton>
                        <EditorButton>小说润色</EditorButton>
                        <EditorButton>小说视频教程</EditorButton>
                    </div>
                    <button className="ml-auto bg-custom-secondary text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition shadow-sm flex-shrink-0">导出</button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden space-x-6">
                {/* Left Panel: Original Text */}
                <div className={`flex flex-col ${showRightPanel ? 'w-1/2' : 'w-full'} transition-all duration-300 min-h-0`}>
                    <div className="bg-white border border-custom-border rounded-t-lg px-4 py-3 font-bold text-base text-gray-800 border-b-0">
                        原始文本
                    </div>
                    <textarea
                        value={originalText}
                        onChange={(e) => setOriginalText(e.target.value)}
                        className="flex-1 w-full text-base leading-loose p-6 border border-custom-border rounded-b-lg resize-none focus:outline-none focus:ring-2 focus:ring-custom-primary bg-white text-gray-900 shadow-sm"
                        readOnly={showRightPanel}
                    />
                </div>

                {/* Right Panel: Revision and AI tools */}
                {showRightPanel && (
                    <div className="w-1/2 min-h-0 flex flex-col animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-white border border-custom-border rounded-t-lg px-4 py-3 font-bold text-base text-gray-800 flex justify-between items-center border-b-0">
                        <div className="flex items-center">
                            {revisionStep === 'result' && (
                                <button onClick={handleBackToReport} className="mr-2 p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors" title="返回诊断报告">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            )}
                            <span>{revisionStep === 'audit' ? 'AI审稿智能团队' : '诊断与修改'}</span>
                        </div>
                        
                        {revisionStep === 'result' && (
                                <div>
                                    <button onClick={() => setShowRightPanel(false)} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs hover:bg-gray-200 mr-2 border border-gray-300">取消</button>
                                    <button onClick={handleAcceptRevision} className="bg-custom-primary text-white px-3 py-1 rounded-md text-xs hover:bg-custom-primary-hover shadow-sm">确认修改</button>
                                </div>
                        )}
                        </div>
                        <div className="flex-1 w-full text-base leading-loose p-4 sm:p-6 border border-custom-border rounded-b-lg overflow-y-auto bg-gray-50 shadow-sm relative">
                            {renderRightPanelContent()}
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default NovelEditor;

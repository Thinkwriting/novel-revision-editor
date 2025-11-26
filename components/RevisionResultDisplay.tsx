
import React from 'react';
import { FinalRevision } from '../types';
import { Star } from './Icons';

interface RevisionResultDisplayProps {
    revision: FinalRevision;
}

const ProgressBar: React.FC<{ label: string; before: number; after: number; color: string }> = ({ label, before, after, color }) => (
    <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
            <span className="font-bold text-gray-600">{label}</span>
            <span className="font-bold" style={{ color: color }}>+{after - before}% 提升</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
            <div style={{ width: `${before}%` }} className="h-full bg-gray-400 opacity-30"></div>
            <div style={{ width: `${after - before}%`, backgroundColor: color }} className="h-full animate-pulse"></div>
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>原: {before}</span>
            <span>现: {after}</span>
        </div>
    </div>
);

const ChangeCard: React.FC<{ title: string; type: string; before: string; after: string; description: string }> = ({ title, type, before, after, description }) => {
    const isLogic = type === 'logic';
    const borderColor = isLogic ? 'border-green-200' : 'border-blue-200';
    const bgColor = isLogic ? 'bg-green-50' : 'bg-blue-50';
    const icon = isLogic ? '🔧' : '⚡';

    return (
        <div className={`p-3 rounded-lg border ${borderColor} ${bgColor} mb-3`}>
            <div className="flex items-center mb-2">
                <span className="mr-2 text-lg">{icon}</span>
                <h4 className="font-bold text-sm text-gray-800">{title}</h4>
            </div>
            <div className="flex items-center justify-between text-xs mb-2 bg-white/60 p-2 rounded">
                <div className="text-gray-500 line-through truncate w-5/12 text-center">{before}</div>
                <div className="text-gray-400">➔</div>
                <div className="text-gray-900 font-bold truncate w-5/12 text-center">{after}</div>
            </div>
            <p className="text-xs text-gray-600 leading-tight">{description}</p>
        </div>
    );
}

const RevisionResultDisplay: React.FC<RevisionResultDisplayProps> = ({ revision }) => {
    return (
        <div className="space-y-6">
            {/* Header - 去AI味 */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                 <div className="relative z-10">
                    <h2 className="text-lg font-bold flex items-center mb-1 text-indigo-900">
                        <span className="mr-2">✅</span> 改稿完成
                    </h2>
                    <p className="text-xs text-indigo-700">已完成逻辑优化与文字润色，请查看修改详情。</p>
                </div>
            </div>

            {/* Metrics & Cards Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Metrics */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-800 mb-3 border-b pb-2">📈 质量指标对比</h3>
                    {revision.stats && (
                        <>
                            <ProgressBar label="剧情逻辑" before={revision.stats.logic.before} after={revision.stats.logic.after} color="#10b981" />
                            <ProgressBar label="阅读期待" before={revision.stats.expectation.before} after={revision.stats.expectation.after} color="#f59e0b" />
                            <ProgressBar label="节奏把控" before={revision.stats.pacing.before} after={revision.stats.pacing.after} color="#3b82f6" />
                        </>
                    )}
                </div>

                {/* Right: Key Changes */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                     <h3 className="text-sm font-bold text-gray-800 mb-3 border-b pb-2">🛠️ 主要修改点</h3>
                     {revision.changes && revision.changes.map((change, idx) => (
                         <ChangeCard key={idx} {...change} />
                     ))}
                </div>
            </div>

            {/* Text Comparison */}
            <div>
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-gray-800">📝 修改对比</h3>
                    <div className="flex space-x-2 text-xs">
                        <span className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>修改处</span>
                        <span className="flex items-center"><span className="w-2 h-2 bg-blue-100 rounded-full mr-1"></span>修改说明</span>
                    </div>
                 </div>
                <div
                    className="prose prose-sm max-w-none bg-white border border-gray-200 p-6 rounded-xl shadow-sm leading-8 text-gray-800"
                    style={{whiteSpace: 'pre-wrap'}}
                >
                    {revision.revisedText.map((segment, index) => {
                        if (segment.type === 'revised') {
                            return (
                                <span key={index} className="relative group cursor-help">
                                    <strong className="text-red-600 font-semibold bg-red-50 px-1 rounded border-b-2 border-red-200 hover:bg-red-100 transition-colors">
                                        {segment.content}
                                    </strong>
                                    {segment.reason && (
                                        <span className="hidden group-hover:block absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-blue-600 text-white text-xs rounded-lg shadow-xl animate-in zoom-in duration-200">
                                            <span className="font-bold block mb-1 border-b border-blue-400 pb-1">💡 修改说明:</span>
                                            {segment.reason}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-blue-600"></div>
                                        </span>
                                    )}
                                </span>
                            );
                        }
                        return <span key={index} className="text-gray-500">{segment.content}</span>;
                    })}
                </div>
            </div>
        </div>
    );
};

export default RevisionResultDisplay;

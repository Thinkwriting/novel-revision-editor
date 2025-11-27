
import React, { useState } from 'react';
import { UploadCloud, File, Trash, Link, ChevronRight, ChevronLeft, UserCheck, ChevronDown, Crown, X, Edit, CheckCircle } from './Icons';
import { BookSettings } from '../types';

export interface AuditConfig {
    editor: string;
    linkChapters: number[];
    uploadedFiles: File[];
    bookSettings: BookSettings;
}

interface AIAuditFormProps {
    config: AuditConfig;
    setConfig: React.Dispatch<React.SetStateAction<AuditConfig>>;
    onSubmit: () => void;
}

// 预设标签选项
const TAG_OPTIONS = [
    { value: 'xuanhuan', label: '玄幻' },
    { value: 'yanqing', label: '言情' },
    { value: 'xuanyi', label: '悬疑' },
    { value: 'dushi', label: '都市' },
    { value: 'lishi', label: '历史' },
    { value: 'kehuan', label: '科幻' },
    { value: 'xiuxian', label: '修仙' },
    { value: 'youxi', label: '游戏' },
    { value: 'danmei', label: '耽美' },
    { value: 'nvzun', label: '女尊' },
];

// 预设频道选项
const CHANNEL_OPTIONS = [
    { value: 'fanqie', label: '番茄小说', style: '快节奏、强冲突、黄金三章' },
    { value: 'qidian', label: '起点中文网', style: '设定流、升级流、长线布局' },
    { value: 'jinjiang', label: '晋江文学城', style: '情感细腻、CP感、文笔优美' },
    { value: 'zhihu', label: '知乎盐选', style: '反转、脑洞、现实向' },
    { value: 'qimao', label: '七猫小说', style: '甜宠、轻松、节奏明快' },
];

// Mocking the 6 chapters present in the sidebar
const chapters = [
    { id: 1, title: '第一章 云端初遇' },
    { id: 2, title: '第二章 甜蜜陷阱' },
    { id: 3, title: '第三章 病院惊魂' },
    { id: 4, title: '第四章 反攻计划' },
    { id: 5, title: '第五章 真实之芯' },
    { id: 6, title: '第六章 书店来客' },
];

const ITEMS_PER_PAGE = 4;

const AIAuditForm: React.FC<AIAuditFormProps> = ({ config, setConfig, onSubmit }) => {
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const [chapterPage, setChapterPage] = useState(0);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [vipPreference, setVipPreference] = useState('fanqie');
  const [isEditingCorePlot, setIsEditingCorePlot] = useState(false);
  const [tempCorePlot, setTempCorePlot] = useState('');

  const totalPages = Math.ceil(chapters.length / ITEMS_PER_PAGE);
  const currentChapters = chapters.slice(chapterPage * ITEMS_PER_PAGE, (chapterPage + 1) * ITEMS_PER_PAGE);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
        setConfig(prev => ({ ...prev, uploadedFiles: [...prev.uploadedFiles, ...Array.from(event.target.files!)]}));
        event.target.value = ''; // Allow re-uploading the same file
    }
  };

  const removeFile = (fileToRemove: File) => {
    setConfig(prev => ({...prev, uploadedFiles: prev.uploadedFiles.filter(file => file !== fileToRemove)}));
  };

  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChapterPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChapterPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const toggleChapter = (id: number) => {
      setConfig(prev => {
          const exists = prev.linkChapters.includes(id);
          if (exists) {
              return { ...prev, linkChapters: prev.linkChapters.filter(cId => cId !== id) };
          } else {
              return { ...prev, linkChapters: [...prev.linkChapters, id] };
          }
      });
  };

  const toggleTag = (tagValue: string) => {
      setConfig(prev => {
          const currentTags = prev.bookSettings.tags;
          const exists = currentTags.includes(tagValue);
          const newTags = exists
              ? currentTags.filter(t => t !== tagValue)
              : [...currentTags, tagValue];
          return {
              ...prev,
              bookSettings: { ...prev.bookSettings, tags: newTags }
          };
      });
  };

  const setChannel = (channelValue: string) => {
      setConfig(prev => ({
          ...prev,
          bookSettings: { ...prev.bookSettings, channel: channelValue }
      }));
  };

  const confirmCorePlot = () => {
      setConfig(prev => ({
          ...prev,
          bookSettings: {
              ...prev.bookSettings,
              corePlot: tempCorePlot || prev.bookSettings.corePlot,
              corePlotConfirmed: true
          }
      }));
      setIsEditingCorePlot(false);
  };

  const startEditCorePlot = () => {
      setTempCorePlot(config.bookSettings.corePlot);
      setIsEditingCorePlot(true);
  };

  const getSelectedText = () => {
      if (config.linkChapters.length === 0) return '未关联 (仅诊断当前章节)';
      const count = config.linkChapters.length;
      const firstTitle = chapters.find(c => c.id === config.linkChapters[0])?.title || '';
      if (count === 1) return firstTitle;
      return `${firstTitle} 等 ${count} 章`;
  };

  const handleVipConnect = () => {
      setIsVipModalOpen(false);
      alert('已为您提交VIP连线申请！专业编辑将在5分钟内联系您��');
  };

  return (
    <>
    <div className="space-y-6 text-custom-text h-full flex flex-col">
        {/* Feature Intro Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm flex-shrink-0">
            <div className="flex items-start space-x-3">
                <div className="bg-white p-1.5 rounded-full shadow-sm border border-blue-100 flex-shrink-0">
                    <span className="text-lg">👩‍💻</span>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-blue-800 mb-1">欢迎使用小说改稿精修器！</h3>
                    <p className="text-xs text-blue-600 leading-relaxed">
                        我是您的专属写作顾问。还在为小说没流量、留存低发愁吗？
                        <br/>
                        我们的流程是：<span className="font-bold">① 深度审稿诊断</span> (找出病灶) → <span className="font-bold">② 匹配大神风格</span> (对症下药) → <span className="font-bold">③ 手把手精修</span> (完美蜕变)。
                        <br/>
                        让我先来帮您做个全身体检吧！
                    </p>
                </div>
            </div>
        </div>

        <div className='flex-1 space-y-5 overflow-y-auto pr-2 min-h-0'>
            {/* 诊断预览 */}
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">本次诊断将包含：</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <span className="flex items-center">✅ 全书定位分析</span>
                    <span className="flex items-center">✅ 核心梗偏差检测</span>
                    <span className="flex items-center">✅ 读者心理曲线模拟</span>
                    <span className="flex items-center">✅ 平台数据联动诊断</span>
                </div>
            </div>

            {/* 第一步：全书设定 - 核心新增 */}
            <div className="space-y-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                    <label className="text-base font-bold flex items-center space-x-2 text-blue-800">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                        <span>全书设定（重要）</span>
                    </label>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">先全书，后章节</span>
                </div>
                <p className="text-xs text-blue-700 -mt-1">明确全书定位后，AI才能准确判断本章是否偏离主线</p>

                {/* 标签选择 */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">作品标签（可多选）</label>
                    <div className="flex flex-wrap gap-2">
                        {TAG_OPTIONS.map(tag => {
                            const isSelected = config.bookSettings.tags.includes(tag.value);
                            return (
                                <button
                                    key={tag.value}
                                    onClick={() => toggleTag(tag.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                        isSelected
                                            ? 'bg-blue-500 text-white shadow-sm'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                                    }`}
                                >
                                    {tag.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 频道选择 */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">目标平台/频道</label>
                    <div className="space-y-2">
                        {CHANNEL_OPTIONS.map(channel => {
                            const isSelected = config.bookSettings.channel === channel.value;
                            return (
                                <label
                                    key={channel.value}
                                    className={`flex items-center p-2.5 rounded-lg cursor-pointer transition-all ${
                                        isSelected
                                            ? 'bg-white border-2 border-blue-400 shadow-sm'
                                            : 'bg-white/50 border border-gray-200 hover:border-blue-200'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="channel"
                                        value={channel.value}
                                        checked={isSelected}
                                        onChange={() => setChannel(channel.value)}
                                        className="mr-2 text-blue-500"
                                    />
                                    <div className="flex-1">
                                        <span className="font-medium text-sm text-gray-800">{channel.label}</span>
                                        <span className="text-xs text-gray-500 ml-2">({channel.style})</span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* 核心梗输入 - 关键功能 */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                        <span>全书核心梗</span>
                        {config.bookSettings.corePlotConfirmed && (
                            <span className="text-xs text-green-600 flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" /> 已确认
                            </span>
                        )}
                    </label>
                    {isEditingCorePlot ? (
                        <div className="space-y-2">
                            <textarea
                                value={tempCorePlot}
                                onChange={(e) => setTempCorePlot(e.target.value)}
                                placeholder="请输入全书的核心卖点/梗，例如：重生复仇、甜宠日常、无限流升级..."
                                className="w-full p-3 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
                                rows={3}
                            />
                            <div className="flex space-x-2">
                                <button
                                    onClick={confirmCorePlot}
                                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                                >
                                    确认核心梗
                                </button>
                                <button
                                    onClick={() => setIsEditingCorePlot(false)}
                                    className="px-4 bg-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={startEditCorePlot}
                            className="p-3 bg-white border border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition group"
                        >
                            {config.bookSettings.corePlot ? (
                                <div className="flex items-start justify-between">
                                    <p className="text-sm text-gray-700">{config.bookSettings.corePlot}</p>
                                    <Edit className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0 ml-2" />
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 flex items-center">
                                    <Edit className="w-4 h-4 mr-2" />
                                    点击输入全书核心梗（AI将检测本章是否偏离）
                                </p>
                            )}
                        </div>
                    )}
                    <p className="text-xs text-orange-600 mt-1.5 bg-orange-50 p-2 rounded">
                        ⚠️ 重要：AI将根据此核心梗检测本章剧情是否偏离主线，请认真填写
                    </p>
                </div>
            </div>

            {/* 第二步：改稿方向选择 */}
            <div className="space-y-3">
                <label htmlFor="editor-select" className="text-base font-bold flex items-center space-x-2">
                    <span className="bg-custom-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    <span>选择诊断方向</span>
                </label>
                <p className="text-xs text-gray-500 -mt-2 mb-2">根据您的需求，选择最适合的诊断侧重点</p>

                <select
                    id="editor-select"
                    value={config.editor}
                    onChange={(e) => setConfig(prev => ({...prev, editor: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-custom-primary focus:border-custom-primary transition text-sm"
                >
                    <option value="focus-commercial">商业化优化【侧重：黄金三章 / 留存率提升 / 付费卡点】</option>
                    <option value="focus-plot">剧情结构【侧重：节奏把控 / 冲突设计 / 悬念铺设】</option>
                    <option value="focus-worldview">世界观构建【侧重：创新设定 / 逻辑自洽 / 反套路】</option>
                    <option value="focus-emotion">情感深度【侧重：人物弧光 / 情感细腻度 / CP感营造】</option>
                </select>

                {/* VIP进阶版 */}
                <div className="rounded-xl p-0.5 bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsVipModalOpen(true)}>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-[10px] p-3 flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-bold text-purple-900 flex items-center">
                                <Crown className="w-4 h-4 mr-1 text-yellow-500" />
                                【VIP 进阶版】
                            </h3>
                            <p className="text-xs text-purple-700 mt-0.5">
                                想要专属人工编辑审稿？点击连线专业编辑
                            </p>
                        </div>
                        <button className="bg-white text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:bg-purple-100 transition border border-purple-100">
                            立即连线 →
                        </button>
                    </div>
                </div>
            </div>

            {/* 第三步：关联章节 */}
            <div className="space-y-3">
                <label className="text-base font-bold flex items-center space-x-2">
                    <span className="bg-custom-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                    <span>关联章节</span>
                </label>

                <div className="bg-slate-50 border-l-4 border-slate-400 p-2 rounded-r-md">
                     <p className="text-xs text-slate-700 font-medium leading-relaxed">
                         <span className="font-bold mr-1">💡 提示：</span>
                         默认<span className="font-bold text-slate-900">仅诊断当前章节</span>。勾选关联章节可提升40%准确率。
                     </p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)}
                        className="w-full text-left p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition text-gray-700 flex justify-between items-center text-sm"
                    >
                        <span className="truncate">{getSelectedText()}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isChapterDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {isChapterDropdownOpen && (
                        <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                            <div className="flex items-center justify-between mb-2 px-1">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={chapterPage === 0}
                                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-xs text-gray-400">第 {chapterPage + 1} / {totalPages} 页</span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={chapterPage === totalPages - 1}
                                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {currentChapters.map(ch => {
                                    const isSelected = config.linkChapters.includes(ch.id);
                                    return (
                                        <button
                                            key={ch.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleChapter(ch.id);
                                            }}
                                            className={`text-left px-3 py-2 text-xs rounded-md border transition-colors ${
                                                isSelected
                                                ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="truncate block">{ch.title}</span>
                                                {isSelected && <span className="text-blue-500 text-xs">✓</span>}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 第四步：上传平台数据 */}
            <div className="space-y-3">
                <label className="text-base font-bold flex items-center space-x-2">
                    <span className="bg-custom-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                    <span>上传平台数据 (可选)</span>
                </label>
                <p className="text-xs text-gray-500">上传后台数据截图或评论区截图，AI将进行精细化分析</p>

                {/* 数据类型说明 */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-green-50 p-2 rounded text-center">
                        <span className="block text-green-600 font-bold">📊 点击率</span>
                        <span className="text-gray-500">分析标题吸引力</span>
                    </div>
                    <div className="bg-blue-50 p-2 rounded text-center">
                        <span className="block text-blue-600 font-bold">📈 留存率</span>
                        <span className="text-gray-500">定位跳出章节</span>
                    </div>
                    <div className="bg-purple-50 p-2 rounded text-center">
                        <span className="block text-purple-600 font-bold">💬 评论区</span>
                        <span className="text-gray-500">提取读者期待</span>
                    </div>
                </div>

                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-500 hover:bg-gray-50 hover:border-custom-primary hover:text-custom-primary transition-colors">
                    <UploadCloud className="w-6 h-6 mb-1" />
                    <span>点击或拖拽文件上传</span>
                </label>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} />
                {config.uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                        <ul className="max-h-24 overflow-y-auto bg-gray-50 p-2 rounded-md border">
                            {config.uploadedFiles.map((file, index) => (
                                <li key={index} className="flex items-center justify-between bg-white p-2 rounded text-sm group even:bg-gray-50">
                                    <div className='flex items-center space-x-2 overflow-hidden'>
                                        <File className="w-4 h-4 text-gray-500 flex-shrink-0"/>
                                        <span className="truncate text-gray-700">{file.name}</span>
                                    </div>
                                    <button onClick={() => removeFile(file)} className="text-gray-400 hover:text-red-600 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>

        <div className="flex-shrink-0 pt-4">
             <button 
                onClick={onSubmit} 
                className="w-full bg-custom-primary text-white px-8 py-3 rounded-lg text-base font-semibold hover:bg-custom-primary-hover transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
            >
                开始深度诊断
            </button>
        </div>
    </div>

    {/* VIP Connection Modal */}
    {isVipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 border-b border-purple-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-purple-900 flex items-center">
                         <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                         专属人工编辑连线
                    </h3>
                    <button onClick={() => setIsVipModalOpen(false)} className="text-purple-400 hover:text-purple-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4 font-bold">
                        为您匹配到以下在线编辑，请选择：
                    </p>
                    <div className="space-y-3 mb-6">
                         {[
                            { id: 'qidian', name: '起点专业编辑-慧慧', desc: '深耕玄幻/仙侠，节奏把控一流' },
                            { id: 'fanqie', name: '番茄金牌主编-蓝心', desc: '脑洞文/爽文专家，专治黄金三章' },
                            { id: 'zhihu', name: '知乎短文主编-eric', desc: '反转/脑洞/现实主义，文笔犀利' },
                            { id: 'qimao', name: '七猫黄金编辑-可轩', desc: '女频/言情/甜宠，情感细腻' },
                            { id: 'jinjiang', name: '晋江王牌编辑-方方', desc: '纯爱/无限流/剧情向，人设塑造' }
                         ].map(editor => (
                            <label key={editor.id} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${vipPreference === editor.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="vipPref" value={editor.id} checked={vipPreference === editor.id} onChange={() => setVipPreference(editor.id)} className="mr-3 text-purple-600 focus:ring-purple-500"/>
                                <div>
                                    <span className="font-bold text-gray-800 text-sm block">{editor.name}</span>
                                    <span className="text-xs text-gray-500">{editor.desc}</span>
                                </div>
                            </label>
                         ))}
                    </div>
                    <button onClick={handleVipConnect} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg shadow-md hover:opacity-90 transition-opacity">
                        确认连线 (当前排队: 1人)
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};

export default AIAuditForm;

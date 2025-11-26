
import React, { useState } from 'react';
import { UploadCloud, File, Trash, Link, ChevronRight, ChevronLeft, UserCheck, ChevronDown, Crown, X } from './Icons';

export interface AuditConfig {
    editor: string;
    linkChapters: number[];
    uploadedFiles: File[];
}

interface AIAuditFormProps {
    config: AuditConfig;
    setConfig: React.Dispatch<React.SetStateAction<AuditConfig>>;
    onSubmit: () => void;
}

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

  const getSelectedText = () => {
      if (config.linkChapters.length === 0) return '未关联 (仅诊断当前章节)';
      const count = config.linkChapters.length;
      const firstTitle = chapters.find(c => c.id === config.linkChapters[0])?.title || '';
      if (count === 1) return firstTitle;
      return `${firstTitle} 等 ${count} 章`;
  };

  const handleVipConnect = () => {
      setIsVipModalOpen(false);
      alert('已为您提交VIP连线申请！专业编辑将在5分钟内联系您。');
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

        <div className='flex-1 space-y-6 overflow-y-auto pr-2 min-h-0'>
            {/* Diagnosis Preview */}
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">本次诊断将包含：</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <span className="flex items-center">✅ 核心爽点/毒点分析</span>
                    <span className="flex items-center">✅ 读者心理曲线模拟</span>
                    <span className="flex items-center">✅ 对标爆款书分析</span>
                    <span className="flex items-center">✅ 剧情逻辑硬伤检测</span>
                </div>
            </div>
            
            {/* AI Editor Selection - 改为改稿方向选择 */}
            <div className="space-y-3">
                <label htmlFor="editor-select" className="text-base font-bold flex items-center space-x-2"><UserCheck className="w-5 h-5 text-custom-primary"/><span>1. 选择改稿方向</span></label>
                <p className="text-xs text-gray-500 -mt-2 mb-2">根据您的需求，选择最适合的诊断侧重点</p>

                <select
                    id="editor-select"
                    value={config.editor}
                    onChange={(e) => setConfig(prev => ({...prev, editor: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-custom-primary focus:border-custom-primary transition text-sm mb-3"
                >
                    <option value="focus-commercial">商业化优化【侧重：黄金三章 / 留存率提升 / 付费卡点】</option>
                    <option value="focus-plot">剧情结构【侧重：节奏把控 / 冲突设计 / 悬念铺设】</option>
                    <option value="focus-worldview">世界观构建【侧重：创新设定 / 逻辑自洽 / 反套路】</option>
                    <option value="focus-emotion">情感深度【侧重：人物弧光 / 情感细腻度 / CP感营造】</option>
                </select>

                {/* Advanced / VIP Option - MOVED BELOW SELECT */}
                <div className="rounded-xl p-0.5 bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsVipModalOpen(true)}>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-[10px] p-4 flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-bold text-purple-900 flex items-center">
                                <Crown className="w-4 h-4 mr-1 text-yellow-500" /> 
                                【VIP 进阶版】
                            </h3>
                            <p className="text-xs text-purple-700 mt-1">
                                AI审稿差点意思？想拥有专属小编？
                                <br/>
                                这里直接帮你在线对接专业编辑，人工帮你审稿！
                            </p>
                        </div>
                        <button className="bg-white text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:bg-purple-100 transition border border-purple-100">
                            立即连线 →
                        </button>
                    </div>
                </div>
            </div>

             {/* Link Chapters - Dropdown with Pagination & Multi-select */}
            <div className="space-y-3">
                <label className="text-base font-bold flex items-center space-x-2"><Link className="w-5 h-5 text-custom-primary"/><span>2. 关联章节</span></label>
                 
                 {/* Official Hint Style - LIGHTER/SUBTLE */}
                <div className="bg-slate-50 border-l-4 border-slate-400 p-2 rounded-r-md">
                     <p className="text-xs text-slate-700 font-medium leading-relaxed">
                         <span className="font-bold mr-1">💡 官方提示：</span>
                         默认<span className="font-bold text-slate-900">仅诊断当前章节</span>。如需更准确的上下文逻辑诊断（如伏笔回收），请勾选关联章节可提升40%准确率。
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

            {/* Data Feedback */}
            <div className="space-y-3">
                <label className="text-base font-bold flex items-center space-x-2"><UploadCloud className="w-5 h-5 text-custom-primary"/><span>3. 上传平台数据 (可选)</span></label>
                <p className="text-xs text-gray-500">上传后台数据截图，AI将结合真实留存率进行精准建议</p>
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-sm text-gray-500 hover:bg-gray-50 hover:border-custom-primary hover:text-custom-primary transition-colors">
                    <UploadCloud className="w-8 h-8 mb-2" />
                    <span>点击或拖拽文件到此处上传</span>
                </label>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} />
                {config.uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <ul className="max-h-28 overflow-y-auto bg-gray-50 p-2 rounded-md border">
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

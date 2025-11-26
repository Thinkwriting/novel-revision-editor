
import React from 'react';
import { Chapter } from '../types';
import { FileText, Plus, BookOpen, Settings, ChevronDown } from './Icons';


const chapters: Chapter[] = [
  { id: 1, title: '第一章 云端初遇', wordCount: 1292 },
  { id: 2, title: '第二章 甜蜜陷阱', wordCount: 1899 },
  { id: 3, title: '第三章 病院惊魂', wordCount: 3040 },
  { id: 4, title: '第四章 反攻计划', wordCount: 2358 },
  { id: 5, title: '第五章 真实之芯', wordCount: 1872 },
  { id: 6, title: '第六章 书店来客', wordCount: 1796, active: true },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-custom-sidebar border-r border-custom-border flex flex-col">
      <div className="p-4 border-b border-custom-border">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500">作品管理</h2>
          <h2 className="text-lg font-bold">我的 AI 男友？</h2>
        </div>
      </div>
      <div className="p-4 border-b border-custom-border">
        <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
            <button className="flex-1 text-center py-2 text-sm flex items-center justify-center space-x-1 border-r border-gray-200 text-gray-600 hover:bg-gray-100">
                <Plus className="w-4 h-4" />
                <span>新建章节</span>
            </button>
            <button className="flex-1 text-center py-2 text-sm flex items-center justify-center space-x-1 border-r border-gray-200 text-gray-600 hover:bg-gray-100">
                <Plus className="w-4 h-4" />
                <span>新建卷</span>
            </button>
            <button className="flex-1 text-center py-2 text-sm text-gray-600 hover:bg-gray-100">
                <span>总纲</span>
            </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
            <div className="flex justify-between items-center p-2 mb-2">
                <button className="bg-gray-100 px-3 py-1 rounded text-sm hover:bg-gray-200">批量编辑</button>
                <button className="bg-gray-100 px-3 py-1 rounded text-sm hover:bg-gray-200">切换排序</button>
            </div>
            <ul>
                <li className="px-2 py-1">
                    <div className="flex items-center justify-between text-sm font-semibold text-gray-700 bg-yellow-100 rounded p-2">
                        <span>第一卷</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </li>
            {chapters.map(chapter => (
              <li key={chapter.id} className={`px-2 py-1 rounded-md ${chapter.active ? 'bg-yellow-50 border-r-4 border-custom-primary' : ''}`}>
                <a href="#" className={`flex justify-between items-center text-sm p-2 rounded-md transition-colors ${chapter.active ? 'text-custom-text font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <span>{chapter.title}</span>
                  <span className="text-xs text-gray-400">{chapter.wordCount}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-4 border-t border-custom-border text-sm text-gray-500 space-y-2">
        <a href="#" className="flex items-center space-x-2 hover:text-custom-primary"><FileText className="w-4 h-4" /><span>章节目录</span></a>
        <a href="#" className="flex items-center space-x-2 hover:text-custom-primary"><BookOpen className="w-4 h-4" /><span>小说设定</span></a>
        <div className="text-right text-xs text-gray-400 pt-2">共 12167字</div>
      </div>
    </aside>
  );
};

export default Sidebar;

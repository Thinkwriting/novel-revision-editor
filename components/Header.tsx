
import React, { useState } from 'react';

const NavItem: React.FC<{ children: React.ReactNode, hasDropdown?: boolean }> = ({ children, hasDropdown }) => (
  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-custom-primary transition-colors duration-200">
    {children}
    {hasDropdown && (
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
    )}
  </a>
);

const Header: React.FC = () => {
  return (
    <header className="bg-white h-16 flex items-center justify-between px-6 border-b border-custom-border shadow-sm">
      <div className="flex items-center space-x-8">
        <div className="text-xl font-bold text-custom-text">毛笔AI小说</div>
        <nav className="hidden md:flex items-center space-x-6">
          <NavItem>首页</NavItem>
          <NavItem hasDropdown>AI全篇创作</NavItem>
          <NavItem hasDropdown>AI工具箱</NavItem>
          <NavItem hasDropdown>用户案例</NavItem>
          <NavItem hasDropdown>写作课堂</NavItem>
          <NavItem hasDropdown>小说素材库</NavItem>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <button className="bg-green-100 text-green-700 font-semibold text-sm px-4 py-2 rounded-full flex items-center space-x-2">
          <span>💎</span>
          <span>943319</span>
          <span className="text-green-500">+</span>
        </button>
        <a href="#" className="text-gray-600 hover:text-custom-primary text-sm">我的作品</a>
        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
           <img src="https://picsum.photos/32/32" alt="User Avatar" />
        </div>
      </div>
    </header>
  );
};

export default Header;
'use client';

import React, { useState, useMemo, useEffect, useLayoutEffect, memo } from 'react';
import { KNOWLEDGE_ARTICLES, KnowledgeArticle, KnowledgeCategory, BookRecommendation } from '@/lib/knowledge';
import { MASTER_LIBRARY } from '@/lib/books_data';
import { 
  Search, BookOpen, Brain, 
  ArrowLeft, Clock, LayoutGrid, 
  ChevronRight, Filter, AlertTriangle,
  Zap, Compass, Info, LifeBuoy, Languages, Loader2,
  TrendingUp, ShieldAlert, Wind, Activity, HeartHandshake, ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';

interface KnowledgeHubProps {
  onBack: () => void;
  onNavigateToHelp?: () => void;
  initialArticle?: KnowledgeArticle | null;
  sessionLanguage?: string;
  theme?: 'nature' | 'light' | 'dark';
}

const KnowledgeHub = memo(function KnowledgeHub({ onBack, onNavigateToHelp, initialArticle, sessionLanguage = 'English', theme = 'nature' }: KnowledgeHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [showNavigator, setShowNavigator] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(sessionLanguage);

  // Sync with session language
  useEffect(() => {
    if (sessionLanguage && sessionLanguage !== targetLanguage) {
      setTargetLanguage(sessionLanguage);
      if (selectedArticle) {
        handleTranslate(sessionLanguage);
      }
    }
  }, [sessionLanguage]);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<Record<string, Record<string, string>>>({});

  // Handle initial article routing
  useMemo(() => {
    if (initialArticle) {
      setSelectedArticle(initialArticle);
      setTranslatedContent(null);
    }
  }, [initialArticle]);

  // Scroll to top when article changes to prevent sticking to the bottom
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
  }, [selectedArticle]);


  const isLight = theme === 'light';

  const handleTranslate = async (lang: string) => {
    if (!selectedArticle || lang === 'English') {
      setTargetLanguage('English');
      setTranslatedContent(null);
      return;
    }

    setTargetLanguage(lang);

    // Check cache
    if (translationCache[selectedArticle.id]?.[lang]) {
      setTranslatedContent(translationCache[selectedArticle.id][lang]);
      return;
    }

    setIsTranslating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedArticle.content,
          target_language: lang
        })
      });
      const data = await response.json();
      if (data.translated_text) {
        setTranslatedContent(data.translated_text);
        // Update cache
        setTranslationCache(prev => ({
          ...prev,
          [selectedArticle.id]: {
            ...(prev[selectedArticle.id] || {}),
            [lang]: data.translated_text
          }
        }));
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const languages = [
    'English', 'Hindi', 'Hinglish', 'Assamese', 'Bengali', 'Marathi', 'Telugu', 
    'Tamil', 'Gujarati', 'Kannada', 'Punjabi', 'Odia', 'Urdu'
  ];


  // Group articles by primary intent
  const crisisArticles = useMemo(() => KNOWLEDGE_ARTICLES.filter(a => a.isCrisis), []);
  const capsules = useMemo(() => KNOWLEDGE_ARTICLES.filter(a => a.category === 'Micro-Learning'), []);
  const mainCategories: KnowledgeCategory[] = [
    'Foundation', 'Daily Practices', 'Performance', 'Regulation', 
    'Recognition', 'Condition Base', 'Life Problems'
  ];

  const filteredArticles = useMemo(() => {
    return KNOWLEDGE_ARTICLES.filter(article => {
      if (article.isCrisis || article.category === 'Micro-Learning') return false;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           article.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (selectedArticle) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <div className="glass-card overflow-hidden">
          {/* Article Header */}
          <div className={`relative h-48 md:h-64 flex items-end p-6 md:p-10 ${selectedArticle.isCrisis ? 'bg-red-900/40' : 'bg-gradient-to-t from-black/80 to-transparent'}`}>
            <div className={`absolute inset-0 ${selectedArticle.isCrisis ? 'bg-red-600/10' : 'bg-purple-600/20'} mix-blend-overlay`}></div>
            <div className="relative z-10 w-full">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Library</span>
              </button>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border border-white/10 uppercase tracking-wider ${
                  selectedArticle.isCrisis ? 'bg-red-500 text-white' : 'bg-white/10 text-purple-200'
                }`}>
                  {selectedArticle.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <Clock className="w-3 h-3" />
                  <span>{selectedArticle.readTime} read</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <h1 className="text-3xl md:text-5xl font-bold dark:text-white text-zinc-900 leading-tight">
                  {selectedArticle.title}
                </h1>
                
                {/* Language Selector */}
                <div className="relative group/lang">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl cursor-pointer transition-all">
                    {isTranslating ? (
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                    ) : (
                      <Languages className="w-4 h-4 text-purple-400" />
                    )}
                    <span className="text-sm font-medium dark:text-white text-zinc-800">{targetLanguage}</span>
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all z-50 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto no-scrollbar py-2">
                      {languages.map(lang => (
                        <button
                          key={lang}
                          onClick={() => handleTranslate(lang)}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-purple-500/20 transition-colors ${
                            targetLanguage === lang ? 'text-purple-400 font-bold' : 'text-zinc-400'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-6 md:p-12 dark:bg-white/5 bg-zinc-50 backdrop-blur-2xl">
            <div className="prose prose-invert max-w-none">
              <div className="dark:text-zinc-200 text-zinc-700 leading-relaxed space-y-6 text-lg">
                {(translatedContent || selectedArticle.content).split('\n\n').map((paragraph, i) => {
                  const p = paragraph.trim();
                  if (p.startsWith('###')) {
                    return (
                      <h3 key={i} className={`text-2xl font-bold dark:text-white text-zinc-900 mt-8 mb-4 border-l-4 pl-4 ${
                        selectedArticle.isCrisis ? 'border-red-500' : 'border-purple-500'
                      }`}>
                        {p.replace(/###/g, '').trim()}
                      </h3>
                    );
                  }
                  if (p.startsWith('**Fact**:') || p.startsWith('**Breathe**:')) {
                    return (
                      <div key={i} className="dark:bg-white/5 bg-zinc-100 p-4 rounded-xl border dark:border-white/10 border-zinc-200 my-4">
                        <p className="opacity-100 font-medium dark:text-white text-zinc-800">{p}</p>
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="opacity-90 dark:text-zinc-100 text-zinc-600">
                      {p.split('\n').map((line, j) => {
                        const trimmedLine = line.trim();
                        if (trimmedLine.startsWith('-') || /^\d+\./.test(trimmedLine)) {
                          return (
                            <span key={j} className="block pl-4 py-1 flex items-start gap-3">
                              <span className={`${selectedArticle.isCrisis ? 'text-red-400' : 'text-purple-400'} mt-1`}>•</span>
                              <span className="dark:text-zinc-200 text-zinc-700">{trimmedLine.replace(/^[-*]|\d+\.\s+/, '').trim()}</span>
                            </span>
                          );
                        }
                        return <span key={j}>{line}<br /></span>;
                      })}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Contextual Support Action */}
            {selectedArticle.supportLink && (
              <div className="mx-6 md:mx-12 mb-12 p-8 bg-gradient-to-br from-red-900/20 to-blue-900/20 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden group animate-fade-up">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-3 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-red-400">
                      <LifeBuoy className="w-5 h-5 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-widest">Immediate Support Available</span>
                    </div>
                    <h4 className="text-2xl font-bold text-white">Need deeper, professional support?</h4>
                    <p className="text-zinc-400 max-w-md">
                      If this information feels overwhelming or you need a real human to talk to, our Professional Help Hub connects you to 24/7 counsellors and specialists.
                    </p>
                  </div>
                  <Button 
                    onClick={() => onNavigateToHelp?.()}
                    size="lg" 
                    className="bg-white text-black hover:bg-white/90 px-8 h-14 rounded-2xl font-bold shadow-xl shadow-white/5 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    Connect to Support
                  </Button>
                </div>
              </div>
            )}

            <div className="px-6 md:px-12 pb-12">
              <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <Button 
                  onClick={() => setSelectedArticle(null)}
                  variant="outline"
                  className="w-full md:w-auto dark:border-white/10 dark:hover:bg-white/10 border-zinc-200 dark:text-white text-zinc-900 gap-2"
                >
                  Finished Reading
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Header & Dashboard-like Top Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b dark:border-white/10 border-zinc-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-purple-400 mb-2">
            <Compass className="w-5 h-5 animate-spin-slow" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Wellness Navigator</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-zinc-900" style={{ fontFamily: 'var(--font-heading)' }}>
            MindSpace Library
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 text-lg max-w-2xl">
            A comprehensive, scientifically-backed knowledge system for mental resilience, corporate wellness, and high-performance mastery.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="dark:border-white/10 border-zinc-200 dark:hover:bg-white/10 dark:text-white text-zinc-900 gap-2 h-12">
            <ArrowLeft className="w-4 h-4" />
            Hub
          </Button>
        </div>
      </div>

      {/* EMERGENCY SECTION */}
      {crisisArticles.length > 0 && !selectedCategory && !searchQuery && (
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="text-xl font-bold dark:text-white text-zinc-900">Immediate Support</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crisisArticles.map(article => {
              const Icon = article.icon;
              return (
                <div 
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 p-6 rounded-3xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/40">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                    <h4 className="font-bold text-white text-lg">{article.title}</h4>
                    <p className="text-red-200/60 text-sm">{article.summary}</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-red-500 group-hover:translate-x-1 transition-transform" />
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* DISCOVERY & FILTERS */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Search concepts, tools, or feelings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all text-lg"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border ${
              selectedCategory === null 
                ? 'bg-purple-600 border-purple-400 text-white shadow-xl shadow-purple-500/30' 
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Insights
          </button>
          {mainCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border ${
                selectedCategory === cat 
                  ? 'bg-purple-600 border-purple-400 text-white shadow-xl shadow-purple-500/30' 
                  : 'dark:bg-white/5 dark:border-white/10 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10 bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ARTICLE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => {
            const Icon = article.icon;
            return (
              <div 
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group glass-card p-8 cursor-pointer dark:hover:bg-white/10 hover:bg-zinc-100 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col border dark:border-white/10 border-zinc-200 dark:bg-transparent bg-white shadow-lg"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-all -rotate-12 group-hover:rotate-0">
                  <Icon className={`w-16 h-16 ${isLight ? 'text-zinc-900' : 'text-white'}`} />
                </div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-[10px] uppercase font-bold tracking-widest border border-purple-500/30">
                  {article.category}
                </span>
                <span className="text-zinc-500 text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {article.readTime}
                </span>
              </div>
                <h3 className="text-2xl font-bold dark:text-white text-zinc-900 mb-4 group-hover:text-purple-300 transition-colors relative z-10 leading-snug">
                  {article.title}
                </h3>
                <p className="text-base dark:text-zinc-400 text-zinc-600 line-clamp-3 leading-relaxed mb-8 flex-1 relative z-10 font-light">
                  {article.summary}
                </p>
              <div className="flex items-center justify-between text-purple-400 text-sm font-bold mt-auto relative z-10">
                <div className="flex items-center gap-2">
                   <span>Explore</span>
                   <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                {article.subcategory && (
                  <span className="text-zinc-500 font-normal italic text-xs">{article.subcategory}</span>
                )}
              </div>
            </div>
          );
        })
        ) : (
          <div className="col-span-full py-24 text-center">
            <div className="w-20 h-20 dark:bg-white/5 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 border dark:border-white/10 border-zinc-200 shadow-inner">
              <Filter className="w-8 h-8 dark:text-zinc-600 text-zinc-400" />
            </div>
            <h3 className="text-2xl font-bold dark:text-white text-zinc-900 mb-2">Finding your answers...</h3>
            <p className="dark:text-zinc-500 text-zinc-600 mb-8 max-w-md mx-auto">No articles match your search. Try different keywords or browse a category.</p>
            <Button 
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              variant="outline"
              className="dark:border-white/10 dark:hover:bg-white/10 border-zinc-200 dark:text-white text-zinc-900"
            >
              Reset Search
            </Button>
          </div>
        )}
      </div>

      {/* MICRO-LEARNING CAPSULES (Horizontal Scroll) */}
      {!selectedCategory && !searchQuery && capsules.length > 0 && (
        <div className="animate-fade-up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                <Zap className="w-4 h-4 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold dark:text-white text-zinc-900">Micro-Learning</h3>
            </div>
            <div className="text-xs dark:text-zinc-500 text-zinc-400 uppercase tracking-widest">30s quick takes</div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar">
            {capsules.map(capsule => {
              const Icon = capsule.icon;
              return (
                <div 
                  key={capsule.id}
                  onClick={() => setSelectedArticle(capsule)}
                  className="w-80 shrink-0 glass-card p-6 border-l-4 border-l-yellow-500 dark:hover:bg-white/10 hover:bg-zinc-100 transition-all cursor-pointer flex flex-col group shadow-xl dark:bg-transparent bg-white border dark:border-white/10 border-zinc-200"
                >
                  <div className="mb-4 group-hover:scale-110 transition-transform origin-left">
                    <Icon className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h4 className="text-lg font-bold dark:text-white text-zinc-900 mb-3 leading-tight">{capsule.title}</h4>
                  <p className="dark:text-zinc-400 text-zinc-600 text-sm line-clamp-3 mb-6 leading-relaxed italic">
                    &quot;{capsule.summary}&quot;
                  </p>
                <div className="mt-auto flex items-center gap-2 text-[10px] font-bold text-yellow-500/80 uppercase">
                  <span>Read Take</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* BOOK LIBRARY SECTION */}
      {!selectedCategory && !searchQuery && (
        <div className="animate-fade-up mt-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <BookOpen className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold dark:text-white text-zinc-900">The Master Library</h3>
                <p className="text-sm dark:text-zinc-400 text-zinc-500">500+ Curated Volumes on Mind, Soul & Performance</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MASTER_LIBRARY.map((book: BookRecommendation) => (
              <div 
                key={book.id}
                className="group relative h-[450px] rounded-2xl overflow-hidden perspective-1000"
              >
                {/* Book Spine Shadow */}
                <div className="absolute top-0 bottom-0 left-0 w-3 rounded-l-sm bg-gradient-to-r from-black/20 to-transparent z-20 pointer-events-none"></div>
                
                {/* Main Card */}
                <div className={`w-full h-full bg-gradient-to-br ${book.color} p-8 flex flex-col justify-between text-white relative shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-y-6 origin-left border border-white/10`}>
                   {/* Background Elements */}
                   <div className="absolute inset-0 bg-black/5"></div>
                   <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>

                   {/* Header */}
                   <div className="relative z-10 space-y-4">
                     <span className="px-2 py-1 rounded-md bg-white/10 border border-white/20 text-[10px] uppercase tracking-wider font-bold">
                       {book.category}
                     </span>
                     <div className="space-y-1">
                        <h4 className="text-2xl font-bold leading-tight font-serif tracking-tight">{book.title}</h4>
                        <p className="text-white/80 text-sm font-medium">{book.author}</p>
                     </div>
                     <div className="w-12 h-[2px] bg-white/50"></div>
                     <p className="text-sm text-white/90 leading-relaxed font-light italic">
                       &quot;{book.keyInsight}&quot;
                     </p>
                   </div>
                   
                   {/* Footer Info / Overlay Trigger Area */}
                   <div className="relative z-10 pt-4 border-t border-white/20">
                     <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-2">Primary Insight</p>
                     <p className="text-xs text-white/80 line-clamp-3 leading-relaxed">
                       {book.summary}
                     </p>
                   </div>
                </div>

                {/* Hover Details Overlay */}
                <div className="absolute inset-0 bg-zinc-900/98 backdrop-blur-xl p-8 flex flex-col justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-400 pointer-events-none group-hover:pointer-events-auto z-30 translate-y-4 group-hover:translate-y-0">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                       <h5 className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Who Should Read This</h5>
                       <p className="text-white/90 text-sm leading-relaxed">
                         {book.targetAudience}
                       </p>
                    </div>
                    {book.externalSource && (
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                        <span>Source:</span>
                        <span className="text-emerald-500/80">{book.externalSource}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    {book.readUrl && (
                      <Button 
                        onClick={() => window.open(book.readUrl, '_blank')}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-11"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Read Online
                      </Button>
                    )}
                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white h-11">
                      Save to My Shelf
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
          <Info className="w-6 h-6 text-blue-400 mb-4" />
          <h5 className="text-white font-bold text-lg mb-2">Scientific Foundation</h5>
          <p className="text-zinc-400 leading-relaxed">
            All content in the MindSpace Library is derived from peer-reviewed psychological research, including Cognitive Behavioral Therapy (CBT), Mindfulness-Based Stress Reduction (MBSR), and Neurobiology.
          </p>
        </div>
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50"></div>
          <Brain className="w-6 h-6 text-purple-400 mb-4" />
          <h5 className="text-white font-bold text-lg mb-2">Local & Private</h5>
          <p className="text-zinc-400 leading-relaxed">
            Remember: Your interactions with this library, like everything else in ZenGuard, are processed locally. Your reading history never leaves this device.
          </p>
        </div>
      </div>
    </div>
  );
});

export default KnowledgeHub;

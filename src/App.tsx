import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Search, Copy, Check, FileCode, Terminal, Cpu, FileJson, Hash, Braces, 
  Info, AlertTriangle, AlertCircle, CheckCircle2,
  Book, Palette, FileText, Component, Zap,
  ChevronLeft, ChevronRight, ChevronDown, Edit3, Eye, MoreHorizontal
} from 'lucide-react';
import { docsMetadata } from './data/docs';
import './App.css';

const getLanguageIcon = (lang: string) => {
  const language = lang.toLowerCase();
  if (['bash', 'sh', 'shell', 'zsh'].includes(language)) return <Terminal size={14} />;
  if (['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx'].includes(language)) return <FileCode size={14} />;
  if (['json'].includes(language)) return <FileJson size={14} />;
  if (['css', 'scss', 'less'].includes(language)) return <Braces size={14} />;
  if (['html', 'xml', 'svg'].includes(language)) return <FileCode size={14} />;
  if (['python', 'py'].includes(language)) return <Hash size={14} />;
  if (['c', 'cpp', 'rust', 'go', 'java'].includes(language)) return <Cpu size={14} />;
  return <FileCode size={14} />;
};

const getTabIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Book': return <Book size={18} />;
    case 'Palette': return <Palette size={18} />;
    case 'FileText': return <FileText size={18} />;
    case 'Component': return <Component size={18} />;
    case 'Zap': return <Zap size={18} />;
    default: return <Book size={18} />;
  }
};

const generateId = (content: string) => {
  return content
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const CodeBlock = ({ children, className }: { children: any, className?: string }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    const code = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const isInline = !className?.includes('language-');
  const language = className ? className.replace('language-', '') : '';
  if (isInline) return <code>{children}</code>;
  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <div className="code-block-info">
          {getLanguageIcon(language)}
          <span className="language-label">{language}</span>
        </div>
        <button className={`copy-button ${copied ? 'success' : ''}`} onClick={copyToClipboard} title="Copy to clipboard">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <pre className={className}><code>{children}</code></pre>
    </div>
  );
};

const CustomBlockquote = ({ children }: any) => {
  const childrenArray = React.Children.toArray(children);
  let firstParagraph: any = childrenArray.find((child: any) => child.type === 'p');
  if (!firstParagraph) return <blockquote>{children}</blockquote>;
  const pChildren = React.Children.toArray(firstParagraph.props.children);
  const firstLine = pChildren[0];
  if (typeof firstLine === 'string' && firstLine.trim().startsWith('[!')) {
    const fullMatch = firstLine.match(/\[!(\w+)\](.*)/);
    if (fullMatch) {
      const type = fullMatch[1].toLowerCase();
      const customDescription = fullMatch[2].trim();
      const icons: Record<string, any> = {
        info: <Info className="callout-icon" size={20} />,
        warning: <AlertTriangle className="callout-icon" size={20} />,
        error: <AlertCircle className="callout-icon" size={20} />,
        success: <CheckCircle2 className="callout-icon" size={20} />
      };
      const defaultDescriptions: Record<string, string> = {
        info: 'Information', warning: 'Warning', error: 'Critical Error', success: 'Success'
      };
      const modifiedParagraph = React.cloneElement(firstParagraph, { children: pChildren.slice(1) });
      const otherChildren = childrenArray.filter(child => child !== firstParagraph);
      return (
        <div className={`callout ${type}`}>
          {icons[type] || icons.info}
          <div className="callout-content">
            <div className="callout-header">
              <span className="callout-title">{type}</span>
              <span className="callout-description">{customDescription || defaultDescriptions[type] || 'Note'}</span>
            </div>
            <div className="callout-body">{modifiedParagraph}{otherChildren}</div>
          </div>
        </div>
      );
    }
  }
  return <blockquote>{children}</blockquote>;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(docsMetadata[0].id);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPageCopied, setIsPageCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeIndex = useMemo(() => docsMetadata.findIndex(doc => doc.id === activeTab), [activeTab]);
  const activeMeta = docsMetadata[activeIndex] || docsMetadata[0];
  const prevDoc = activeIndex > 0 ? docsMetadata[activeIndex - 1] : null;
  const nextDoc = activeIndex < docsMetadata.length - 1 ? docsMetadata[activeIndex + 1] : null;

  useEffect(() => {
    setLoading(true);
    fetch(activeMeta.path)
      .then(res => res.text())
      .then(text => {
        setContent(text);
        setLoading(false);
      });
  }, [activeMeta]);

  const filteredDocs = useMemo(() => 
    docsMetadata.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  [searchQuery]);

  const toc = useMemo(() => {
    const headings = content.match(/^#{2,3} .+/gm) || [];
    return headings.map(heading => {
      const level = heading.startsWith('###') ? 3 : 2;
      const rawTitle = heading.replace(/^#{2,3} /, '');
      const cleanTitle = rawTitle.replace(/[*_~`]/g, '');
      const id = generateId(cleanTitle);
      return { id, title: cleanTitle, level };
    });
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let currentSection = null;
      for (const item of toc) {
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = item.id;
        } else if (element && element.offsetTop > scrollPosition) {
          break;
        }
      }
      if (currentSection !== activeSection) setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc, activeSection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleCopyPage = () => {
    navigator.clipboard.writeText(content).then(() => {
      setIsPageCopied(true);
      setTimeout(() => setIsPageCopied(false), 2000);
      setIsDropdownOpen(false);
    });
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-left">
          <a href="/" className="logo">SimpleDocs</a>
        </div>
      </header>

      <main className="main-layout">
        <aside className="sidebar">
          <div className="sidebar-search-container">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <nav>
            <ul className="sidebar-nav">
              {filteredDocs.map(doc => (
                <li key={doc.id} className="nav-item">
                  <a 
                    href={`#${doc.id}`}
                    className={`nav-link ${activeTab === doc.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(doc.id);
                    }}
                  >
                    {getTabIcon(doc.icon)}
                    <span>{doc.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <section className="content-area">
          {loading ? (
            <div style={{ color: 'var(--text-muted)' }}>Loading...</div>
          ) : (
            <>
              <div className="page-actions" ref={dropdownRef}>
                <button className="copy-page-btn" onClick={handleCopyPage}>
                  {isPageCopied ? <Check size={16} /> : <Copy size={16} />}
                  <span>Copy Page</span>
                </button>
                <div className="dropdown-container">
                  <button className="dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <ChevronDown size={16} />
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <button className="dropdown-item" onClick={handleCopyPage}>
                        <Copy size={14} />
                        <span>Copy Page</span>
                      </button>
                      <button className="dropdown-item" onClick={() => { window.alert('Edit feature coming soon! Edit the .md file in public/docs/'); setIsDropdownOpen(false); }}>
                        <Edit3 size={14} />
                        <span>Edit Page</span>
                      </button>
                      <button className="dropdown-item" onClick={() => { window.open(activeMeta.path, '_blank'); setIsDropdownOpen(false); }}>
                        <FileCode size={14} />
                        <span>View Markdown</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <article className="markdown-body">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({node, ...props}) => {
                      const text = String(props.children).replace(/[*_~`]/g, '');
                      const id = generateId(text);
                      return <h2 id={id} {...props} />;
                    },
                    h3: ({node, ...props}) => {
                      const text = String(props.children).replace(/[*_~`]/g, '');
                      const id = generateId(text);
                      return <h3 id={id} {...props} />;
                    },
                    code: CodeBlock,
                    blockquote: CustomBlockquote
                  }}
                >
                  {content}
                </ReactMarkdown>
              </article>

              <footer className="pagination">
                {prevDoc ? (
                  <a href={`#${prevDoc.id}`} className="pagination-btn prev" onClick={(e) => { e.preventDefault(); setActiveTab(prevDoc.id); }}>
                    <ChevronLeft size={20} /><div className="pagination-info"><span className="pagination-title">{prevDoc.title}</span></div>
                  </a>
                ) : <div />}

                {nextDoc ? (
                  <a href={`#${nextDoc.id}`} className="pagination-btn next" onClick={(e) => { e.preventDefault(); setActiveTab(nextDoc.id); }}>
                    <div className="pagination-info"><span className="pagination-title">{nextDoc.title}</span></div><ChevronRight size={20} />
                  </a>
                ) : <div />}
              </footer>
            </>
          )}
        </section>

        <aside className="toc-area">
          <div className="toc-title">On this page</div>
          <ul className="toc-list">
            {toc.map((item, index) => (
              <li 
                key={index} 
                className="toc-item"
                style={{ marginLeft: item.level === 3 ? '1rem' : '0' }}
              >
                <a 
                  href={`#${item.id}`} 
                  className={`toc-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeading(item.id);
                  }}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  );
};

export default App;

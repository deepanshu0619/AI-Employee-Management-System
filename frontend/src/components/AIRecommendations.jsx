import React, { useState } from 'react';
import { aiService } from '../services/api';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ── Inline markdown styles so the AI output looks polished ── */
const mdStyles = {
  wrapper: {
    background: 'rgba(0,0,0,0.25)',
    padding: '1.5rem 2rem',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.07)',
    lineHeight: '1.75',
    fontSize: '0.95rem',
  },
};

const MarkdownComponents = {
  h1: ({ children }) => (
    <h1 style={{ fontSize: '1.6rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontSize: '1.25rem', color: '#e2e8f0', marginTop: '1.75rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => {
    const text = String(children);
    const isRecommend = text.toLowerCase().includes('recommend');
    const isHold = text.toLowerCase().includes('hold');
    const color = isRecommend ? '#10b981' : isHold ? '#f59e0b' : '#818cf8';
    return (
      <h3 style={{ fontSize: '1rem', color, marginTop: '0.75rem', marginBottom: '0.4rem', fontWeight: 600 }}>
        {children}
      </h3>
    );
  },
  p: ({ children }) => (
    <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>{children}</p>
  ),
  strong: ({ children }) => (
    <strong style={{ color: '#f1f5f9', fontWeight: 600 }}>{children}</strong>
  ),
  li: ({ children }) => (
    <li style={{ color: '#94a3b8', marginBottom: '0.3rem', paddingLeft: '0.25rem' }}>{children}</li>
  ),
  ul: ({ children }) => (
    <ul style={{ paddingLeft: '1.5rem', marginBottom: '0.75rem' }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ paddingLeft: '1.5rem', marginBottom: '0.75rem' }}>{children}</ol>
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: '3px solid #6366f1', paddingLeft: '1rem', color: '#94a3b8', fontStyle: 'italic', margin: '0.75rem 0' }}>
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.85em' }}>
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: 'rgba(99, 102, 241, 0.2)', borderBottom: '2px solid rgba(99,102,241,0.4)' }}>
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody>{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th style={{ padding: '0.6rem 1rem', textAlign: 'left', color: '#818cf8', fontWeight: 600, whiteSpace: 'nowrap' }}>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td style={{ padding: '0.6rem 1rem', color: '#cbd5e1', verticalAlign: 'top' }}>
      {children}
    </td>
  ),
};

const AIRecommendations = ({ employees }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('promotion');

  const tabs = [
    { id: 'promotion', label: '🏆 Promotions' },
    { id: 'ranking', label: '📊 Rankings' },
    { id: 'training', label: '🎓 Training Needs' },
    { id: 'feedback', label: '💬 Feedback Gen' },
  ];

  const handleGenerate = async () => {
    if (!employees || employees.length === 0) {
      setError('No employees available for analysis.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await aiService.getRecommendation({ employees, type: activeTab });
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch AI recommendations. Please check API configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card"
      style={{ marginTop: '2rem' }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 style={{ margin: 0 }}>✨ AI Insights &amp; Recommendations</h3>
        <span className="badge badge-primary">Powered by Meta Llama 4</span>
      </div>

      {/* Tab buttons */}
      <div className="flex gap-4 mb-4" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(null); setError(''); }}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ borderRadius: '20px', whiteSpace: 'nowrap' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="flex justify-between items-center mb-4">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Analyzing {employees?.length || 0} employees for {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}.
          </p>
          <button
            onClick={handleGenerate}
            className="btn btn-primary btn-sm"
            disabled={loading || !employees?.length}
          >
            {loading ? <div className="spinner"></div> : '⚡ Generate Insights'}
          </button>
        </div>

        {error && <p className="text-danger">{error}</p>}

        {loading && (
          <div className="text-center" style={{ padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px', margin: '0 auto 1rem' }}></div>
            <p>AI is analyzing your workforce... this may take a moment.</p>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={mdStyles.wrapper}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>{result}</ReactMarkdown>
            </div>
          </motion.div>
        )}

        {!result && !loading && !error && (
          <div className="text-center" style={{ padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem', opacity: 0.5 }}>🤖</span>
            <p>Click <strong style={{ color: '#818cf8' }}>"⚡ Generate Insights"</strong> to let AI analyze your workforce.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AIRecommendations;

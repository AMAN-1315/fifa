import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { useAI } from '../../hooks/useAI';
import { useTranslation, LANGUAGE_OPTIONS } from '../../hooks/useTranslation';
import './AIPanel.css';

const ROLE_HEADERS = {
  fan:       { label: 'Fan Mode',       color: 'var(--color-gold)',    icon: '🎟️' },
  volunteer: { label: 'Volunteer Mode', color: 'var(--color-azure)',   icon: '🦺' },
  organizer: { label: 'Organizer Mode', color: 'var(--color-emerald)', icon: '📊' },
};

function formatMessage(text) {
  // Convert basic markdown **bold**, bullet lists, line breaks
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n• /g, '\n')
    .replace(/• /g, '')
    .replace(/\n/g, '<br/>');
}

export default function AIPanel() {
  const { state, dispatch } = useApp();
  const { role, language, situation, currentZone } = state;
  const { t } = useTranslation();
  const { sendMessage, isLoading } = useAI();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: getWelcomeMessage(role, language),
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const roleConfig = ROLE_HEADERS[role] || ROLE_HEADERS.fan;
  const suggestedKey = `suggested_${role}`;
  const suggestions = t(suggestedKey) || [];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSend = async (content = inputValue) => {
    if (!content.trim() || isLoading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    const apiMessages = [...messages, userMsg]
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content }));

    const response = await sendMessage({
      messages: apiMessages,
      role,
      situation,
      zone: currentZone,
      language,
    });

    const aiMsg = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMsg]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside
      id="ai-panel"
      className="ai-panel animate-slide-right"
      aria-label="AI Assistant Panel"
      role="complementary"
      style={{ '--panel-color': roleConfig.color }}
    >
      {/* Header */}
      <div className="ai-panel-header">
        <div className="ai-panel-header-info">
          <span className="ai-panel-icon" aria-hidden="true">{roleConfig.icon}</span>
          <div>
            <p className="ai-panel-title font-display">StadiumPulse AI</p>
            <p className="ai-panel-subtitle">{roleConfig.label}</p>
          </div>
        </div>
        <div className="ai-panel-header-controls">
          {/* Language quick-switcher */}
          <div className="ai-lang-chips" role="group" aria-label="Language">
            {LANGUAGE_OPTIONS.map(opt => (
              <button
                key={opt.code}
                className={`ai-lang-chip ${language === opt.code ? 'ai-lang-chip--active' : ''}`}
                onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: opt.code })}
                title={opt.label}
                aria-label={`${opt.label} — ${opt.flag}`}
              >
                {opt.flag}
              </button>
            ))}
          </div>
          <button
            className="ai-panel-close btn btn-icon btn-ghost"
            onClick={() => dispatch({ type: 'CLOSE_AI_PANEL' })}
            aria-label={t('close')}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="ai-messages scroll-container"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`ai-message ${msg.role === 'user' ? 'ai-message--user' : 'ai-message--ai'} animate-fadeSlideUp`}
          >
            {msg.role === 'assistant' && (
              <span className="ai-message-avatar" aria-hidden="true">⚡</span>
            )}
            <div
              className="ai-message-bubble"
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
            />
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="ai-message ai-message--ai animate-fadeSlideUp">
            <span className="ai-message-avatar" aria-hidden="true">⚡</span>
            <div className="ai-typing" aria-label={t('ai_thinking')}>
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      {Array.isArray(suggestions) && suggestions.length > 0 && (
        <div className="ai-suggestions" role="list" aria-label="Suggested questions">
          {suggestions.slice(0, 3).map((s, i) => (
            <button
              key={i}
              className="ai-suggestion-chip"
              onClick={() => handleSend(s)}
              role="listitem"
              disabled={isLoading}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="ai-input-area">
        <textarea
          ref={inputRef}
          className="ai-input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('ai_placeholder')}
          rows={1}
          aria-label={t('ai_placeholder')}
          disabled={isLoading}
        />
        <button
          className="ai-send-btn btn btn-primary btn-sm"
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isLoading}
          aria-label={t('ai_send')}
        >
          {isLoading ? '...' : '→'}
        </button>
      </div>
    </aside>
  );
}

function getWelcomeMessage(role, lang) {
  const msgs = {
    fan: {
      en: "Hey! 👋 I'm your AI stadium guide. Ask me anything — finding your seat, food queues, transit home, or accessible routes.",
      es: "¡Hola! 👋 Soy tu guía IA del estadio. Pregúntame cualquier cosa — tu asiento, colas de comida, transporte o rutas accesibles.",
      fr: "Bonjour! 👋 Je suis votre assistant IA du stade. Demandez-moi n'importe quoi — trouver votre siège, les files d'attente, le transport.",
      pt: "Olá! 👋 Sou seu guia IA do estádio. Pergunte qualquer coisa — assento, filas, transporte ou rotas acessíveis.",
      ar: "مرحباً! 👋 أنا مساعدك الذكي في الملعب. اسألني عن أي شيء — مقعدك، الطوابير، المواصلات.",
    },
    volunteer: {
      en: "Steward briefed. ✅ Zone status loaded. Ask me about crowd density, incident procedures, or zone redirects.",
      es: "Personal informado. ✅ Estado de zona cargado. Pregúntame sobre densidad, procedimientos o redirecciones.",
      fr: "Personnel informé. ✅ État de zone chargé. Interrogez-moi sur la densité, les incidents ou les redirections.",
      pt: "Equipe informada. ✅ Status de zona carregado. Pergunte sobre densidade, procedimentos ou redirecionamentos.",
      ar: "تم إحاطة المراقب. ✅ تم تحميل حالة المنطقة. اسألني عن الكثافة، الحوادث أو إعادة التوجيه.",
    },
    organizer: {
      en: "Command center online. 📊 All systems nominal. Request a status brief, incident summary, or coverage assessment.",
      es: "Centro de comando en línea. 📊 Todos los sistemas normales. Solicita un resumen de estado, incidentes o cobertura.",
      fr: "Centre de commandement en ligne. 📊 Tous les systèmes normaux. Demandez un résumé de situation ou d'incidents.",
      pt: "Centro de comando online. 📊 Todos os sistemas normais. Solicite um resumo de status, incidentes ou cobertura.",
      ar: "مركز القيادة متصل. 📊 جميع الأنظمة طبيعية. اطلب ملخص الوضع أو الحوادث أو التغطية.",
    },
  };
  return msgs[role]?.[lang] || msgs[role]?.['en'] || msgs.fan.en;
}

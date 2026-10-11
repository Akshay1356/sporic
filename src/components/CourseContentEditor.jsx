import { memo } from 'react';
import {
  createEmptyLearnItem,
  createEmptyModuleItem,
  createEmptyFeatureItem,
} from '../utils/courseContentHelpers';

function CourseContentEditor({
  learnItems,
  setLearnItems,
  moduleItems,
  setModuleItems,
  featureItems,
  setFeatureItems,
}) {
  // --- Handlers for Section A (Learn) ---
  const handleLearnChange = (id, newValue) => {
    setLearnItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
  };

  const handleLearnMove = (index, direction) => {
    setLearnItems((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleLearnRemove = (id) => {
    setLearnItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLearnAdd = () => {
    setLearnItems((prev) => [...prev, createEmptyLearnItem()]);
  };

  // --- Handlers for Section B (Modules) ---
  const handleModuleChange = (id, field, newValue) => {
    setModuleItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: newValue } : item))
    );
  };

  const handleModuleMove = (index, direction) => {
    setModuleItems((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleModuleRemove = (id) => {
    setModuleItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleModuleAdd = () => {
    setModuleItems((prev) => [...prev, createEmptyModuleItem()]);
  };

  // --- Handlers for Section C (Features / Highlights) ---
  const handleFeatureChange = (id, newValue) => {
    setFeatureItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
  };

  const handleFeatureMove = (index, direction) => {
    setFeatureItems((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleFeatureRemove = (id) => {
    setFeatureItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFeatureAdd = () => {
    setFeatureItems((prev) => [...prev, createEmptyFeatureItem()]);
  };

  // Styles matching the white-and-navy admin system
  const btnIconStyle = {
    padding: '0.35rem 0.6rem',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    background: '#FFFFFF',
    color: '#334155',
    cursor: 'pointer',
    fontSize: '0.82rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  };

  const btnDisabledStyle = {
    ...btnIconStyle,
    opacity: 0.35,
    cursor: 'not-allowed',
    background: '#F1F5F9',
  };

  const addBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.45rem 0.9rem',
    borderRadius: '8px',
    border: '1px dashed #93C5FD',
    background: '#EFF6FF',
    color: '#1D4ED8',
    fontWeight: 600,
    fontSize: '0.82rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  return (
    <div
      style={{
        marginTop: '1.25rem',
        marginBottom: '1.25rem',
        padding: '1.25rem',
        background: '#F8FAFC',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
      }}
    >
      {/* Section Header */}
      <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h4 style={{ margin: 0, color: '#0B2A6F', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span>📚</span> Course Content &amp; Learning Outcomes
          </h4>
          <span style={{ fontSize: '0.75rem', background: '#DBEAFE', color: '#1E40AF', padding: '0.18rem 0.55rem', borderRadius: '6px', fontWeight: 600 }}>
            Curriculum &amp; Highlights
          </span>
        </div>
        <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: '#64748B' }}>
          Explicitly control the learning outcomes, syllabus modules, and key highlights rendered on the public course details page.
        </p>
      </div>

      {/* ──────────────────────────────────────────────────────────
          SECTION A: What You'll Learn & Master
         ────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0B2A6F', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>A.</span> What You'll Learn &amp; Master
          </label>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            {learnItems.length} {learnItems.length === 1 ? 'outcome' : 'outcomes'} (empty entries discarded on save)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.65rem' }}>
          {learnItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#FFFFFF',
                padding: '0.45rem 0.6rem',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            >
              <span
                style={{
                  minWidth: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#EFF6FF',
                  color: '#1D4ED8',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </span>

              <input
                type="text"
                value={item.value}
                onChange={(e) => handleLearnChange(item.id, e.target.value)}
                placeholder={
                  index === 0
                    ? 'e.g. Hands-on PLC ladder logic programming and Siemens TIA Portal'
                    : index === 1
                    ? 'e.g. Sensor communication protocols, Modbus & Industrial IoT nodes'
                    : 'e.g. Master predictive maintenance workflows with edge telemetry'
                }
                style={{
                  flex: 1,
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />

              <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                <button
                  type="button"
                  title="Move up"
                  disabled={index === 0}
                  onClick={() => handleLearnMove(index, -1)}
                  style={index === 0 ? btnDisabledStyle : btnIconStyle}
                >
                  ↑
                </button>
                <button
                  type="button"
                  title="Move down"
                  disabled={index === learnItems.length - 1}
                  onClick={() => handleLearnMove(index, 1)}
                  style={index === learnItems.length - 1 ? btnDisabledStyle : btnIconStyle}
                >
                  ↓
                </button>
                <button
                  type="button"
                  title="Remove outcome"
                  onClick={() => handleLearnRemove(item.id)}
                  style={{
                    ...btnIconStyle,
                    color: '#DC2626',
                    borderColor: '#FECACA',
                    background: '#FEF2F2',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {learnItems.length === 0 && (
            <div style={{ padding: '0.8rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem', background: '#FFFFFF', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
              No learning outcomes added yet. Click below to add outcomes.
            </div>
          )}
        </div>

        <button type="button" onClick={handleLearnAdd} style={addBtnStyle}>
          <span>+</span> Add Learning Outcome
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────
          SECTION B: Structured Syllabus & Modules
         ────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0B2A6F', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>B.</span> Structured Syllabus &amp; Modules
          </label>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            {moduleItems.length} {moduleItems.length === 1 ? 'module' : 'modules'} (numbering generated automatically)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '0.65rem' }}>
          {moduleItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                padding: '0.85rem 1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              {/* Module Header Bar with Number & Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.6rem',
                  borderBottom: '1px solid #F1F5F9',
                  marginBottom: '0.7rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      background: '#1D4ED8',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '5px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Module {index + 1}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                    Title saved clean (without Module prefix)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <button
                    type="button"
                    title="Move module up"
                    disabled={index === 0}
                    onClick={() => handleModuleMove(index, -1)}
                    style={index === 0 ? btnDisabledStyle : btnIconStyle}
                  >
                    ↑ Move Up
                  </button>
                  <button
                    type="button"
                    title="Move module down"
                    disabled={index === moduleItems.length - 1}
                    onClick={() => handleModuleMove(index, 1)}
                    style={index === moduleItems.length - 1 ? btnDisabledStyle : btnIconStyle}
                  >
                    ↓ Move Down
                  </button>
                  <button
                    type="button"
                    title="Remove module"
                    onClick={() => handleModuleRemove(item.id)}
                    style={{
                      ...btnIconStyle,
                      color: '#DC2626',
                      borderColor: '#FECACA',
                      background: '#FEF2F2',
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>

              {/* Module Title Field */}
              <div style={{ marginBottom: '0.6rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.25rem' }}>
                  Module Title *
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleModuleChange(item.id, 'title', e.target.value)}
                  placeholder=""
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    color: '#0F172A',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Module Description / Scope (Multiline) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.25rem' }}>
                  What This Module Covers (Topics &amp; Practical Scope)
                </label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleModuleChange(item.id, 'description', e.target.value)}
                  placeholder=""
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.83rem',
                    color: '#0F172A',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginTop: '0.2rem' }}>
                  Line breaks and bullet points are preserved exactly on the public course page.
                </span>
              </div>
            </div>
          ))}

          {moduleItems.length === 0 && (
            <div style={{ padding: '0.8rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem', background: '#FFFFFF', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
              No modules added yet. Click below to add modules.
            </div>
          )}
        </div>

        <button type="button" onClick={handleModuleAdd} style={addBtnStyle}>
          <span>+</span> Add Module
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────
          SECTION C: Key Program Highlights
         ────────────────────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0B2A6F', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>C.</span> Key Program Highlights
          </label>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            {featureItems.length} {featureItems.length === 1 ? 'highlight' : 'highlights'} (empty entries discarded on save)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.65rem' }}>
          {featureItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#FFFFFF',
                padding: '0.45rem 0.6rem',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            >
              <span
                style={{
                  minWidth: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#FEF3C7',
                  color: '#92400E',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ⚡ {index + 1}
              </span>

              <input
                type="text"
                value={item.value}
                onChange={(e) => handleFeatureChange(item.id, e.target.value)}
                placeholder=""
                style={{
                  flex: 1,
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />

              <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                <button
                  type="button"
                  title="Move up"
                  disabled={index === 0}
                  onClick={() => handleFeatureMove(index, -1)}
                  style={index === 0 ? btnDisabledStyle : btnIconStyle}
                >
                  ↑
                </button>
                <button
                  type="button"
                  title="Move down"
                  disabled={index === featureItems.length - 1}
                  onClick={() => handleFeatureMove(index, 1)}
                  style={index === featureItems.length - 1 ? btnDisabledStyle : btnIconStyle}
                >
                  ↓
                </button>
                <button
                  type="button"
                  title="Remove highlight"
                  onClick={() => handleFeatureRemove(item.id)}
                  style={{
                    ...btnIconStyle,
                    color: '#DC2626',
                    borderColor: '#FECACA',
                    background: '#FEF2F2',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {featureItems.length === 0 && (
            <div style={{ padding: '0.8rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem', background: '#FFFFFF', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
              No highlights added yet. Click below to add highlights.
            </div>
          )}
        </div>

        <button type="button" onClick={handleFeatureAdd} style={addBtnStyle}>
          <span>+</span> Add Program Highlight
        </button>
      </div>
    </div>
  );
}

export default memo(CourseContentEditor);

// ═══════════════════════════════════════════════════
//  OO Studio — React App
//  Leest window.MODULES uit data.js
// ═══════════════════════════════════════════════════
const { useState, useEffect, useRef, useCallback } = React;
const MODULES = window.MODULES;

// ─── Mermaid initialisatie ───────────────────────
if (window.mermaid) {
  window.mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
}

// ─── Helpers ────────────────────────────────────
let mermaidId = 0;
const LS_KEY = 'oo-studio-v1';

function loadState() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
}
function saveState(s) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
}

// Judge0 CE (ce.judge0.com) — open CORS, gratis, language_id 51 = C# Mono
async function runCSharp(code, stdin = '') {
  try {
    const res = await fetch(
      'https://ce.judge0.com/submissions?wait=true&base64_encoded=false', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_code: code, language_id: 51, stdin })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const d = await res.json();
    const output  = d.stdout || '';
    const compErr = d.compile_output || '';
    const runErr  = d.stderr || '';
    const error   = compErr || runErr;
    // status.id 3 = Accepted, 6 = Compilation Error, anders = runtime fout
    return { output, error, ok: true, status: d.status?.description };
  } catch (e) {
    return { output: '', error: e.message, ok: false, corsError: true };
  }
}

// ─── Stdin helper ────────────────────────────────
// Zoekt alle Console.ReadLine()-aanroepen in de code en probeert het
// bijbehorende Console.Write[Line]-prompt op te pikken als label.
function parseReadLines(code) {
  const lines = code.split('\n');
  const prompts = [];
  for (let i = 0; i < lines.length; i++) {
    if (/Console\.ReadLine\s*\(\s*\)/.test(lines[i])) {
      let label = `Invoer ${prompts.length + 1}`;
      for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
        const t = lines[j].trim();
        const m = t.match(/Console\.Write(?:Line)?\s*\(\s*\$?["'](.+?)["']\s*\)/);
        if (m) { label = m[1].replace(/\{[^}]+\}/g, '…').replace(/\\n/g, '').trim(); break; }
      }
      prompts.push(label);
    }
  }
  return prompts; // ['Wat is je naam?', 'Wat is je leeftijd?', ...]
}

// ─── Stdin Modal ──────────────────────────────────
function StdinModal({ prompts, onSubmit, onCancel }) {
  const [vals, setVals] = useState(prompts.map(() => ''));
  const update = (i, v) => setVals(p => p.map((x, j) => j === i ? v : x));
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:100000,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', border:'1px solid #d0d7de', borderRadius:12,
                    padding:'22px 26px', minWidth:340, maxWidth:460,
                    boxShadow:'0 12px 40px rgba(0,0,0,.35)', fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:4, color:'#24292f' }}>
          ⌨️ Programma verwacht invoer
        </div>
        <div style={{ fontSize:'.76rem', color:'#57606a', marginBottom:16 }}>
          Vul de gevraagde waarden in en klik op Uitvoeren.
        </div>
        {prompts.map((p, i) => (
          <div key={i} style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:'.8rem', color:'#24292f',
                            fontWeight:600, marginBottom:5 }}>{p}</label>
            <input
              autoFocus={i === 0}
              type="text"
              value={vals[i]}
              onChange={e => update(i, e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (i < prompts.length - 1) {
                    // focus next field
                    const next = document.querySelectorAll('.stdin-modal-input')[i + 1];
                    if (next) next.focus();
                  } else {
                    onSubmit(vals.join('\n'));
                  }
                }
              }}
              className="stdin-modal-input"
              style={{ width:'100%', boxSizing:'border-box', padding:'8px 11px',
                       border:'1px solid #d0d7de', borderRadius:7,
                       fontFamily:"'Fira Code',monospace", fontSize:'.88rem',
                       color:'#24292f', outline:'none' }}
            />
          </div>
        ))}
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:18 }}>
          <button onClick={onCancel}
            style={{ padding:'8px 16px', background:'#f6f8fa', border:'1px solid #d0d7de',
                     borderRadius:7, cursor:'pointer', fontSize:'.82rem', fontFamily:"'DM Sans',sans-serif" }}>
            ✕ Annuleer
          </button>
          <button onClick={() => onSubmit(vals.join('\n'))}
            style={{ padding:'8px 16px', background:'#1f6feb', color:'#fff', border:'none',
                     borderRadius:7, cursor:'pointer', fontSize:'.82rem', fontWeight:700,
                     fontFamily:"'DM Sans',sans-serif" }}>
            ▶ Uitvoeren
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── UML Diagram Component ───────────────────────
function MermaidChart({ chart }) {
  const ref = useRef(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (!ref.current || !window.mermaid || !chart) return;
    const id = 'mmd-' + (++mermaidId);
    setErr(false);
    try {
      window.mermaid.mermaidAPI.render(id, chart, (svg) => {
        if (ref.current) ref.current.innerHTML = svg;
      });
    } catch (e) { setErr(true); }
  }, [chart]);

  if (err) return <pre style={{ fontSize: '.72rem', color: '#888', padding: 8 }}>{chart}</pre>;
  return <div ref={ref} style={{ minHeight: 60 }} />;
}

// ─── Theory Card ────────────────────────────────
function TheoryCard({ card, accent }) {
  const [open, setOpen] = useState(false);
  const hasUml = !!card.uml;

  return (
    <div className="theory-card">
      <div className="theory-card-head" onClick={() => setOpen(!open)}>
        <span style={{ fontSize: 20 }}>{card.icon}</span>
        <h3>{card.title}</h3>
        <span className={`chevron${open ? ' open' : ''}`}>▼</span>
      </div>
      {open && (
        <div className="theory-card-body fade-in">
          <p className="theory-content">{card.content}</p>

          {hasUml ? (
            <div className="uml-split">
              <div>
                <div className="uml-panel-label">UML-klassendiagram</div>
                <div className="uml-panel">
                  <MermaidChart chart={card.uml} />
                </div>
              </div>
              <div>
                <div className="uml-panel-label" style={{ color: '#8b949e' }}>C# code</div>
                <div className="code-panel">
                  {card.code.split('\n').map((line, i) => {
                    const isComment = line.trim().startsWith('//');
                    const isKeyword = /^\s*(class|interface|abstract|public|private|protected|static|override|virtual|sealed|enum|new|return|using|namespace)\b/.test(line);
                    const color = isComment ? '#8b949e' : '#c9d1d9';
                    return <div key={i} style={{ color }}>{line}</div>;
                  })}
                </div>
              </div>
            </div>
          ) : card.code ? (
            <div className="theory-code">
              {card.code.split('\n').map((line, i) => {
                const isComment = line.trim().startsWith('//');
                const isGood = line.trim().startsWith('✅');
                const isBad = line.trim().startsWith('❌');
                return (
                  <div key={i} style={{ color: isComment ? '#8b949e' : isBad ? '#ff7b72' : isGood ? '#7ee787' : '#c9d1d9' }}>
                    {line}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ─── Quiz Question ───────────────────────────────
function QuizQuestion({ q, idx, modId, saved, onAnswer, accent }) {
  const [selected, setSelected] = useState(saved?.selected ?? null);
  const [fillVal, setFillVal] = useState(saved?.fill ?? '');
  const [checked, setChecked] = useState(saved?.checked ?? false);
  const [showXp, setShowXp] = useState(false);

  const isCorrectMC = selected !== null && selected === q.answer;
  const isCorrectFill = checked && (() => {
    const v = fillVal.trim().toLowerCase();
    if (q.acceptAny) return v.length > 0;
    return q.answer.map(a => a.toLowerCase()).includes(v);
  })();

  const flashXp = () => { setShowXp(true); setTimeout(() => setShowXp(false), 900); };

  const handleMC = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const ok = i === q.answer;
    onAnswer(idx, { selected: i }, ok ? q.xp : 0);
    if (ok) flashXp();
  };

  const handleCheck = () => {
    if (checked) return;
    setChecked(true);
    const v = fillVal.trim().toLowerCase();
    const ok = q.acceptAny ? v.length > 0 : q.answer.map(a => a.toLowerCase()).includes(v);
    onAnswer(idx, { fill: fillVal, checked: true }, ok ? q.xp : 0);
    if (ok) flashXp();
  };

  const cardCls = `quiz-card${q.type === 'mc' && selected !== null ? (isCorrectMC ? ' correct' : ' incorrect') : ''}${q.type === 'fill' && checked ? (isCorrectFill ? ' correct' : ' incorrect') : ''}`;

  return (
    <div className={cardCls}>
      {showXp && <div className="xp-gained">+{q.xp} XP ⚡</div>}
      <div className="xp-float">⚡ {q.xp} XP</div>
      <div className="quiz-num">Vraag {idx + 1}</div>
      <div className="quiz-q" dangerouslySetInnerHTML={{ __html: q.q.replace(/`([^`]+)`/g, '<code>$1</code>') }} />

      {q.type === 'mc' ? (
        <div className="mc-options">
          {q.options.map((opt, i) => {
            let cls = 'mc-option';
            if (selected !== null) {
              if (i === selected) cls += selected === q.answer ? ' selected-correct' : ' selected-wrong';
              else if (i === q.answer && selected !== q.answer) cls += ' reveal-correct';
            }
            return (
              <button key={i} className={cls} disabled={selected !== null} onClick={() => handleMC(i)}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>
                  {['A','B','C','D'][i]}
                </span>
                {opt}
              </button>
            );
          })}
          {selected !== null && (
            <div className={`quiz-feedback ${isCorrectMC ? 'ok' : 'err'}`}>
              {isCorrectMC ? '✅ Correct!' : `❌ Fout — juist antwoord: ${q.options[q.answer]}`}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="fill-row">
            {q.prefix && <span className="fill-prefix">{q.prefix}</span>}
            <input
              className={`fill-input${checked ? (isCorrectFill ? ' correct' : ' wrong') : ''}`}
              value={fillVal}
              onChange={e => setFillVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !checked && handleCheck()}
              disabled={checked}
              placeholder="???"
              style={{ width: Math.max(100, fillVal.length * 11 + 36) }}
            />
            {q.suffix && <span className="fill-prefix">{q.suffix}</span>}
            <button className="check-btn" onClick={handleCheck} disabled={checked || !fillVal.trim()} style={{ background: accent }}>
              Controleer
            </button>
          </div>
          {checked && (
            <div className={`quiz-feedback ${isCorrectFill ? 'ok' : 'err'}`}>
              {isCorrectFill ? '✅ Correct!' : `❌ Fout — juist antwoord: ${Array.isArray(q.answer) ? q.answer[0] : q.answer}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Custom Autocomplete — volledige vervanging van Monaco's suggest widget ────
// Monaco's suggest widget heeft een onoplosbaar CSS-rendering probleem in v0.44.
// Oplossing: Monaco's suggest volledig uitschakelen + eigen React-dropdown bouwen.

const CS_COMPLETIONS = [
  // Keywords
  { label:'public',    text:'public'    },
  { label:'private',   text:'private'   },
  { label:'protected', text:'protected' },
  { label:'static',    text:'static'    },
  { label:'abstract',  text:'abstract'  },
  { label:'virtual',   text:'virtual'   },
  { label:'override',  text:'override'  },
  { label:'sealed',    text:'sealed'    },
  { label:'readonly',  text:'readonly'  },
  { label:'const',     text:'const'     },
  { label:'return',    text:'return '   },
  { label:'new',       text:'new '      },
  { label:'this',      text:'this'      },
  { label:'base',      text:'base'      },
  { label:'null',      text:'null'      },
  { label:'true',      text:'true'      },
  { label:'false',     text:'false'     },
  { label:'using',     text:'using System;' },
  // Types
  { label:'string',    text:'string'    },
  { label:'int',       text:'int'       },
  { label:'double',    text:'double'    },
  { label:'float',     text:'float'     },
  { label:'bool',      text:'bool'      },
  { label:'char',      text:'char'      },
  { label:'object',    text:'object'    },
  { label:'var',       text:'var'       },
  { label:'void',      text:'void'      },
  { label:'decimal',   text:'decimal'   },
  // Snippets
  { label:'class',     text:'class Naam\n{\n    \n}',                              hint:'Klasse' },
  { label:'interface', text:'interface INaam\n{\n    \n}',                          hint:'Interface' },
  { label:'enum',      text:'enum Naam\n{\n    Waarde1,\n    Waarde2\n}',          hint:'Enum' },
  { label:'ctor',      text:'public Klasse(string param)\n{\n    \n}',             hint:'Constructor' },
  { label:'prop',      text:'public string Naam { get; set; }',                    hint:'Property' },
  { label:'propro',    text:'public string Naam { get; }',                         hint:'Read-only' },
  { label:'if',        text:'if ()\n{\n    \n}',                                   hint:'If-blok' },
  { label:'else',      text:'else\n{\n    \n}',                                    hint:'Else' },
  { label:'for',       text:'for (int i = 0; i < n; i++)\n{\n    \n}',            hint:'For-lus' },
  { label:'foreach',   text:'foreach (var item in collectie)\n{\n    \n}',         hint:'Foreach' },
  { label:'while',     text:'while ()\n{\n    \n}',                                hint:'While' },
  { label:'switch',    text:'switch (x)\n{\n    case 1:\n        break;\n    default:\n        break;\n}', hint:'Switch' },
  { label:'try',       text:'try\n{\n    \n}\ncatch (Exception ex)\n{\n    Console.WriteLine(ex.Message);\n}', hint:'Try-catch' },
  { label:'throw',     text:'throw new Exception("bericht");',                     hint:'Uitzondering' },
  { label:'override',  text:'public override void Methode()\n{\n    \n}',         hint:'Override' },
  { label:'ToString',  text:'public override string ToString()\n{\n    return "";\n}', hint:'ToString' },
  // Console
  { label:'Console.WriteLine', text:'Console.WriteLine()',  hint:'Output + newline' },
  { label:'Console.Write',     text:'Console.Write()',      hint:'Output' },
  { label:'Console.ReadLine',  text:'Console.ReadLine()',   hint:'Invoer' },
  // Math
  { label:'Math.Sqrt',  text:'Math.Sqrt()',   hint:'√' },
  { label:'Math.Pow',   text:'Math.Pow(,)',   hint:'xⁿ' },
  { label:'Math.Abs',   text:'Math.Abs()',    hint:'|x|' },
  { label:'Math.Round', text:'Math.Round(,)', hint:'Afronden' },
  { label:'Math.Max',   text:'Math.Max(,)',   hint:'Maximum' },
  { label:'Math.Min',   text:'Math.Min(,)',   hint:'Minimum' },
];

// Koppel custom suggest aan een Monaco editor-instantie.
// setState/getState zijn de React state-setters van de bovenliggende component.
function attachCustomSuggest(editor, setState, getState) {
  function close() { setState({ items:[], idx:0, pos:null, range:null }); }

  function accept(item, state) {
    const s = state || getState();
    if (!s.range) return;
    editor.executeEdits('cs-suggest', [{
      range: s.range, text: item.text, forceMoveMarkers: true
    }]);
    editor.focus();
    close();
  }

  // Typ-event → bereken matching items + cursorpositie
  editor.onDidChangeModelContent(() => {
    const pos   = editor.getPosition();
    const model = editor.getModel();
    const word  = model.getWordUntilPosition(pos);
    if (!word.word || word.word.length < 2) { close(); return; }

    const w = word.word.toLowerCase();
    const matches = CS_COMPLETIONS.filter(c =>
      c.label.toLowerCase().startsWith(w) && c.label.toLowerCase() !== w
    ).slice(0, 8);
    if (!matches.length) { close(); return; }

    const pix = editor.getScrolledVisiblePosition(pos);
    if (!pix) return;
    const rect = editor.getDomNode().getBoundingClientRect();
    setState({
      items: matches, idx: 0,
      pos: { left: rect.left + pix.left, top: rect.top + pix.top + 20 },
      range: { startLineNumber:pos.lineNumber, endLineNumber:pos.lineNumber,
               startColumn:word.startColumn, endColumn:word.endColumn }
    });
  });

  // Toetsenbordbediening
  editor.onKeyDown(e => {
    const s = getState();
    if (!s.items.length) return;
    const K = window.monaco.KeyCode;
    if (e.keyCode === K.Tab || e.keyCode === K.Enter) {
      e.preventDefault(); e.stopPropagation();
      accept(s.items[s.idx], s);
    } else if (e.keyCode === K.Escape) {
      e.preventDefault(); e.stopPropagation(); close();
    } else if (e.keyCode === K.UpArrow) {
      e.preventDefault(); e.stopPropagation();
      setState(prev => ({ ...prev, idx: Math.max(0, prev.idx - 1) }));
    } else if (e.keyCode === K.DownArrow) {
      e.preventDefault(); e.stopPropagation();
      setState(prev => ({ ...prev, idx: Math.min(s.items.length - 1, prev.idx + 1) }));
    }
  });

  // Sluit bij blur (met kleine vertraging zodat klik-events eerst vuren)
  editor.onDidBlurEditorText(() => setTimeout(close, 150));

  return { accept, close };
}

// Custom dropdown — volledig eigen CSS, geen Monaco-afhankelijkheid
function SuggestDropdown({ items, idx, pos, onAccept, onHover }) {
  if (!items.length || !pos) return null;
  return React.createElement('div', {
    style: {
      position:'fixed', left:pos.left, top:pos.top, zIndex:99999,
      background:'#ffffff', border:'1px solid #bbb', borderRadius:5,
      boxShadow:'0 4px 14px rgba(0,0,0,0.18)',
      minWidth:220, maxWidth:380, maxHeight:220, overflowY:'auto',
      fontFamily:"'Fira Code','Consolas',monospace", fontSize:13, lineHeight:'1.5',
    }
  },
    items.map((item, i) =>
      React.createElement('div', {
        key: item.label,
        onMouseEnter: () => onHover(i),
        onMouseDown:  e => { e.preventDefault(); onAccept(item); },
        style: {
          padding:'4px 12px', cursor:'pointer', display:'flex',
          justifyContent:'space-between', alignItems:'center', gap:10,
          background: i === idx ? '#1f6feb' : 'transparent',
          color:       i === idx ? '#ffffff' : '#24292f',
          borderBottom: i < items.length - 1 ? '1px solid #f0f0f0' : 'none',
        }
      },
        React.createElement('span', { style:{ fontWeight:600 } }, item.label),
        item.hint && React.createElement('span', {
          style:{ fontSize:11, opacity:0.7, color: i === idx ? '#cce' : '#666' }
        }, item.hint)
      )
    )
  );
}

// ─── Code Lab ────────────────────────────────────
function CodeLab({ mod }) {
  const [exIdx, setExIdx] = useState(0);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [suggest, setSuggest] = useState({ items:[], idx:0, pos:null, range:null });
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const monacoReady = useRef(false);
  const suggestRef = useRef(suggest);
  suggestRef.current = suggest;
  const ex = mod.exercises[exIdx];

  // Initialiseer Monaco Editor
  useEffect(() => {
    if (!containerRef.current || !window.require) return;
    window.require(['vs/editor/editor.main'], () => {
      if (!containerRef.current) return;
      if (editorRef.current) { editorRef.current.setValue(ex.starter); return; }
      editorRef.current = window.monaco.editor.create(containerRef.current, {
        value: ex.starter,
        language: 'csharp',
        theme: 'vs',
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on',
        renderWhitespace: 'none',
        padding: { top: 12, bottom: 12 },
        // Monaco's eigen suggest volledig uit — we gebruiken onze eigen dropdown
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        wordBasedSuggestions: false,
        parameterHints: { enabled: false },
        hover: { enabled: false },
      });
      attachCustomSuggest(editorRef.current, setSuggest, () => suggestRef.current);
      monacoReady.current = true;
    });
    return () => {
      if (editorRef.current) { editorRef.current.dispose(); editorRef.current = null; }
      setSuggest({ items:[], idx:0, pos:null, range:null });
    };
  }, [mod.id]);

  // Update editor inhoud als oefening wisselt
  useEffect(() => {
    if (editorRef.current) editorRef.current.setValue(ex.starter);
    setOutput(null);
  }, [exIdx]);

  const getCode = () => editorRef.current ? editorRef.current.getValue() : ex.starter;

  const handleRun = async () => {
    setRunning(true);
    setOutput({ type: 'info', text: 'Compileren & uitvoeren...' });
    const code = getCode();
    const result = await runCSharp(code);
    setRunning(false);
    if (result.corsError) {
      setOutput({ type: 'cors', text: result.error });
    } else if (result.error && !result.output) {
      setOutput({ type: 'err', text: result.error });
    } else {
      setOutput({ type: 'ok', text: result.output || '(geen output)', err: result.error });
    }
  };

  const handleReset = () => {
    if (editorRef.current) editorRef.current.setValue(ex.starter);
    setOutput(null);
  };

  return (
    <div className="codelab-area">
      {/* Oefening picker */}
      <div className="exercise-picker">
        {mod.exercises.map((e, i) => (
          <button key={i} className={`ex-btn${exIdx === i ? ' active' : ''}`} onClick={() => setExIdx(i)}>
            {i + 1}. {e.title.replace(/^Oefening \d+ — /, '')}
          </button>
        ))}
      </div>

      {/* Oefening kaart */}
      <div className="ex-card">
        <div className="ex-card-head">
          <h3>{ex.title}</h3>
          <p>{ex.description}</p>
        </div>
        {ex.hint && <div className="ex-hint">💡 Hint: {ex.hint}</div>}

        {/* Monaco editor */}
        <div className="editor-container" ref={containerRef} />

        {/* Toolbar */}
        <div className="editor-toolbar">
          <button className="run-btn" onClick={handleRun} disabled={running}>
            {running ? '⏳' : '▶'} {running ? 'Uitvoeren...' : 'Uitvoeren'}
          </button>
          <button className="reset-btn" onClick={handleReset}>↺ Reset</button>
        </div>

        {/* Output */}
        {output && (
          <div className="output-panel">
            {output.type === 'info' && <div className="out-info">{output.text}</div>}
            {output.type === 'ok' && (
              <>
                <div className="out-ok">{output.text}</div>
                {output.err && <div className="out-err" style={{ marginTop: 6 }}>{output.err}</div>}
              </>
            )}
            {output.type === 'err' && <div className="out-err">{output.text}</div>}
            {output.type === 'cors' && (
              <div>
                <div className="out-err">Compiler niet bereikbaar (CORS of netwerk).</div>
                <div className="out-info" style={{ marginTop: 6 }}>
                  Serveer dit project via een webserver (python3 -m http.server 8080).
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom autocomplete dropdown */}
      <SuggestDropdown
        items={suggest.items} idx={suggest.idx} pos={suggest.pos}
        onAccept={item => {
          if (editorRef.current && suggest.range) {
            editorRef.current.executeEdits('cs-suggest', [{
              range: suggest.range, text: item.text, forceMoveMarkers: true
            }]);
            editorRef.current.focus();
          }
          setSuggest({ items:[], idx:0, pos:null, range:null });
        }}
        onHover={i => setSuggest(s => ({ ...s, idx: i }))}
      />
    </div>
  );
}

// ─── Free Editor (Opdrachten tab) ────────────────
const FREE_STARTER = `using System;

// Vrije editor — schrijf hier je opdracht-oplossing

class Program
{
    static void Main()
    {
        Console.WriteLine("Start hier...");
    }
}`;

function FreeEditor() {
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [stdinModal, setStdinModal] = useState(null);
  const [suggest, setSuggest] = useState({ items:[], idx:0, pos:null, range:null });
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const suggestRef = useRef(suggest);
  suggestRef.current = suggest;

  useEffect(() => {
    if (!containerRef.current || !window.require) return;
    window.require(['vs/editor/editor.main'], () => {
      if (!containerRef.current || editorRef.current) return;
      editorRef.current = window.monaco.editor.create(containerRef.current, {
        value: FREE_STARTER,
        language: 'csharp',
        theme: 'vs',
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on',
        renderWhitespace: 'none',
        padding: { top: 12, bottom: 12 },
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        wordBasedSuggestions: false,
        parameterHints: { enabled: false },
        hover: { enabled: false },
      });
      attachCustomSuggest(editorRef.current, setSuggest, () => suggestRef.current);
    });
    return () => {
      if (editorRef.current) { editorRef.current.dispose(); editorRef.current = null; }
      setSuggest({ items:[], idx:0, pos:null, range:null });
    };
  }, []);

  const getCode = () => editorRef.current ? editorRef.current.getValue() : FREE_STARTER;

  const doRun = async (stdin) => {
    setStdinModal(null);
    setRunning(true);
    setOutput({ type: 'info', text: 'Compileren & uitvoeren...' });
    const result = await runCSharp(getCode(), stdin);
    setRunning(false);
    if (result.corsError) {
      setOutput({ type: 'err', text: 'Compiler niet bereikbaar. Controleer je internetverbinding.' });
    } else if (result.error && !result.output) {
      setOutput({ type: 'err', text: result.error });
    } else {
      setOutput({ type: 'ok', text: result.output || '(geen output)', err: result.error });
    }
  };

  const handleRun = () => {
    const prompts = parseReadLines(getCode());
    if (prompts.length > 0) { setStdinModal(prompts); return; }
    doRun('');
  };

  const handleReset = () => {
    if (editorRef.current) editorRef.current.setValue(FREE_STARTER);
    setOutput(null);
    setStdinModal(null);
  };

  return (
    <div className="free-editor-wrap">
      <div className="free-editor-label">
        <span>💻</span>
        <span>Vrije C# editor — test je oplossing hier</span>
      </div>
      <div className="ex-card">
        <div className="editor-container" style={{ height: 340 }} ref={containerRef} />
        <div className="editor-toolbar">
          <button className="run-btn" onClick={handleRun} disabled={running}>
            {running ? '⏳' : '▶'} {running ? 'Uitvoeren...' : 'Uitvoeren'}
          </button>
          <button className="reset-btn" onClick={handleReset}>↺ Reset</button>
        </div>
        {stdinModal && (
          <StdinModal prompts={stdinModal}
            onSubmit={stdin => doRun(stdin)}
            onCancel={() => setStdinModal(null)} />
        )}
        {output && (
          <div className="output-panel">
            {output.type === 'info' && <div className="out-info">{output.text}</div>}
            {output.type === 'ok' && (
              <>
                <div className="out-ok">{output.text}</div>
                {output.err && <div className="out-err" style={{ marginTop: 6 }}>{output.err}</div>}
              </>
            )}
            {output.type === 'err' && <div className="out-err">{output.text}</div>}
          </div>
        )}
      </div>
      <SuggestDropdown
        items={suggest.items} idx={suggest.idx} pos={suggest.pos}
        onAccept={item => {
          if (editorRef.current && suggest.range) {
            editorRef.current.executeEdits('cs-suggest', [{
              range: suggest.range, text: item.text, forceMoveMarkers: true
            }]);
            editorRef.current.focus();
          }
          setSuggest({ items:[], idx:0, pos:null, range:null });
        }}
        onHover={i => setSuggest(s => ({ ...s, idx: i }))}
      />
    </div>
  );
}

// ─── Deliverable Item ────────────────────────────
function DeliverableItem({ text, checked, onToggle, xp }) {
  return (
    <div className={`deliverable-item${checked ? ' checked' : ''}`} onClick={onToggle}>
      <div className="check-circle">{checked ? '✓' : ''}</div>
      <span className="deliverable-text">{text}</span>
      {!checked && <span className="deliv-xp-tag">+{xp} XP</span>}
    </div>
  );
}

// ─── Module View ─────────────────────────────────
function ModuleView({ mod, state, onQuizAnswer, onDeliverable, accent }) {
  const [tab, setTab] = useState('theorie');

  const quizXp = mod.quiz.reduce((sum, q, qi) => {
    const sv = state[`m${mod.id}_q${qi}`];
    if (!sv) return sum;
    if (q.type === 'mc') return sv.selected === q.answer ? sum + q.xp : sum;
    if (q.type === 'fill' && sv.checked) {
      const v = (sv.fill || '').trim().toLowerCase();
      const ok = q.acceptAny ? v.length > 0 : q.answer.map(a => a.toLowerCase()).includes(v);
      return ok ? sum + q.xp : sum;
    }
    return sum;
  }, 0);

  const delivXp = mod.deliverables.reduce((sum, d, di) =>
    state[`m${mod.id}_d${di}`] ? sum + d.xp : sum, 0);

  return (
    <div className="fade-in">
      {/* Module header */}
      <div className="mod-header">
        <div className="mod-icon" style={{ background: accent + '22', color: accent }}>{mod.emoji}</div>
        <div className="mod-header-info">
          <div className="mod-week-tag">📅 {mod.weeks}</div>
          <h2>{mod.title}</h2>
          <p>{mod.tagline}</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="tab-nav">
        {[
          { id: 'theorie', label: '📖 Theorie' },
          { id: 'quiz', label: '🎯 Quiz' },
          { id: 'codelab', label: '💻 Code Lab' },
          { id: 'opdrachten', label: '📋 Opdrachten' }
        ].map(t => (
          <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Theorie */}
      {tab === 'theorie' && (
        <div className="theory-grid">
          {mod.theory.map((card, i) => <TheoryCard key={i} card={card} accent={accent} />)}
        </div>
      )}

      {/* Quiz */}
      {tab === 'quiz' && (
        <div className="quiz-area">
          {mod.quiz.map((q, qi) => (
            <QuizQuestion
              key={qi} q={q} idx={qi} modId={mod.id}
              saved={state[`m${mod.id}_q${qi}`]}
              onAnswer={(qi, data) => onQuizAnswer(mod.id, qi, data)}
              accent={accent}
            />
          ))}
          <div className="summary-card">
            <div className="summary-icon">⚡</div>
            <div className="summary-info">
              <h3>Quiz voortgang</h3>
              <p>Beantwoord alle vragen voor maximale XP</p>
            </div>
            <div className="summary-xp">
              <div className="val">{quizXp}</div>
              <div className="lbl">/ {mod.quiz.reduce((s, q) => s + q.xp, 0)} XP</div>
            </div>
          </div>
        </div>
      )}

      {/* Code Lab */}
      {tab === 'codelab' && <CodeLab mod={mod} />}

      {/* Opdrachten */}
      {tab === 'opdrachten' && (
        <div>
          <div className="deliverable-list">
            {mod.deliverables.map((d, di) => (
              <DeliverableItem
                key={di} text={d.text} xp={d.xp}
                checked={!!state[`m${mod.id}_d${di}`]}
                onToggle={() => onDeliverable(mod.id, di)}
              />
            ))}
          </div>
          <div className="summary-card" style={{ marginBottom: 24 }}>
            <div className="summary-icon">🎓</div>
            <div className="summary-info">
              <h3>Opdrachten voortgang</h3>
              <p>Teken altijd het UML-diagram erbij!</p>
            </div>
            <div className="summary-xp">
              <div className="val">{delivXp}</div>
              <div className="lbl">/ {mod.deliverables.reduce((s, d) => s + d.xp, 0)} XP</div>
            </div>
          </div>
          <FreeEditor key={mod.id} />
        </div>
      )}
    </div>
  );
}

// ─── Exam Studio ─────────────────────────────────
const EXAM_STARTER = `using System;

class Program
{
    static void Main()
    {
        // Schrijf hier je oplossing

    }
}`;

function ExamStudio({ onClose }) {
  const [openMods,  setOpenMods]  = useState({ 0: true });
  const [openCards, setOpenCards] = useState({});
  const [output,    setOutput]    = useState(null);
  const [running,   setRunning]   = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [suggest,    setSuggest]   = useState({ items:[], idx:0, pos:null, range:null });
  const [stdinModal, setStdinModal] = useState(null);
  const [outHeight,  setOutHeight] = useState(130);
  const editorRef    = useRef(null);
  const containerRef = useRef(null);
  const suggestRef   = useRef(suggest);
  const autoSaveTimer = useRef(null);
  suggestRef.current = suggest;

  const toggleMod  = (mi) => setOpenMods(prev  => ({ ...prev, [mi]: !prev[mi] }));
  const toggleCard = (mi, ci) => {
    const key = `${mi}-${ci}`;
    setOpenCards(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Monaco initialisatie + auto-save
  useEffect(() => {
    if (!containerRef.current || !window.require) return;
    window.require(['vs/editor/editor.main'], () => {
      if (!containerRef.current || editorRef.current) return;
      const saved = localStorage.getItem('exam-studio-code');
      editorRef.current = window.monaco.editor.create(containerRef.current, {
        value: saved || EXAM_STARTER,
        language: 'csharp',
        theme: 'vs',
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on',
        renderWhitespace: 'none',
        padding: { top: 12, bottom: 12 },
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        wordBasedSuggestions: false,
        parameterHints: { enabled: false },
        hover: { enabled: false },
      });
      attachCustomSuggest(editorRef.current, setSuggest, () => suggestRef.current);
      // Auto-save elke 30 seconden
      autoSaveTimer.current = setInterval(() => {
        if (editorRef.current) {
          localStorage.setItem('exam-studio-code', editorRef.current.getValue());
          setLastSaved(new Date().toLocaleTimeString('nl-BE'));
        }
      }, 30000);
    });
    return () => {
      if (editorRef.current) { editorRef.current.dispose(); editorRef.current = null; }
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
      setSuggest({ items:[], idx:0, pos:null, range:null });
    };
  }, []);

  const getCode = () => editorRef.current ? editorRef.current.getValue() : EXAM_STARTER;

  const doRun = async (stdin) => {
    setStdinModal(null);
    setRunning(true);
    setOutput({ type: 'info', text: 'Compileren & uitvoeren...' });
    const result = await runCSharp(getCode(), stdin);
    setRunning(false);
    if (result.corsError) {
      setOutput({ type: 'err', text: 'Compiler niet bereikbaar. Controleer je verbinding.' });
    } else if (result.error && !result.output) {
      setOutput({ type: 'err', text: result.error });
    } else {
      setOutput({ type: 'ok', text: result.output || '(geen output)', err: result.error });
    }
  };

  const handleRun = () => {
    const prompts = parseReadLines(getCode());
    if (prompts.length > 0) { setStdinModal(prompts); return; }
    doRun('');
  };

  const handleReset = () => {
    if (editorRef.current) editorRef.current.setValue(EXAM_STARTER);
    setOutput(null);
    setStdinModal(null);
  };

  const handleDownload = () => {
    const blob = new Blob([getCode()], { type: 'text/plain' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob), download: 'oplossing.cs'
    });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleOpen = () => {
    const input = Object.assign(document.createElement('input'), {
      type: 'file', accept: '.cs,.txt'
    });
    input.onchange = e => {
      const fr = new FileReader();
      fr.onload = ev => { if (editorRef.current) editorRef.current.setValue(ev.target.result); };
      fr.readAsText(e.target.files[0]);
    };
    input.click();
  };

  const handleSaveNow = () => {
    if (editorRef.current) {
      localStorage.setItem('exam-studio-code', editorRef.current.getValue());
      setLastSaved(new Date().toLocaleTimeString('nl-BE'));
    }
  };

  const startResize = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = outHeight;
    const onMove = ev => setOutHeight(Math.max(50, Math.min(500, startH + (startY - ev.clientY))));
    const onUp   = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className="exam-studio">
      {/* ── Linker paneel: leerstof ── */}
      <div className="exam-left">
        <div className="exam-left-header">📖 Leerstof</div>
        {MODULES.map((mod, mi) => (
          <div key={mod.id}>
            <button className="exam-mod-btn" onClick={() => toggleMod(mi)}>
              <span>{mod.emoji}</span>
              <span>{mod.title}</span>
              <span className="chevron">{openMods[mi] ? '▼' : '▶'}</span>
            </button>
            {openMods[mi] && (
              <div className="exam-theory-section">
                {mod.theory.map((card, ci) => (
                  <div className="exam-theory-card" key={ci}>
                    <div className="exam-theory-card-header" onClick={() => toggleCard(mi, ci)}>
                      <span>{card.icon}</span>
                      <span>{card.title}</span>
                      <span style={{ marginLeft: 'auto' }}>
                        {openCards[`${mi}-${ci}`] ? '▲' : '▼'}
                      </span>
                    </div>
                    {openCards[`${mi}-${ci}`] && (
                      <div className="exam-theory-card-body">
                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: "'DM Sans',sans-serif", fontSize: '.82rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: (card.code || card.uml) ? 10 : 0 }}>
                          {card.content}
                        </pre>
                        {card.uml && <MermaidChart chart={card.uml} />}
                        {card.code && (
                          <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: '10px', borderRadius: '6px', fontSize: '.78rem', overflow: 'auto', lineHeight: 1.6, marginTop: 8 }}>
                            {card.code}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Rechter paneel: editor ── */}
      <div className="exam-right">
        <div className="exam-right-toolbar">
          <button className="run-btn" onClick={handleRun} disabled={running}>
            {running ? '⏳' : '▶'} {running ? 'Uitvoeren...' : 'Uitvoeren'}
          </button>
          <button className="reset-btn" onClick={handleReset}>↺ Reset</button>
          <button className="reset-btn" onClick={handleDownload}>⬇ Exporteer .cs</button>
          <button className="reset-btn" onClick={handleOpen}>📂 Open .cs</button>
          <button className="reset-btn" onClick={handleSaveNow}>💾 Opslaan</button>
          {lastSaved && (
            <span className="exam-autosave-badge">✓ Opgeslagen {lastSaved}</span>
          )}
          <button style={{ marginLeft: 'auto' }} className="reset-btn" onClick={onClose}>
            ✕ Sluiten
          </button>
        </div>

        <div className="exam-editor-wrap">
          <div className="editor-container" ref={containerRef} style={{ height: '100%' }} />
        </div>

        {stdinModal && (
          <StdinModal prompts={stdinModal}
            onSubmit={stdin => doRun(stdin)}
            onCancel={() => setStdinModal(null)} />
        )}

        {output && (
          <>
            <div className="resize-handle" onMouseDown={startResize}
                 title="Sleep omhoog/omlaag om de console te vergroten of verkleinen" />
            <div className="exam-output" style={{ height: outHeight }}>
              {output.type === 'info' && <div className="out-info">{output.text}</div>}
              {output.type === 'ok' && (
                <>
                  <div className="out-ok">{output.text}</div>
                  {output.err && <div className="out-err" style={{ marginTop: 6 }}>{output.err}</div>}
                </>
              )}
              {output.type === 'err' && <div className="out-err">{output.text}</div>}
            </div>
          </>
        )}

        <SuggestDropdown
          items={suggest.items} idx={suggest.idx} pos={suggest.pos}
          onAccept={item => {
            if (editorRef.current && suggest.range) {
              editorRef.current.executeEdits('cs-suggest', [{
                range: suggest.range, text: item.text, forceMoveMarkers: true
              }]);
              editorRef.current.focus();
            }
            setSuggest({ items:[], idx:0, pos:null, range:null });
          }}
          onHover={i => setSuggest(s => ({ ...s, idx: i }))}
        />
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────
function App() {
  const [state, setState] = useState(() => loadState());
  const [activeIdx, setActiveIdx] = useState(null); // null = overzicht

  useEffect(() => { saveState(state); }, [state]);

  const TOTAL_XP = MODULES.reduce((sum, mod) => {
    const qxp = mod.quiz.reduce((s, q) => s + q.xp, 0);
    const dxp = mod.deliverables.reduce((s, d) => s + d.xp, 0);
    return sum + qxp + dxp;
  }, 0);

  const totalXP = MODULES.reduce((sum, mod) => {
    const qxp = mod.quiz.reduce((s, q, qi) => {
      const sv = state[`m${mod.id}_q${qi}`];
      if (!sv) return s;
      if (q.type === 'mc') return sv.selected === q.answer ? s + q.xp : s;
      if (q.type === 'fill' && sv.checked) {
        const v = (sv.fill || '').trim().toLowerCase();
        const ok = q.acceptAny ? v.length > 0 : q.answer.map(a => a.toLowerCase()).includes(v);
        return ok ? s + q.xp : s;
      }
      return s;
    }, 0);
    const dxp = mod.deliverables.reduce((s, d, di) =>
      state[`m${mod.id}_d${di}`] ? s + d.xp : s, 0);
    return sum + qxp + dxp;
  }, 0);

  const modProgress = (mod) => {
    const qDone = mod.quiz.filter((q, qi) => {
      const sv = state[`m${mod.id}_q${qi}`];
      if (!sv) return false;
      return q.type === 'mc' ? sv.selected !== null && sv.selected !== undefined : sv.checked;
    }).length;
    const dDone = mod.deliverables.filter((_, di) => state[`m${mod.id}_d${di}`]).length;
    return { done: qDone + dDone, total: mod.quiz.length + mod.deliverables.length };
  };

  const onQuizAnswer = (modId, qi, data) => {
    setState(s => ({ ...s, [`m${modId}_q${qi}`]: data }));
  };

  const onDeliverable = (modId, di) => {
    const key = `m${modId}_d${di}`;
    setState(s => ({ ...s, [key]: !s[key] }));
  };

  const mod = (activeIdx !== null && activeIdx !== 'studio') ? MODULES[activeIdx] : null;

  // ── Examen Studio ──
  if (activeIdx === 'studio') {
    return <ExamStudio onClose={() => setActiveIdx(null)} />;
  }

  // ── Overzichtspagina ──
  if (activeIdx === null) {
    return (
      <div className="app-shell" style={{ gridTemplateColumns: '1fr' }}>
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-brand">
            <div className="topbar-brand-icon">🎓</div>
            <div>
              <h1>OO Studio</h1>
              <p>Object Georiënteerd Programmeren in C# · Odisee Graduaat</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="exam-studio-btn" onClick={() => setActiveIdx('studio')} title="Open Examen Studio — split-screen met leerstof + editor">
              🖥️ Examen Studio
            </button>
            <div className="xp-badge">⚡ <span>{totalXP}</span> / {TOTAL_XP} XP</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline-bar">
          <div className="timeline">
            {MODULES.map((m, i) => {
              const p = modProgress(m);
              const done = p.done === p.total && p.total > 0;
              const active = !done && p.done > 0;
              return (
                <div key={m.id} className={`tl-step${done ? ' done' : active ? ' active' : ''}`}
                  onClick={() => setActiveIdx(i)}>
                  <div className="tl-dot">{m.emoji}</div>
                  <div className="tl-label">M{m.id}<br />{m.weeks.replace('Week ', 'W')}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inhoud */}
        <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          {/* Hero */}
          <div className="welcome-hero">
            <h2>Welkom bij OO Studio</h2>
            <p>Leer Object Georiënteerd Programmeren in C# stap voor stap — van klassen en objecten tot exceptions en compositie. Elk module combineert theorie, UML-diagrammen, interactieve quizzen en een live C# editor.</p>
            <div className="welcome-tags">
              <span className="welcome-tag">🏗️ Klassen & Objecten</span>
              <span className="welcome-tag">🔗 Overerving</span>
              <span className="welcome-tag">🎭 Polymorfisme</span>
              <span className="welcome-tag">🔲 Interfaces</span>
              <span className="welcome-tag">📐 UML-diagrammen</span>
              <span className="welcome-tag">💻 Live C# Editor</span>
            </div>
          </div>

          {/* Voortgangsbalk */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '.88rem' }}>Totale voortgang</span>
              <span style={{ fontSize: '.8rem', color: 'var(--text3)' }}>{totalXP} / {TOTAL_XP} XP</span>
            </div>
            <div className="prog-bar-outer" style={{ height: 10 }}>
              <div className="prog-bar-inner" style={{ width: `${TOTAL_XP > 0 ? (totalXP / TOTAL_XP) * 100 : 0}%` }} />
            </div>
          </div>

          {/* Module kaarten */}
          <div className="overview-grid">
            {MODULES.map((m, i) => {
              const p = modProgress(m);
              const pct = p.total > 0 ? Math.round((p.done / p.total) * 100) : 0;
              return (
                <div key={m.id} className="overview-card"
                  style={{ borderTop: `4px solid ${m.color}` }}
                  onClick={() => setActiveIdx(i)}>
                  <div className="oc-emoji">{m.emoji}</div>
                  <div className="oc-week">Module {m.id} · {m.weeks}</div>
                  <div className="oc-title">{m.title}</div>
                  <div className="oc-desc">{m.tagline}</div>
                  <div>
                    <div className="oc-prog-label">
                      <span>{p.done}/{p.total} voltooid</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="oc-prog-bar">
                      <div className="oc-prog-inner" style={{ width: `${pct}%`, background: m.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Module detailpagina ──
  const p = modProgress(mod);
  const pct = p.total > 0 ? Math.round((p.done / p.total) * 100) : 0;

  return (
    <div className="app-shell">
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-brand">
          <button onClick={() => setActiveIdx(null)}
            style={{ background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 16, marginRight: 4 }}>
            ←
          </button>
          <div className="topbar-brand-icon" style={{ background: mod.color }}>
            {mod.emoji}
          </div>
          <div>
            <h1>OO Studio</h1>
            <p>{mod.title} · {mod.weeks}</p>
          </div>
        </div>
        <div className="xp-badge">⚡ <span>{totalXP}</span> / {TOTAL_XP} XP</div>
      </div>

      {/* Timeline */}
      <div className="timeline-bar">
        <div className="timeline">
          {MODULES.map((m, i) => {
            const pp = modProgress(m);
            const done = pp.done === pp.total && pp.total > 0;
            return (
              <div key={m.id} className={`tl-step${done ? ' done' : i === activeIdx ? ' active' : ''}`}
                onClick={() => setActiveIdx(i)}>
                <div className="tl-dot">{m.emoji}</div>
                <div className="tl-label">M{m.id}<br />{m.weeks.replace('Week ', 'W')}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-section-title">Modules</div>
        {MODULES.map((m, i) => {
          const pp = modProgress(m);
          return (
            <button key={m.id} className={`mod-nav-btn${i === activeIdx ? ' active' : ''}`}
              onClick={() => setActiveIdx(i)}>
              <div className="mnb-emoji" style={{ background: m.color + '22' }}>{m.emoji}</div>
              <div className="mnb-info">
                <div className="mnb-title">{m.title}</div>
                <div className="mnb-sub">{pp.done}/{pp.total} voltooid</div>
              </div>
            </button>
          );
        })}
        <div className="sidebar-progress">
          <div className="prog-label">
            <span>Totaal</span>
            <span>{totalXP} XP</span>
          </div>
          <div className="prog-bar-outer">
            <div className="prog-bar-inner" style={{ width: `${TOTAL_XP > 0 ? (totalXP / TOTAL_XP) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        <ModuleView
          mod={mod} state={state} accent={mod.color}
          onQuizAnswer={onQuizAnswer} onDeliverable={onDeliverable}
        />
      </div>
    </div>
  );
}

// ─── Render ──────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(<App />);

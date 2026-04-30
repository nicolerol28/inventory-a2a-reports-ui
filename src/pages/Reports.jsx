import { useState } from 'react'
import { generateReport } from '../api/reportsClient.js'

const SUGGESTED_REPORTS = [
  { label: "Reporte ejecutivo general", query: "Genera un reporte ejecutivo completo del estado del inventario en todas las bodegas, incluyendo productos criticos y recomendaciones" },
  { label: "Comparativa entre bodegas", query: "Compara el stock de las tres bodegas, identifica diferencias significativas y sugiere redistribucion de productos" },
  { label: "Productos criticos", query: "Lista todos los productos que estan por debajo del stock minimo en cada bodega, priorizados por urgencia" },
  { label: "Plan de compras", query: "Genera un plan de compras sugeridas basado en los niveles actuales de stock y los minimos requeridos" },
];

function SunIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

export default function Reports({ user, onLogout, isDark, onToggleDark }) {
  const [query, setQuery] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(text) {
    const queryText = text || query;
    if (!queryText.trim()) return;
    setError("");
    setLoading(true);
    setReport(null);
    try {
      const result = await generateReport(queryText);
      setReport(result);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError("El servidor tardó demasiado. Intenta de nuevo.");
      } else if (!err.response) {
        setError("Sin conexión. Verifica tu red e intenta de nuevo.");
      } else if (err.response.status === 429) {
        setError("Demasiadas solicitudes. Espera un momento.");
      } else {
        setError("Error del servidor. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleGenerate();
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 transition-colors duration-300">

      {/* Nav */}
      <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 bg-white dark:bg-gray-900 border-b border-blue-100 dark:border-gray-800 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="logo" className="w-8 h-8" />
          <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">Reports Agent</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            A2A
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500 dark:text-gray-400">{user.name || user.sub}</span>
          <span className="text-blue-200 dark:text-gray-600">|</span>
          <button
            type="button"
            onClick={onToggleDark}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            aria-label="Cambiar tema"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button type="button" aria-label="Cerrar sesión" onClick={onLogout} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
            Salir
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="text-center py-10 px-6 bg-white dark:bg-gray-900 border-b border-blue-100 dark:border-gray-800 transition-colors duration-300">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">¿Qué reporte necesitas hoy?</h1>
        <p className="text-sm text-blue-500 dark:text-blue-400">
          Consulta tu inventario en lenguaje natural · análisis listos para presentar
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-6 py-8 gap-5">

        {/* Chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          {SUGGESTED_REPORTS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleGenerate(item.query)}
              disabled={loading}
              className="px-4 py-1.5 text-sm rounded-lg border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Output */}
        <div aria-live="polite" aria-atomic="false" className="flex-1 rounded-xl border border-blue-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300" style={{ minHeight: "280px" }}>
          {loading && (
            <div className="flex items-center justify-center h-full min-h-[280px]">
              <div className="text-center">
                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Generando reporte...</p>
                <p className="text-xs text-blue-400 dark:text-blue-500 mt-1">Consultando datos via A2A</p>
              </div>
            </div>
          )}
          {error && !loading && (
            <div className="p-6">
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            </div>
          )}
          {report !== null && !loading && (
            report === ""
              ? <div className="p-6"><p className="text-sm text-gray-400">El agente no generó contenido. Intenta reformular tu consulta.</p></div>
              : <div className="p-6 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{report}</div>
          )}
          {report === null && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-full min-h-[280px] gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-50 dark:bg-gray-800">
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <circle cx="9" cy="9" r="7" stroke="#2563EB" strokeWidth="1.5" />
                  <path d="M9 3v6l4 2" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500">El reporte aparecerá aquí</p>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <label htmlFor="report-query" className="sr-only">
            Describe el reporte que necesitas
          </label>
          <input
            id="report-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe el reporte que necesitas..."
            maxLength={1000}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Generar
          </button>
        </form>

      </div>
    </div>
  );
}

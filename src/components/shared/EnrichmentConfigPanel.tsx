import { useState } from 'react'
import { emailEnrichmentConfig, phoneEnrichmentConfig } from '@/data/mockEnrichment'
import { IconClose, IconDragHandle, IconChevronRight, IconCoin } from '@/components/shared/Icons'
import './EnrichmentConfigPanel.css'

interface Props {
  onClose: () => void
  type?: 'email' | 'phone'
  onApproachChange?: (approach: 'verified' | 'any') => void
  onValidationChange?: (enabled: boolean) => void
}

export default function EnrichmentConfigPanel({ onClose, type = 'email', onApproachChange, onValidationChange }: Props) {
  const config = type === 'phone' ? phoneEnrichmentConfig : emailEnrichmentConfig
  const isPhone = type === 'phone'

  const [sources, setSources] = useState(
    config.sources.map((s) => ({ name: s.name, creditCost: s.creditCost, enabled: s.enabled }))
  )
  const [validationEnabled, setValidationEnabled] = useState(config.validationSource?.enabled ?? false)
  const [stopWhen, setStopWhen] = useState<'verified' | 'any'>(config.stopWhen)
  const [vizOpen, setVizOpen] = useState(false)

  // First source (Apollo) is always on
  const enabledSources = sources.filter((s, i) => i === 0 || s.enabled)
  const enabledCosts = enabledSources.map((s) => s.creditCost)
  const validationCost = validationEnabled && config.validationSource ? config.validationSource.creditCost : 0
  const minCredits = enabledSources.length > 0 ? enabledSources[0].creditCost + validationCost : 0
  const maxCredits = enabledCosts.length > 0 ? enabledCosts.reduce((a, b) => a + b, 0) + validationCost : 0

  function toggleSource(index: number) {
    if (index === 0) return // Apollo is always on
    setSources((prev) => prev.map((s, i) => (i === index ? { ...s, enabled: !s.enabled } : s)))
  }

  // Build enabled indices for connector logic
  const enabledIndices = sources.reduce<number[]>((acc, s, i) => {
    if (i === 0 || s.enabled) acc.push(i)
    return acc
  }, [])

  // Connector label changes based on stop-when mode
  const connectorLabel = !isPhone && stopWhen === 'verified' ? 'not verified' : 'not found'

  return (
    <div className="ecp-panel-inline">
      {/* Header */}
      <div className="ecp-header">
        <h3 className="text-body-sm font-medium">{isPhone ? 'Phone' : 'Email'} Enrichment</h3>
        <button className="ecp-close" onClick={onClose}>
          <IconClose size={14} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="ecp-body">

        {/* ── Approach — email only ── */}
        {!isPhone && (
          <div className="ecp-stop-section">
            <div className="ecp-stop-title text-caption font-medium">Approach</div>

            {/* Verified option */}
            <label className={`ecp-stop-card${stopWhen === 'verified' ? ' ecp-stop-card-active' : ''}`}>
              <input
                type="radio"
                name="stopWhen"
                value="verified"
                checked={stopWhen === 'verified'}
                onChange={() => { setStopWhen('verified'); setVizOpen(false); onApproachChange?.('verified') }}
                className="ecp-sr-only"
              />
              <span className="ecp-radio-dot" />
              <div className="ecp-stop-card-body">
                <span className="ecp-stop-card-heading text-caption font-medium">Search until verified</span>
                {stopWhen === 'verified' && (
                  <>
                    <span className="ecp-stop-card-desc text-caption text-secondary">
                      Each source is tried in order. If a source returns an email that can't be verified, the search continues to the next source. You get the highest deliverability.
                    </span>
                    <button
                      className="ecp-viz-toggle text-caption"
                      onClick={(e) => { e.preventDefault(); setVizOpen((v) => !v) }}
                    >
                      <IconChevronRight size={10} className={`ecp-viz-chevron${vizOpen ? ' ecp-viz-chevron-open' : ''}`} />
                      Visualize
                    </button>
                    {vizOpen && (
                      <div className="ecp-mini-flow">
                        <div className="ecp-mini-step">
                          <span className="ecp-mini-source">Apollo</span>
                          <span className="ecp-mini-pill ecp-mini-pill-fail">
                            <span className="ecp-mini-icon ecp-mini-icon-fail">&times;</span>
                            No email
                          </span>
                        </div>
                        <span className="ecp-mini-arrow">&rarr;</span>
                        <div className="ecp-mini-step">
                          <span className="ecp-mini-source">Data source 2</span>
                          <span className="ecp-mini-pill ecp-mini-pill-warn">
                            <span className="ecp-mini-icon ecp-mini-icon-warn">?</span>
                            Unverified
                          </span>
                        </div>
                        <span className="ecp-mini-arrow">&rarr;</span>
                        <div className="ecp-mini-step">
                          <span className="ecp-mini-source">Data source 3</span>
                          <span className="ecp-mini-pill ecp-mini-pill-success ecp-mini-pill-match-green">
                            <span className="ecp-mini-icon ecp-mini-icon-success">&#10003;</span>
                            Verified
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </label>

            {/* Any option */}
            <label className={`ecp-stop-card${stopWhen === 'any' ? ' ecp-stop-card-active' : ''}`}>
              <input
                type="radio"
                name="stopWhen"
                value="any"
                checked={stopWhen === 'any'}
                onChange={() => { setStopWhen('any'); setVizOpen(false); onApproachChange?.('any') }}
                className="ecp-sr-only"
              />
              <span className="ecp-radio-dot" />
              <div className="ecp-stop-card-body">
                <span className="ecp-stop-card-heading text-caption font-medium">Search until any email is found</span>
                {stopWhen === 'any' && (
                  <>
                    <span className="ecp-stop-card-desc text-caption text-secondary">
                      The search stops as soon as any source returns an email, regardless of verification status. Uses fewer credits per record on average.
                    </span>
                    <button
                      className="ecp-viz-toggle text-caption"
                      onClick={(e) => { e.preventDefault(); setVizOpen((v) => !v) }}
                    >
                      <IconChevronRight size={10} className={`ecp-viz-chevron${vizOpen ? ' ecp-viz-chevron-open' : ''}`} />
                      Visualize
                    </button>
                    {vizOpen && (
                      <div className="ecp-mini-flow">
                        <div className="ecp-mini-step">
                          <span className="ecp-mini-source">Apollo</span>
                          <span className="ecp-mini-pill ecp-mini-pill-fail">
                            <span className="ecp-mini-icon ecp-mini-icon-fail">&times;</span>
                            No email
                          </span>
                        </div>
                        <span className="ecp-mini-arrow">&rarr;</span>
                        <div className="ecp-mini-step">
                          <span className="ecp-mini-source">Data source 2</span>
                          <span className="ecp-mini-pill ecp-mini-pill-warn ecp-mini-pill-match-warn">
                            <span className="ecp-mini-icon ecp-mini-icon-warn">?</span>
                            Any status
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </label>
          </div>
        )}

        {/* ── Approach explainer for phone ── */}
        {isPhone && (
          <div className="ecp-stop-section">
            <div className="ecp-stop-title text-caption font-medium">Approach</div>
            <span className="ecp-phone-explainer text-caption text-secondary">
              Sources are checked in order until a valid phone number is found. The search stops on the first match, and you're only charged for sources that were queried.
            </span>
          </div>
        )}

        {/* ── Waterfall sources tree ── */}
        <div className="ecp-tree">
          <div className="ecp-tree-title text-caption text-secondary">Sources</div>

          {sources.map((source, i) => {
            const isFirst = i === 0
            const isEnabled = isFirst || source.enabled
            const prevEnabledIdx = enabledIndices.indexOf(i)
            const showConnector = isEnabled && prevEnabledIdx > 0

            return (
              <div key={source.name}>
                {showConnector && (
                  <div className="ecp-connector">
                    <div className="ecp-connector-track">
                      <span className="ecp-connector-line" />
                      <span className="ecp-connector-label">{connectorLabel}</span>
                      <span className="ecp-connector-line" />
                    </div>
                  </div>
                )}
                <div
                  className={`ecp-pill${isEnabled ? '' : ' ecp-pill-disabled'}`}
                  style={{ marginLeft: Math.min(i * 4, 24) }}
                >
                  <IconDragHandle size={12} className="ecp-pill-drag" />
                  {isFirst ? (
                    <span className="ecp-pill-always">ON</span>
                  ) : (
                    <label className="ecp-toggle">
                      <input
                        type="checkbox"
                        checked={source.enabled}
                        onChange={() => toggleSource(i)}
                      />
                      <span className="ecp-toggle-track" />
                    </label>
                  )}
                  <span className="ecp-pill-name">{source.name}</span>
                  <span className="ecp-pill-dots" />
                  <span className="ecp-pill-cost">{source.creditCost} <IconCoin size={11} /></span>
                </div>
              </div>
            )
          })}

          {/* Validation branch — email only */}
          {!isPhone && config.validationSource && (
            <>
              {enabledSources.length > 0 && (
                <div className="ecp-connector ecp-connector-found">
                  <div className="ecp-connector-track">
                    <span className="ecp-connector-line ecp-connector-line-green" />
                    <span className="ecp-connector-label ecp-connector-label-green">found</span>
                    <span className="ecp-connector-line ecp-connector-line-green" />
                  </div>
                </div>
              )}
              <div className={`ecp-pill ecp-pill-validate${validationEnabled ? '' : ' ecp-pill-disabled'}`}>
                <span className="ecp-pill-validate-tag">validate</span>
                <label className="ecp-toggle">
                  <input
                    type="checkbox"
                    checked={validationEnabled}
                    onChange={() => { const next = !validationEnabled; setValidationEnabled(next); onValidationChange?.(next) }}
                  />
                  <span className="ecp-toggle-track" />
                </label>
                <span className="ecp-pill-name">{config.validationSource.name}</span>
                <span className="ecp-pill-dots" />
                <span className="ecp-pill-cost">{config.validationSource.creditCost} <IconCoin size={11} /></span>
              </div>
              <span className="ecp-validate-helper text-caption text-secondary">
                Once an email is found, ZeroBounce checks that the address is deliverable before storing it. This reduces bounce rates and protects your sender reputation.
              </span>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="ecp-footer">
        <span className="ecp-footer-credits">
          <strong>{minCredits}&ndash;{maxCredits}</strong> credits per record
        </span>
        <button className="ecp-done-btn" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  )
}

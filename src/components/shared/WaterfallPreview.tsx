import { emailEnrichmentConfig } from '@/data/mockEnrichment'
import { IconSettings, IconCoin } from '@/components/shared/Icons'
import './WaterfallPreview.css'

interface WaterfallPreviewProps {
  emailApproach: 'verified' | 'any'
  emailValidation: boolean
  onConfigEmail: () => void
}

export default function WaterfallPreview({
  emailApproach,
  emailValidation,
  onConfigEmail,
}: WaterfallPreviewProps) {
  const emailSources = emailEnrichmentConfig.sources.filter((s) => s.enabled)
  const emailValidationCost =
    emailValidation && emailEnrichmentConfig.validationSource
      ? emailEnrichmentConfig.validationSource.creditCost
      : 0
  const emailMin =
    emailSources.length > 0 ? emailSources[0].creditCost + emailValidationCost : 0
  const emailMax =
    emailSources.reduce((a, s) => a + s.creditCost, 0) + emailValidationCost

  const connectorLabel = emailApproach === 'verified' ? 'not verified' : 'not found'

  // Total items for the line: sources + connectors between them + optional validate
  const totalSources = emailSources.length
  const hasValidate = emailValidation && !!emailEnrichmentConfig.validationSource

  return (
    <div className="wfp-root">
      {/* Section header */}
      <div className="wfp-section-header">
        <span className="wfp-section-title text-caption font-medium">Email</span>
        <span className="wfp-section-range text-caption text-secondary">
          {emailMin}&ndash;{emailMax} cr / record
        </span>
        <button className="wfp-gear" onClick={onConfigEmail} title="Configure email enrichment">
          <IconSettings size={12} />
        </button>
      </div>

      {/* Approach header */}
      <div className="wfp-approach">
        <span className="wfp-approach-label text-caption text-secondary">
          {emailApproach === 'verified' ? 'Stop when verified' : 'Accept first match'}
        </span>
      </div>

      {/* Source rows with vertical track line */}
      <div className="wfp-sources">
        {emailSources.map((source, i) => {
          const isFirst = i === 0
          const isLast = i === totalSources - 1 && !hasValidate
          return (
            <div key={source.name}>
              {/* Connector above (except first) */}
              {!isFirst && (
                <div className="wfp-track">
                  <div className="wfp-track-line">
                    <div className="wfp-track-line-segment" />
                  </div>
                  <div className="wfp-track-content">
                    <span className="wfp-connector-label text-caption">{connectorLabel}</span>
                  </div>
                </div>
              )}
              {/* Source row */}
              <div className="wfp-track">
                <div className="wfp-track-line">
                  {!isFirst && <div className="wfp-track-line-segment" style={{ maxHeight: 4 }} />}
                  {isFirst
                    ? <div className="wfp-track-line-dot" />
                    : <div className="wfp-track-line-dot-empty" />
                  }
                  {!isLast && <div className="wfp-track-line-segment" />}
                </div>
                <div className="wfp-track-content">
                  <div className="wfp-source-row">
                    <span className="wfp-source-name text-caption">{source.name}</span>
                    <span className="wfp-source-cost text-caption">
                      {source.creditCost} <IconCoin size={10} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Validate step */}
        {hasValidate && emailEnrichmentConfig.validationSource && (
          <>
            {/* "found" connector */}
            <div className="wfp-track">
              <div className="wfp-track-line">
                <div className="wfp-track-line-segment" />
              </div>
              <div className="wfp-track-content">
                <span className="wfp-connector-label wfp-connector-label-found text-caption">found</span>
              </div>
            </div>
            {/* ZeroBounce validate row */}
            <div className="wfp-track">
              <div className="wfp-track-line">
                <div className="wfp-track-line-segment" style={{ maxHeight: 4 }} />
                <div className="wfp-track-line-dot-empty" />
              </div>
              <div className="wfp-track-content">
                <div className="wfp-source-row">
                  <span className="wfp-validate-tag">VALIDATE</span>
                  <span className="wfp-source-name text-caption">
                    {emailEnrichmentConfig.validationSource.name}
                  </span>
                  <span className="wfp-source-cost text-caption">
                    {emailEnrichmentConfig.validationSource.creditCost} <IconCoin size={10} />
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

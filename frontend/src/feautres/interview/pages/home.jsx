import React, { useState, useRef, useEffect } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const getScoreStyle = (score) => {
  if (score >= 80) return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' }
  if (score >= 60) return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' }
  return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' }
}

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const recentStyles = {
  section: {
    width: '100%',
    maxWidth: '980px',
    padding: '2rem 2.5rem',
    background: 'rgba(15, 18, 28, 0.7)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '1.5rem',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), 0 0 50px rgba(99, 102, 241, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  dot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: '#6366f1',
    boxShadow: '0 0 8px #6366f1',
    flexShrink: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem 1rem',
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: '0.88rem',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem 1rem',
    color: '#a5b4fc',
    fontSize: '0.88rem',
    letterSpacing: '0.05em',
  },
}

const ReportCard = ({ report, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const score = report.matchScore ?? 0
  const scoreStyle = getScoreStyle(score)

  return (
    <button
      type="button"
      className="recent-report-card"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        width: '100%',
        padding: '1rem 1.25rem',
        background: hovered ? 'rgba(15, 18, 28, 0.9)' : 'rgba(10, 12, 20, 0.5)',
        border: `1px solid ${hovered ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: '0.75rem',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: hovered
          ? '0 4px 12px rgba(99, 102, 241, 0.08), 0 0 10px rgba(99, 102, 241, 0.1)'
          : 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: '0.92rem',
          fontWeight: 600,
          color: '#f1f5f9',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {report.title}
        </p>
        <p style={{
          margin: '0.35rem 0 0',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.35)',
          letterSpacing: '0.02em',
        }}>
          {formatDate(report.createdAt)}
        </p>
      </div>
      <span style={{
        flexShrink: 0,
        padding: '0.35rem 0.75rem',
        borderRadius: '2rem',
        fontSize: '0.78rem',
        fontWeight: 700,
        color: scoreStyle.color,
        background: scoreStyle.bg,
        border: `1px solid ${scoreStyle.border}`,
      }}>
        {score}%
      </span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={hovered ? '#a5b4fc' : 'rgba(255, 255, 255, 0.25)'}
        style={{ flexShrink: 0, transition: 'stroke 0.25s ease' }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}

const Home = () => {
  const { loading, reports, genearateReport, getAllReports } = useInterview()
  const [jobDescription, setjobDescription] = useState("")
  const [selfDescription, setselfDescription] = useState("")
  const resumeRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    getAllReports()
  }, [])

  const handleGenerateReport = async () => {
    const resumeFile = resumeRef.current.files[0]
    const data = await genearateReport({ jobDescrption: jobDescription, selfDescription, resumeFile })
    getAllReports()
    navigate(`/interview/${data?._id}`)
  }

  const recentReports = (reports || []).slice(0, 5)

  return (
    <main className='home' style={{ flexDirection: 'column', gap: '2rem', alignItems: 'center', paddingBottom: '3rem' }}>
      <div className="interviewInput-grp">
        <div className="left">
          <label htmlFor="jobDescription">Job Description</label>
          <textarea onChange={(e) => { setjobDescription(e.target.value) }} name="jobDescription" id="jobDescription" placeholder='enter job description here'></textarea>
        </div>
        <div className="right">
          <div className="input-grp">
            <p>Resume <small className='highlight'>( use resume and self description together)</small> </p>
            <label className='file-label' htmlFor="resume">upload resume</label>
            <input ref={resumeRef} hidden type="file" name='resume' id='resume' accept='.pdf' />
          </div>
          <div className="input-grp">
            <label htmlFor="selfDescription">self description</label>
            <textarea onChange={(e) => { setselfDescription(e.target.value) }} name="selfDescription" id="selfDescription" placeholder='enter self description here'></textarea>
          </div>
        </div>
        <button onClick={handleGenerateReport} className='generate-btn button primary-button'>Generate Interview Report</button>
      </div>

      <section style={recentStyles.section}>
        <div style={recentStyles.header}>
          <span style={recentStyles.dot} />
          Recent Reports
        </div>

        {loading && recentReports.length === 0 ? (
          <p style={recentStyles.loading}>Loading reports...</p>
        ) : recentReports.length === 0 ? (
          <p style={recentStyles.empty}>No reports yet. Generate your first interview report above.</p>
        ) : (
          <div style={recentStyles.list}>
            {recentReports.map((report) => (
              <ReportCard
                key={report._id}
                report={report}
                onClick={() => navigate(`/interview/${report._id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Home

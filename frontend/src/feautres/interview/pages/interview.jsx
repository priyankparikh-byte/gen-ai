import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import "../style/interview.scss"
import { useInterview } from '../hooks/useInterview.js'
import { generateResumePdf } from '../services/interview.api.js'


// ── Nav Items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    {
        id: 'technical', label: 'Technical Questions', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
        )
    },
    {
        id: 'behavioral', label: 'Behavioral Questions', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )
    },
    {
        id: 'roadmap', label: 'Road Map', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
        )
    },
]


// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

const getResumeFileName = (reportData) => {
    const sourceText = [reportData?.resume, reportData?.selfDescription, reportData?.title]
        .filter(Boolean)
        .join(' ')

    const match = sourceText.match(/\b([A-Z][a-z]+(?:-[A-Z][a-z]+)?)\s+([A-Z][a-z]+(?:-[A-Z][a-z]+)?)\b/)

    if (match) {
        const firstName = match[1].replace(/[^A-Za-z0-9]+/g, '')
        const lastName = match[2].replace(/[^A-Za-z0-9]+/g, '')
        return `${firstName}_${lastName}_Resume.pdf`
    }

    return 'Resume.pdf'
}


// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const [resumeGenerating, setResumeGenerating] = useState(false)
    const [resumeMessage, setResumeMessage] = useState('')
    const [resumeMessageType, setResumeMessageType] = useState('info')
    const [resumeDownloadUrl, setResumeDownloadUrl] = useState('')
    const [resumeFileName, setResumeFileName] = useState('Resume.pdf')
    const { report, getReportById,loading} = useInterview()
    const { interviewId } = useParams()
  
    useEffect(() => {
        if (!report && interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId, report, getReportById])

    // Destructure report with safe fallbacks
    const technicalQuestions = report?.technicalQuestions || []
    const behavioralQuestions = report?.behavioralQuestions || []
    const preparationPlan = report?.preparationPlan || []
    const skillGaps = report?.skillGaps || []
    const matchScore = report?.matchScore || 0

    // ── Score helpers ──────────────────────────────────────────────────────────
    const scoreColor =
        matchScore >= 80 ? 'score--high' :
            matchScore >= 60 ? 'score--mid' : 'score--low'

    const scoreMessage =
        matchScore >= 80 ? 'Excellent match for this role' :
            matchScore >= 60 ? 'Strong match for this role' : 'Room for improvement'

    const handleGenerateResume = async () => {
        if (!report?._id || resumeGenerating) {
            return
        }

        setResumeGenerating(true)
        setResumeMessage('')
        setResumeMessageType('info')

        try {
            const response = await generateResumePdf(report._id)
            const contentType = response.headers?.['content-type'] || 'application/pdf'
            const blob = new Blob([response.data], { type: contentType })
            const fileName = getResumeFileName(report)
            const downloadUrl = window.URL.createObjectURL(blob)
            setResumeDownloadUrl(downloadUrl)
            setResumeFileName(fileName)

            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            link.remove()
            setResumeMessage(`Resume downloaded successfully as ${fileName}`)
            setResumeMessageType('success')
        } catch (error) {
            console.error(error)
            setResumeMessageType('error')
            if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
                setResumeMessage('The resume generation timed out. Please try again.')
            } else {
                setResumeMessage('We could not generate your resume right now. Please try again.')
            }
        } finally {
            setResumeGenerating(false)
        }
    }

    if(loading) {
        return (
            <div className='loading-screen'>
                <div className='loading-spinner'></div>
                <p>Generating your interview report...</p>
            </div>
        )
    } 
    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'flex-start' }}>
                        <button type='button' className='button primary-button download-btn' onClick={handleGenerateResume} disabled={resumeGenerating}>
                            <svg height={"0.8rem"} style={{ marginRight: "0.4rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                            {resumeGenerating ? 'Generating your ATS-friendly resume...' : 'Generate Resume'}
                        </button>
                        {resumeDownloadUrl ? (
                            <a
                                href={resumeDownloadUrl}
                                download={resumeFileName}
                                style={{ fontSize: '0.8rem', color: '#a5b4fc', textDecoration: 'underline' }}
                            >
                                Download Resume
                            </a>
                        ) : null}
                        {resumeMessage ? (
                            <p style={{ margin: 0, fontSize: '0.8rem', color: resumeMessageType === 'error' ? '#fda4af' : '#86efac', lineHeight: 1.4 }}>
                                {resumeMessage}
                            </p>
                        ) : null}
                    </div>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <svg className='match-score__svg' viewBox="0 0 120 120">
                                <circle className='match-score__track' cx="60" cy="60" r="52" />
                                <circle className='match-score__fill' cx="60" cy="60" r="52"
                                    strokeDasharray={`${(matchScore / 100) * 326.73} 326.73`}
                                />
                            </svg>
                            <div className='match-score__text'>
                                <span className='match-score__value'>{matchScore}</span>
                                <span className='match-score__pct'>%</span>
                            </div>
                        </div>
                        <p className='match-score__sub'>{scoreMessage}</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Quick Stats */}
                    <div className='quick-stats'>
                        <p className='quick-stats__label'>Prep Overview</p>
                        <div className='quick-stats__grid'>
                            <div className='stat-card'>
                                <span className='stat-card__value'>{technicalQuestions.length}</span>
                                <span className='stat-card__name'>Technical</span>
                            </div>
                            <div className='stat-card'>
                                <span className='stat-card__value'>{behavioralQuestions.length}</span>
                                <span className='stat-card__name'>Behavioral</span>
                            </div>
                            <div className='stat-card'>
                                <span className='stat-card__value'>{preparationPlan.length}</span>
                                <span className='stat-card__name'>Day Plan</span>
                            </div>
                            <div className='stat-card'>
                                <span className='stat-card__value'>{skillGaps.length}</span>
                                <span className='stat-card__name'>Skill Gaps</span>
                            </div>
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview
'use client';

import Image from 'next/image';
import { FiUser, FiClock, FiMail, FiFileText, FiCamera, FiMonitor, FiPrinter, FiDownload } from 'react-icons/fi';
import { useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ExamReport({ result, skill }) {
    const reportRef = useRef(null);
    const pdfReportRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfMode, setPdfMode] = useState(false);

    if (!result) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
    };

    const formatImageDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        const formattedTime = `${hours12}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
        return `${month}/${day}/${year} - (${formattedTime})`;
    };

    const handlePrint = () => {
        window.print();
    };

    // Calculate all values before PDFSafeReport component
    const overallScore = result.overall?.score || 0;
    const maxScore = result.overall?.maxScore || 0;
    const percentage = result.overall?.percentage || 0;
    const percentile = result.overall?.percentile || 0;
    const absoluteScore = result.overall?.absoluteScore || '0 / 0';

    const sectionScore = result.section?.score || 0;
    const sectionMaxScore = result.section?.maxScore || 0;
    const sectionPercentage = result.section?.percentage || 0;
    const sectionPercentile = result.section?.percentile || 0;

    // Get proctoring images
    const proctoringInfo = result.proctoringInfo || [];
    const screencaptures = proctoringInfo.filter(item => item.type === 'screencapture').map(item => item.image);
    const facecaptures = proctoringInfo.filter(item => item.type === 'facecapture').map(item => item.image);

    // PDF-Safe Component - Uses only hex colors, no gradients, no Recharts
    const PDFSafeReport = () => {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', backgroundColor: '#ffffff' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '32px', paddingBottom: '16px', borderBottom: '2px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-center' }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px' }}>
                                Candidate Performance Report
                            </h1>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>Comprehensive Assessment Analysis</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img 
                                src="/Internset logo.svg" 
                                alt="Internset Logo" 
                                style={{ height: '40px', width: 'auto', maxWidth: '200px' }}
                            />
                        </div>
                    </div>

                    {/* Report Details */}
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '4px' }}>Candidate Name</p>
                                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a' }}>{result.candidateName || '-'}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '4px' }}>Exam Name</p>
                                    <p style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>{result.examName || '-'}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '4px' }}>Exam Start Time</p>
                                    <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{formatDate(result.examStartTime)}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '4px' }}>Exam End Time</p>
                                    <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{formatDate(result.examEndTime)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Summary */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #cbd5e1' }}>
                            Overall Performance Summary
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '2px solid #d1d5db', color: '#1f2937' }}>
                                <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>Score</p>
                                <p style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '4px', color: '#111827' }}>{overallScore.toFixed(2)}</p>
                                <p style={{ fontSize: '18px', fontWeight: '500', color: '#4b5563' }}>out of {maxScore}</p>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '2px solid #d1d5db', color: '#1f2937' }}>
                                <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>Percentage</p>
                                <p style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '4px', color: '#111827' }}>{percentage}%</p>
                                <p style={{ fontSize: '18px', fontWeight: '500', color: '#4b5563' }}>Performance</p>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '2px solid #d1d5db', color: '#1f2937' }}>
                                <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>Percentile</p>
                                <p style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '4px', color: '#111827' }}>{percentile.toFixed(1)}</p>
                                <p style={{ fontSize: '12px', marginTop: '8px', fontStyle: 'italic', color: '#6b7280' }}>* May vary with subsequent attempts</p>
                            </div>
                        </div>
                    </div>

                    {/* Score Visualization */}
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #e5e7eb', boxShadow: '0 0 0px 0 rgba(0, 0, 0, 0)' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px', paddingBottom: '8px', borderBottom: '2px solid #cbd5e1' }}>
                            Overall Score Visualization
                        </h2>
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            {/* Gradient Bar */}
                            <div style={{ position: 'relative', height: '80px', backgroundColor: '#ffffff', borderRadius: '12px', border: '2px solid #cbd5e1', overflow: 'visible' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    width: '100%',
                                    background: 'linear-gradient(to right, #bfdbfe 0%, #bfdbfe 25%, #bfdbfe 50%, #bfdbfe 75%, #bfdbfe 100%)',
                                    borderRadius: '12px'
                                }}></div>
                            </div>
                            
                            {/* Horizontal line and indicator - positioned between bar and scale labels */}
                            {percentage > 0 && (
                                <div style={{ position: 'relative', height: '16px', marginTop: '-45px', marginBottom: '8px' }}>
                                    {/* Horizontal line from left (0) to score position */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '0%',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: `${Math.min(percentage, 100)}%`,
                                        height: '3px',
                                        backgroundColor: '#000000',
                                        zIndex: 10
                                    }}></div>
                                    
                                    {/* Vertical line at score position - extends from horizontal line down to arrow */}
                                    <div style={{
                                        position: 'absolute',
                                        left: `${Math.min(percentage, 100)}%`,
                                        top: '50%',
                                        bottom: '-28px',
                                        width: '3px',
                                        backgroundColor: '#000000',
                                        transform: 'translateX(-50%)',
                                        zIndex: 10
                                    }}></div>
                                    
                                    {/* Downward Arrow pointing to the score */}
                                    <div style={{
                                        position: 'absolute',
                                        left: `${Math.min(percentage, 100)}%`,
                                        bottom: '-30px',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderLeft: '8px solid transparent',
                                        borderRight: '8px solid transparent',
                                        borderTop: '12px solid #000000',
                                        zIndex: 10
                                    }}></div>
                                </div>
                            )}
                        </div>
                        {/* Scale Labels - 0 on left, 100 on right - Positioned to align with percentage */}
                        <div style={{ 
                            position: 'relative',
                            marginTop: '20px', 
                            height: '20px',
                            width: '100%'
                        }}>
                            {Array.from({ length: 21 }, (_, i) => {
                                const val = i * 5;
                                return (
                                    <span 
                                        key={val}
                                        style={{
                                            position: 'absolute',
                                            left: `${val}%`,
                                            transform: 'translateX(-50%)',
                                            fontSize: '12px', 
                                            fontWeight: '600', 
                                            color: '#1e40af',
                                            textAlign: 'center',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {val}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    {/* Charts - Simple HTML bars instead of Recharts */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '32px' }}>
                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #cbd5e1' }}>
                                Percentile Comparison
                            </h2>
                            <div style={{ marginTop: '24px' }}>
                                <div style={{ marginBottom: '24px' }}>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Overall</p>
                                    <div style={{ height: '40px', backgroundColor: '#e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.min(percentile, 100)}%`, backgroundColor: '#f97316', display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
                                            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>{percentile.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}> (MCQ)</p>
                                    <div style={{ height: '40px', backgroundColor: '#e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.min(sectionPercentile, 100)}%`, backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
                                            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>{sectionPercentile.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #cbd5e1' }}>
                                Percentage Comparison
                            </h2>
                            <div style={{ marginTop: '24px' }}>
                                <div style={{ marginBottom: '24px' }}>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Overall</p>
                                    <div style={{ height: '40px', backgroundColor: '#e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.min(percentage, 100)}%`, backgroundColor: '#f97316', display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
                                            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>{percentage.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>  (MCQ)</p>
                                    <div style={{ height: '40px', backgroundColor: '#e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.min(sectionPercentage, 100)}%`, backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
                                            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>{sectionPercentage.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Breakdown */}
                    {result.section && result.topics && result.topics.length > 0 && (
                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #e5e7eb' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #cbd5e1' }}>
                                (MCQ) Detailed Breakdown
                            </h2>
                            <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', marginBottom: '16px', border: '1px solid #cbd5e1' }}>
                                <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
                                    <div>
                                        <span style={{ color: '#4b5563', fontWeight: '600' }}>Score: </span>
                                        <span style={{ color: '#1e40af', fontWeight: 'bold', fontSize: '16px' }}>{sectionScore.toFixed(2)} / {sectionMaxScore}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#4b5563', fontWeight: '600' }}>Percentage: </span>
                                        <span style={{ color: '#1e40af', fontWeight: 'bold', fontSize: '16px' }}>{sectionPercentage}%</span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#4b5563', fontWeight: '600' }}>Percentile: </span>
                                        <span style={{ color: '#1e40af', fontWeight: 'bold', fontSize: '16px' }}>{sectionPercentile.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#1e40af' }}>
                                        <th style={{ border: '1px solid #1e3a8a', padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>Topic</th>
                                        <th style={{ border: '1px solid #1e3a8a', padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>Absolute Score</th>
                                        <th style={{ border: '1px solid #1e3a8a', padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>Percentage</th>
                                        <th style={{ border: '1px solid #1e3a8a', padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>Percentile</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.topics.map((topic, index) => {
                                        const topicPercentage = topic.percentage || 0;
                                        const topicPercentile = topic.percentile || 0;
                                        const bgColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
                                        let progressColor = '#dc2626';
                                        if (topicPercentage >= 70) {
                                            progressColor = '#10b981';
                                        } else if (topicPercentage >= 40) {
                                            progressColor = '#eab308';
                                        }
                                        return (
                                            <tr key={topic.topicId || index} style={{ backgroundColor: bgColor }}>
                                                <td style={{ border: '1px solid #cbd5e1', padding: '16px', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{topic.topicName || 'Unknown Topic'}</td>
                                                <td style={{ border: '1px solid #cbd5e1', padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: '#374151' }}>{topic.absoluteScore || '0 / 0'}</td>
                                                <td style={{ border: '1px solid #cbd5e1', padding: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                                        <span style={{ fontSize: '14px', fontWeight: 'bold', minWidth: '56px', color: progressColor }}>{topicPercentage}%</span>
                                                        <div style={{ width: '128px', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden', border: '1px solid #d1d5db' }}>
                                                            <div style={{ height: '100%', width: `${Math.min(topicPercentage, 100)}%`, backgroundColor: progressColor, borderRadius: '9999px' }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ border: '1px solid #cbd5e1', padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>{topicPercentile.toFixed(1)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Proctoring Report */}
                    {(screencaptures.length > 0 || facecaptures.length > 0) && (
                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #e5e7eb' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #cbd5e1' }}>
                                Proctoring Report
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                {proctoringInfo.map((item, index) => {
                                    const isScreenshot = item.type === 'screencapture';
                                    const imageType = isScreenshot ? 'Screenshot' : 'Face Capture';
                                    const borderColor = '#d1d5db';

                                    // Use actual timestamp from createdAt or updatedAt
                                    const timestamp = item.createdAt || item.updatedAt;
                                    const imageDate = timestamp ? formatImageDate(timestamp) : 'N/A';

                                    return (
                                        <div key={index} style={{ border: `2px solid ${borderColor}`, borderRadius: '12px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                                            <div style={{ position: 'relative' }}>
                                                <img
                                                    src={item.image}
                                                    alt={`${imageType} ${index + 1}`}
                                                    style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                                                />
                                            </div>
                                            <div style={{ padding: '12px', backgroundColor: '#ffffff', borderTop: `2px solid ${borderColor}` }}>
                                                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>{imageType} #{index + 1}</p>
                                                <p style={{ fontSize: '11px', color: '#4b5563', fontWeight: '500' }}>{imageDate}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{ textAlign: 'center', padding: '32px', borderTop: '2px solid #cbd5e1', marginTop: '32px' }}>
                        <p style={{ fontSize: '16px', fontWeight: '600', color: '#4b5563', marginBottom: '8px' }}>Thank you for taking the exam!</p>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>This report is generated by ExpertBatch Assessment Platform</p>
                    </div>
                </div>
            </div>
        );
    };

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        setPdfMode(true);

        // Wait for PDF-safe component to render and images to load
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const html2canvas = (await import('html2canvas')).default;
            const jsPDFModule = await import('jspdf');
            const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default || jsPDFModule;

            const element = pdfReportRef.current;

            // Wait for all images to load
            if (element) {
                const images = element.querySelectorAll('img');
                await Promise.all(
                    Array.from(images).map((img) => {
                        if (img.complete) return Promise.resolve();
                        return new Promise((resolve, reject) => {
                            img.onload = resolve;
                            img.onerror = resolve; // Continue even if image fails
                            setTimeout(resolve, 2000); // Timeout after 2 seconds
                        });
                    })
                );
            }

            // Create canvas from the element with PDF-safe settings
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true,
                logging: false,
                allowTaint: true,
                imageTimeout: 15000,
                ignoreElements: (el) => el.classList?.contains('no-print'),
            });

            const imgData = canvas.toDataURL('image/png', 0.95);
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // Handle multi-page PDF
            if (pdfHeight > pdf.internal.pageSize.getHeight()) {
                let heightLeft = pdfHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
                heightLeft -= pdf.internal.pageSize.getHeight();

                while (heightLeft > 0) {
                    position = heightLeft - pdfHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
                    heightLeft -= pdf.internal.pageSize.getHeight();
                }
            } else {
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            }

            const filename = `Exam_Report_${(result.candidateName || 'Candidate').replace(/[^a-z0-9]/gi, '_')}_${new Date().getTime()}.pdf`;
            pdf.save(filename);
        } catch (error) {
            console.error('Error generating PDF:', error);
            console.error('Error stack:', error.stack);
            alert(`Failed to generate PDF: ${error.message || 'Unknown error'}. Please check the console for details.`);
        } finally {
            setPdfMode(false);
            setIsGenerating(false);
        }
    };

    return (
        <>
            {/* PDF-Safe Component - Always rendered but positioned off-screen for PDF generation */}
            <div
                ref={pdfReportRef}
                style={{
                    position: 'fixed',
                    left: '-9999px',
                    top: '0',
                    width: '1200px',
                    zIndex: -1,
                    backgroundColor: '#ffffff'
                }}
            >
                <PDFSafeReport />
            </div>

            {/* Normal Component - Hidden when generating PDF */}
            <div style={{ display: pdfMode ? 'none' : 'block' }}>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
                    <header className="bg-white border-b-2 border-blue-200 shadow-md">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                            <div className="flex items-center justify-between gap-4">
                                <Image
                                    src="/Expertbatch Logo.svg"
                                    alt="ExpertBatch Logo"
                                    width={201}
                                    height={32}
                                    className="h-[1.875rem] w-auto"
                                />
                                <button
                                    onClick={handleDownloadPDF}
                                    disabled={isGenerating}
                                    className="no-print cursor-pointer flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-sky-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <FiDownload className="h-5 w-5" />
                                    <span>{isGenerating ? 'Generating PDF...' : 'Download PDF Report'}</span>
                                </button>
                            </div>
                        </div>
                    </header>

                    <main ref={reportRef} className="max-w-7xl mx-auto px-6 sm:px-8 py-6 my-8 bg-white rounded-2xl shadow-2xl border border-blue-100">
                        {/* Header Section */}
                        <div className="mb-10">
                            {/* Report Title */}
                            <div className="mb-8 pb-4 border-b-3 border-blue-200">
                                <h1 className={`text-3xl font-bold mb-2 ${pdfMode ? 'text-blue-900' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600'}`}>
                                    Candidate Performance Report
                                </h1>
                                <p className="text-sm text-gray-500 mt-2">Comprehensive Assessment Analysis</p>
                            </div>

                            {/* Report Details - Enhanced Card Layout */}
                            <div className={`${pdfMode ? 'bg-gray-50' : 'bg-gradient-to-br from-blue-50 to-sky-50'} rounded-xl p-6 ${pdfMode ? '' : ''} border border-blue-100`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Candidate Name - Highlighted */}
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <FiUser className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-600 mb-1">Candidate Name</p>
                                            <p className="text-lg font-bold text-blue-900">{result.candidateName || '-'}</p>
                                        </div>
                                    </div>

                                    {/* Exam Name */}
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <FiFileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-600 mb-1">Exam Name</p>
                                            <p className="text-lg font-semibold text-gray-800">{result.examName || '-'}</p>
                                        </div>
                                    </div>

                                    {/* Exam Start Time */}
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <FiClock className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-600 mb-1">Exam Start Time</p>
                                            <p className="text-base font-medium text-gray-800">{formatDate(result.examStartTime)}</p>
                                        </div>
                                    </div>

                                    {/* Exam End Time */}
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <FiClock className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-600 mb-1">Exam End Time</p>
                                            <p className="text-base font-medium text-gray-800">{formatDate(result.examEndTime)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Overall Performance Summary - Enhanced Cards */}
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-200">Overall Performance Summary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <div className="bg-white rounded-2xl p-8 border-2 border-gray-300 text-gray-800">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-lg font-semibold">Score</p>
                                        <div className="bg-gray-100 rounded-lg p-2">
                                            <FiFileText className="h-5 w-5 text-gray-700" />
                                        </div>
                                    </div>
                                    <p className="text-5xl font-extrabold mb-1 text-gray-900">{overallScore.toFixed(2)}</p>
                                    <p className="text-lg font-medium text-gray-600">out of {maxScore}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-8 border-2 border-gray-300 text-gray-800">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-lg font-semibold">Percentage</p>
                                        <div className="bg-gray-100 rounded-lg p-2">
                                            <FiMonitor className="h-5 w-5 text-gray-700" />
                                        </div>
                                    </div>
                                    <p className="text-5xl font-extrabold mb-1 text-gray-900">{percentage}%</p>
                                    <p className="text-lg font-medium text-gray-600">Performance</p>
                                </div>
                                <div className="bg-white rounded-2xl p-8 border-2 border-gray-300 text-gray-800">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-lg font-semibold">Percentile</p>
                                        <div className="bg-gray-100 rounded-lg p-2">
                                            <FiUser className="h-5 w-5 text-gray-700" />
                                        </div>
                                    </div>
                                    <p className="text-5xl font-extrabold mb-1 text-gray-900">{percentile.toFixed(1)}</p>
                                    <p className="text-xs mt-2 text-gray-500 italic">* May vary with subsequent attempts</p>
                                </div>
                            </div>
                        </div>

                        {/* Overall Score Visualization - Enhanced Horizontal Bar Chart */}
                        <div className={`mb-10 ${pdfMode ? 'bg-gray-50' : 'bg-gradient-to-br from-blue-50 to-sky-50'} rounded-xl p-6 border border-blue-100`}>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-200">Overall Score Visualization</h2>
                            <div className="relative">
                                {/* Chart Background with Grid Lines */}
                                <div className="h-20 bg-white rounded-xl relative overflow-hidden border-2 shadow-inner relative" style={{ borderColor: '#57c074' }}>
                                    {/* Grid lines */}
                                    {Array.from({ length: 21 }, (_, i) => i * 5).map((val) => (
                                        <div
                                            key={val}
                                            className="absolute top-0 bottom-0 w-px"
                                            style={{ left: `${val}%`, backgroundColor: '#a5d6a7' }}
                                        ></div>
                                    ))}
                                    {/* Score Bar */}
                                    <div
                                        className={`h-full rounded-lg transition-all duration-1000 flex items-center justify-end pr-4 ${pdfMode ? '' : 'shadow-lg'}`}
                                        style={{ 
                                            width: `${Math.min(percentage, 100)}%`,
                                            backgroundColor: pdfMode ? '#57c074' : undefined,
                                            background: pdfMode ? undefined : 'linear-gradient(to right, #66bb6a, #57c074, #4caf50)'
                                        }}
                                    >
                                        {percentage > 10 && (
                                            <span className="text-white text-base font-bold drop-shadow-lg">{percentage.toFixed(1)}%</span>
                                        )}
                                    </div>
                                    {/* Arrow Indicator */}
                                    {percentage > 0 && (
                                        <div
                                            className="absolute top-full mt-5 transform -translate-x-1/2 z-10"
                                            style={{ left: `${Math.min(percentage, 100)}%` }}
                                        >
                                            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-transparent" style={{ borderTopColor: '#57c074' }}></div>
                                        </div>
                                    )}
                                </div>
                                {/* Scale Labels */}
                                <div className="flex justify-between mt-4 text-xs font-semibold text-gray-700">
                                    {Array.from({ length: 21 }, (_, i) => i * 5).map((val) => (
                                        <span key={val} className="flex-1 text-center" style={{ color: '#2e7d32' }}>{val}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Overall and Section Wise Scores - Enhanced Two Column Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                            {/* Percentile Chart */}
                            <div className={`${pdfMode ? 'bg-gray-50' : 'bg-gradient-to-br from-blue-50 to-sky-50'} rounded-xl p-6 border border-blue-100`}>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-200">Percentile Comparison</h2>
                                <div className="mt-6" style={{ width: '100%', height: '400px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={[
                                                { name: 'Overall', value: Math.max(percentile, 0) },
                                                { name: '  (MCQ)', value: Math.max(sectionPercentile, 0) }
                                            ]}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#bfdbfe" />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fill: '#1e40af', fontSize: 13, fontWeight: 600 }}
                                                tickLine={{ stroke: '#3b82f6' }}
                                            />
                                            <YAxis
                                                domain={[0, 100]}
                                                tick={{ fill: '#1e40af', fontSize: 12, fontWeight: 500 }}
                                                tickLine={{ stroke: '#3b82f6' }}
                                                label={{ value: 'Percentile', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#1e40af', fontSize: 14, fontWeight: 600 } }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '2px solid #3b82f6',
                                                    borderRadius: '8px',
                                                    padding: '10px 14px',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                }}
                                                formatter={(value) => [`${value.toFixed(1)}`, 'Percentile']}
                                                labelStyle={{ fontWeight: 700, color: '#1e40af', fontSize: 13 }}
                                            />
                                            <Bar
                                                dataKey="value"
                                                radius={[10, 10, 0, 0]}
                                                barSize={90}
                                            >
                                                {[
                                                    { name: 'Overall', value: Math.max(percentile, 0) },
                                                    { name: '  (MCQ)', value: Math.max(sectionPercentile, 0) }
                                                ].map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={index === 0 ? '#f97316' : '#3b82f6'}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Percentage Chart */}
                            <div className={`${pdfMode ? 'bg-gray-50' : 'bg-gradient-to-br from-blue-50 to-sky-50'} rounded-xl p-6 border border-blue-100`}>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-200">Percentage Comparison</h2>
                                <div className="mt-6" style={{ width: '100%', height: '400px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={[
                                                { name: 'Overall', value: Math.max(percentage, 0) },
                                                { name: '  (MCQ)', value: Math.max(sectionPercentage, 0) }
                                            ]}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#bfdbfe" />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fill: '#1e40af', fontSize: 13, fontWeight: 600 }}
                                                tickLine={{ stroke: '#3b82f6' }}
                                            />
                                            <YAxis
                                                domain={[0, 100]}
                                                tick={{ fill: '#1e40af', fontSize: 12, fontWeight: 500 }}
                                                tickLine={{ stroke: '#3b82f6' }}
                                                label={{ value: 'Percentage', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#1e40af', fontSize: 14, fontWeight: 600 } }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '2px solid #3b82f6',
                                                    borderRadius: '8px',
                                                    padding: '10px 14px',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                }}
                                                formatter={(value) => [`${value.toFixed(1)}%`, 'Percentage']}
                                                labelStyle={{ fontWeight: 700, color: '#1e40af', fontSize: 13 }}
                                            />
                                            <Bar
                                                dataKey="value"
                                                radius={[10, 10, 0, 0]}
                                                barSize={90}
                                            >
                                                {[
                                                    { name: 'Overall', value: Math.max(percentage, 0) },
                                                    { name: '  (MCQ)', value: Math.max(sectionPercentage, 0) }
                                                ].map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={index === 0 ? '#f97316' : '#3b82f6'}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Section Detailed Breakdown */}
                        {result.section && (
                            <div className={`mb-10 ${pdfMode ? 'bg-gray-50' : 'bg-gradient-to-br from-blue-50 to-sky-50'} rounded-xl p-6 border border-blue-100`}>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-blue-200">Detailed Breakdown</h2>
                                    <div className="flex flex-wrap gap-6 text-sm bg-white rounded-lg p-4 border border-blue-200">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600 font-semibold">Score:</span>
                                            <span className="text-blue-700 font-bold text-base">{sectionScore.toFixed(2)} / {sectionMaxScore}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600 font-semibold">Percentage:</span>
                                            <span className="text-blue-700 font-bold text-base">{sectionPercentage}%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600 font-semibold">Percentile:</span>
                                            <span className="text-blue-700 font-bold text-base">{sectionPercentile.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>

                                {result.topics && result.topics.length > 0 && (
                                    <div className="overflow-x-auto bg-white rounded-xl border border-blue-200">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className={pdfMode ? 'bg-blue-700' : 'bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600'}>
                                                    <th className="border border-blue-700 px-5 py-4 text-left text-sm font-bold text-white">Topic</th>
                                                    <th className="border border-blue-700 px-5 py-4 text-center text-sm font-bold text-white">Absolute Score</th>
                                                    <th className="border border-blue-700 px-5 py-4 text-center text-sm font-bold text-white">Percentage</th>
                                                    <th className="border border-blue-700 px-5 py-4 text-center text-sm font-bold text-white">Percentile</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.topics.map((topic, index) => {
                                                    const topicPercentage = topic.percentage || 0;
                                                    const topicPercentile = topic.percentile || 0;
                                                    const rowColor = index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-blue-50/50 hover:bg-blue-100';

                                                    // Color coding based on percentage
                                                    let progressColor = pdfMode ? 'bg-red-600' : 'from-red-400 to-red-600';
                                                    if (topicPercentage >= 70) {
                                                        progressColor = pdfMode ? 'bg-green-600' : 'from-emerald-400 to-teal-600';
                                                    } else if (topicPercentage >= 40) {
                                                        progressColor = pdfMode ? 'bg-yellow-500' : 'from-amber-400 to-orange-500';
                                                    }

                                                    return (
                                                        <tr key={topic.topicId || index} className={`${rowColor} transition-all duration-200`}>
                                                            <td className="border border-blue-200 px-5 py-4 text-sm font-semibold text-gray-900">{topic.topicName || 'Unknown Topic'}</td>
                                                            <td className="border border-blue-200 px-5 py-4 text-center text-sm font-medium text-gray-700">{topic.absoluteScore || '0 / 0'}</td>
                                                            <td className="border border-blue-200 px-5 py-4">
                                                                <div className="flex items-center justify-center gap-4">
                                                                    <span className={`text-sm font-bold min-w-[3.5rem] ${topicPercentage >= 70 ? 'text-emerald-700' :
                                                                        topicPercentage >= 40 ? 'text-amber-700' :
                                                                            'text-red-700'
                                                                        }`}>{topicPercentage}%</span>
                                                                    <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner border border-gray-300">
                                                                        <div
                                                                            className={`h-full ${pdfMode ? progressColor : `bg-gradient-to-r ${progressColor}`} transition-all duration-700 rounded-full ${pdfMode ? '' : 'shadow-sm'}`}
                                                                            style={{ width: `${Math.min(topicPercentage, 100)}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="border border-blue-200 px-5 py-4 text-center text-sm font-bold text-gray-800">{topicPercentile.toFixed(1)}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Proctoring Report */}
                        {(screencaptures.length > 0 || facecaptures.length > 0) && (
                            <div className={`mb-10 ${pdfMode ? 'bg-gray-50' : 'bg-gradient-to-br from-blue-50 to-sky-50'} rounded-xl p-6 border border-blue-100`}>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-200">Proctoring Report</h2>

                                {/* Combined Images Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                    {proctoringInfo.map((item, index) => {
                                        const isScreenshot = item.type === 'screencapture';
                                        const imageType = isScreenshot ? 'Screenshot' : 'Face Capture';

                                        // Use actual timestamp from createdAt or updatedAt
                                        const timestamp = item.createdAt || item.updatedAt;
                                        const imageDate = timestamp ? formatImageDate(timestamp) : 'N/A';

                                        return (
                                            <div key={index} className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white">
                                                <div className="relative">
                                                    <img
                                                        src={item.image}
                                                        alt={`${imageType} ${index + 1}`}
                                                        className="w-full h-56 object-cover cursor-pointer"
                                                        onClick={() => window.open(item.image, '_blank')}
                                                    />
                                                </div>
                                                <div className="p-4 bg-white border-t-2 border-gray-300">
                                                    <p className="text-xs font-bold text-gray-900 mb-1.5">{imageType} #{index + 1}</p>
                                                    <p className="text-xs text-gray-600 font-medium">{imageDate}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="text-center py-8 border-t-2 border-blue-200 mt-8">
                            <p className="text-base font-semibold text-gray-600 mb-2">Thank you for taking the exam!</p>
                            <p className="text-sm text-gray-500">This report is generated by ExpertBatch Assessment Platform</p>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

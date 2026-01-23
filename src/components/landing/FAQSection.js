'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0); // First FAQ open by default

    const faqs = [
        {
            question: 'What is ExpertBatch and how does it work?',
            answer: 'ExpertBatch is a skill-based talent assessment platform that helps organizations evaluate candidates on specific skills. The platform allows you to create assessments organized by skills and topics, conduct timed exams with advanced proctoring, and receive detailed performance reports with percentile rankings. Candidates take skill-based tests, and you get comprehensive analytics to make informed hiring decisions.'
        },
        {
            question: 'How does the proctoring system work?',
            answer: 'ExpertBatch uses advanced proctoring technology including AI-powered monitoring, screen capture, and face detection to ensure exam integrity. The system captures screenshots and camera images during the exam to detect any suspicious activity, helping maintain the credibility of assessments and ensuring fair evaluation of all candidates.'
        },
        {
            question: 'What types of assessments can I create?',
            answer: 'You can create skill-based assessments organized by different skills (like JavaScript, Python, etc.) and topics within those skills. Each assessment can have multiple-choice questions with single or multiple correct answers. You can configure exam duration, set difficulty levels, and organize questions by topics for targeted evaluation.'
        },
        {
            question: 'What kind of reports do I get after an assessment?',
            answer: 'ExpertBatch provides comprehensive performance reports including overall scores, percentage scores, percentile rankings, and detailed breakdowns by topics. Reports include visualizations, performance metrics, and can be downloaded as PDFs. You also receive proctoring data with timestamps for review.'
        },
        {
            question: 'How do I manage users and assessments?',
            answer: 'ExpertBatch offers a complete admin dashboard where you can manage users with role-based access (superadmin, admin, and regular users). You can create and manage skills, topics, questions, and exams. The platform supports easy administration of all assessment content and user permissions.'
        },
        {
            question: 'Is ExpertBatch suitable for large-scale assessments?',
            answer: 'Yes, ExpertBatch is designed to be scalable and can handle multiple exams simultaneously. The platform supports organizations of all sizes and can manage thousands of candidates. With robust performance and enterprise-grade security, it\'s suitable for both small teams and large enterprises.'
        },
        {
            question: 'How secure is the platform?',
            answer: 'ExpertBatch uses enterprise-grade security with encrypted data transmission and secure storage. The platform includes advanced proctoring features to prevent cheating, secure user authentication, and role-based access control to protect sensitive assessment data.'
        },
        {
            question: 'Can candidates retake assessments?',
            answer: 'The platform allows you to configure assessment settings based on your requirements. You can set up assessments to allow or restrict retakes as needed. Each assessment session is tracked separately, so you can monitor candidate performance across multiple attempts if permitted.'
        },
        {
            question: 'What skills can I test candidates on?',
            answer: 'ExpertBatch supports testing on any skill you define. Common examples include programming languages (JavaScript, Python, Java), technical skills, soft skills, and domain-specific knowledge. You can create custom skills and organize them with topics and questions tailored to your hiring needs.'
        },
        {
            question: 'How do I get started with ExpertBatch?',
            answer: 'Getting started is easy! Simply sign up for an account, and you\'ll have access to the admin dashboard where you can start creating skills, topics, and questions. You can then create assessments and invite candidates to take exams. The platform provides intuitive interfaces for both administrators and candidates.'
        }
    ];

    const toggleFAQ = (index) => {
        // Prevent closing if it's the only open FAQ
        if (openIndex === index) {
            // Don't allow closing if it's the only one open
            // Check if there are other FAQs that could be opened
            const otherOpenIndex = faqs.findIndex((_, i) => i !== index);
            if (otherOpenIndex !== -1) {
                // If trying to close the current one, open the first available one instead
                setOpenIndex(otherOpenIndex === 0 ? 1 : 0);
            }
        } else {
            // Open the clicked FAQ
            setOpenIndex(index);
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ED2024]/10 rounded-full mb-4">
                        <FiHelpCircle className="h-8 w-8 text-[#ED2024]" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Everything you need to know about ExpertBatch
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className={`cursor-pointer w-full px-6 py-5 text-left rounded-lg flex items-center justify-between  transition-colors ${
                                    openIndex === index ? 'bg-[#ED2024]/10' : 'bg-white hover:bg-gray-50'
                                }`}
                            >
                                <span className="text-lg font-semibold text-gray-900 pr-8">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0"
                                >
                                    <FiChevronDown className="h-5 w-5 text-gray-500" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-5 pt-0">
                                            <p className="text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

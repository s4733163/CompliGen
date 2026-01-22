import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';

// Register fonts if needed (optional)
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2'
// });

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
        lineHeight: 1.6,
    },
    header: {
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: '2 solid #0e334d',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0e334d',
        marginBottom: 15,
    },
    metaContainer: {
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    metaLabel: {
        fontWeight: 'bold',
        width: 120,
        color: '#0e334d',
    },
    metaValue: {
        flex: 1,
        color: '#4a5568',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0e334d',
        marginBottom: 10,
        marginTop: 10,
    },
    subsectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0e334d',
        marginBottom: 8,
        marginTop: 8,
    },
    paragraph: {
        marginBottom: 8,
        color: '#1a202c',
        textAlign: 'justify',
    },
    list: {
        marginLeft: 20,
        marginBottom: 8,
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    bullet: {
        width: 15,
        color: '#0e334d',
    },
    listText: {
        flex: 1,
        color: '#1a202c',
    },
    annexSection: {
        marginTop: 30,
        paddingTop: 20,
        borderTop: '3 solid #f59e0b',
    },
    annexTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0e334d',
        marginBottom: 15,
    },
    annexSubsection: {
        backgroundColor: '#f8fafc',
        padding: 15,
        marginBottom: 15,
        borderLeft: '4 solid #f59e0b',
        borderRadius: 8,
    },
    subProcessorItem: {
        backgroundColor: '#ffffff',
        padding: 12,
        marginBottom: 10,
        border: '1 solid #e2e8f0',
        borderRadius: 8,
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 10,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#94a3b8',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        paddingTop: 10,
        borderTop: '1 solid #e2e8f0',
        fontSize: 9,
        color: '#94a3b8',
    },
});

// PDF Document Component for DPA - Continuous flow
const DPAPDFDocument = ({ policy, formatDate }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Data Processing Agreement</Text>
                <View style={styles.metaContainer}>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Company:</Text>
                        <Text style={styles.metaValue}>{policy.company_name}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Last Updated:</Text>
                        <Text style={styles.metaValue}>{formatDate(policy.last_updated)}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Website:</Text>
                        <Text style={styles.metaValue}>{policy.website_url}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Contact:</Text>
                        <Text style={styles.metaValue}>{policy.contact_email}</Text>
                    </View>
                    {policy.phone_number && (
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Phone:</Text>
                            <Text style={styles.metaValue}>{policy.phone_number}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Role Information */}
            {policy.role_controller_or_processor && policy.role_controller_or_processor.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Role</Text>
                    <View style={styles.list}>
                        {policy.role_controller_or_processor.map((role, idx) => (
                            <View key={`role-${idx}`} style={styles.listItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.listText}>{role}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Data Processing Locations */}
            {policy.data_processing_locations && policy.data_processing_locations.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Processing Locations</Text>
                    <View style={styles.list}>
                        {policy.data_processing_locations.map((location, idx) => (
                            <View key={`location-${idx}`} style={styles.listItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.listText}>{location}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Main Sections - Continuous flow */}
            {policy.sections && policy.sections.map((section, sectionIdx) => (
                <View key={`section-${sectionIdx}`} style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {section.section_number}. {section.heading}
                    </Text>
                    {section.content && section.content.map((paragraph, idx) => (
                        <Text key={`para-${idx}`} style={styles.paragraph}>
                            {paragraph}
                        </Text>
                    ))}
                </View>
            ))}

            {/* Annex A */}
            {policy.annex_a && (
                <View style={styles.annexSection}>
                    <Text style={styles.annexTitle}>Annex A – Processing Details</Text>

                    {policy.annex_a.subject_matter_of_processing && policy.annex_a.subject_matter_of_processing.length > 0 && (
                        <View style={styles.annexSubsection}>
                            <Text style={styles.subsectionTitle}>Subject Matter of Processing</Text>
                            {policy.annex_a.subject_matter_of_processing.map((item, idx) => (
                                <Text key={`subject-${idx}`} style={styles.paragraph}>{item}</Text>
                            ))}
                        </View>
                    )}

                    {policy.annex_a.duration_of_processing && policy.annex_a.duration_of_processing.length > 0 && (
                        <View style={styles.annexSubsection}>
                            <Text style={styles.subsectionTitle}>Duration of Processing</Text>
                            <View style={styles.list}>
                                {policy.annex_a.duration_of_processing.map((item, idx) => (
                                    <View key={`duration-${idx}`} style={styles.listItem}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.listText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {policy.annex_a.nature_and_purpose_of_processing && policy.annex_a.nature_and_purpose_of_processing.length > 0 && (
                        <View style={styles.annexSubsection}>
                            <Text style={styles.subsectionTitle}>Nature and Purpose of Processing</Text>
                            <View style={styles.list}>
                                {policy.annex_a.nature_and_purpose_of_processing.map((item, idx) => (
                                    <View key={`purpose-${idx}`} style={styles.listItem}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.listText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            )}

            {/* Annex B */}
            {policy.annex_b && (
                <View style={styles.annexSection}>
                    <Text style={styles.annexTitle}>Annex B – Technical and Organisational Measures</Text>

                    {policy.annex_b.technical_measures && policy.annex_b.technical_measures.length > 0 && (
                        <View style={styles.annexSubsection}>
                            <Text style={styles.subsectionTitle}>Technical Measures</Text>
                            <View style={styles.list}>
                                {policy.annex_b.technical_measures.map((item, idx) => (
                                    <View key={`tech-${idx}`} style={styles.listItem}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.listText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {policy.annex_b.organisational_measures && policy.annex_b.organisational_measures.length > 0 && (
                        <View style={styles.annexSubsection}>
                            <Text style={styles.subsectionTitle}>Organisational Measures</Text>
                            <View style={styles.list}>
                                {policy.annex_b.organisational_measures.map((item, idx) => (
                                    <View key={`org-${idx}`} style={styles.listItem}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.listText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            )}

            {/* Page Number */}
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `Page ${pageNumber} of ${totalPages}`
            )} fixed />
        </Page>
    </Document>
);

// Generic PDF Document for other policy types - Continuous flow
const GenericPDFDocument = ({ policy, policyType, formatDate }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{policyType}</Text>
                <View style={styles.metaContainer}>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Company:</Text>
                        <Text style={styles.metaValue}>{policy.company_name}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Last Updated:</Text>
                        <Text style={styles.metaValue}>{formatDate(policy.last_updated)}</Text>
                    </View>
                    {policy.website_url && (
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Website:</Text>
                            <Text style={styles.metaValue}>{policy.website_url}</Text>
                        </View>
                    )}
                    {policy.contact_email && (
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Contact:</Text>
                            <Text style={styles.metaValue}>{policy.contact_email}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* All Sections - Continuous flow */}
            {policy.sections && policy.sections.map((section, sectionIdx) => (
                <View key={`section-${sectionIdx}`} style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {section.section_number}. {section.heading}
                    </Text>
                    {section.content && section.content.map((paragraph, idx) => (
                        <Text key={`para-${idx}`} style={styles.paragraph}>
                            {paragraph}
                        </Text>
                    ))}
                </View>
            ))}

            {/* Page Number */}
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `Page ${pageNumber} of ${totalPages}`
            )} fixed />
        </Page>
    </Document>
);

// Export function to generate and download PDF
export const generatePDF = async (policy, policyType, formatDate) => {
    try {
        let doc;

        if (policyType === 'Data Processing Agreement') {
            doc = <DPAPDFDocument policy={policy} formatDate={formatDate} />;
        } else {
            doc = <GenericPDFDocument policy={policy} policyType={policyType} formatDate={formatDate} />;
        }

        const blob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(blob);

        window.open(url, "_blank");

        setTimeout(() => URL.revokeObjectURL(url), 30000);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${policyType.replace(/\s+/g, '_')}_${policy.company_name.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        console.log("clicked link, url=", url);
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};

export { DPAPDFDocument, GenericPDFDocument };
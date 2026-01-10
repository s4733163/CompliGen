"""
Test runner for Acceptable Use Policy (AUP) and Data Processing Agreement (DPA) generators
Run with: python3 test_policies_aup_dpa.py
"""

from pprint import pprint

# IMPORT YOUR GENERATORS
# Adjust imports if filenames differ
from acceptable_use_policy import generate_acceptable_use_policy
from data_processing_agreement import generate_data_processing_agreement


def divider(title: str) -> None:
    print("\n" + "=" * 80)
    print(title)
    print("=" * 80 + "\n")


def run_aup_tests() -> None:
    divider("ACCEPTABLE USE POLICY (AUP) TESTS")

    tests = [
        {
            "name": "Minimal AU SaaS (No phone)",
            "args": dict(
                # --- Basic Company Information ---
                company_name="LocalFlow Pty Ltd",
                business_description="A cloud-based task management tool for Australian teams.",
                industry_type="Software as a Service (SaaS)",
                company_size="Small business (under 50 employees)",
                business_location_state_territory="New South Wales",
                website_url="https://www.localflow.com.au",
                contact_email="support@localflow.com.au",
                phone_number=None,
                customer_type="Businesses",
                international_customers="No",
                children_under_18_served="No",
                # --- AUP Fields ---
                permitted_usage_types="Commercial use for internal team productivity",
                prohibited_activities="Unauthorised access, scraping, spam, malware distribution, harassment, unlawful data processing",
                industry_specific_restrictions="Do not upload health records or regulated sensitive datasets unless you have legal authority and approvals",
                user_monitoring_practices="Access logs and security events are monitored to detect misuse and security incidents",
                reporting_illegal_activities="Suspected illegal activity may be reported to Australian law enforcement or regulators where required by law",
            ),
        },
        {
            "name": "Full SaaS with Overseas + Strong Monitoring",
            "args": dict(
                company_name="GlobalConnect Pty Ltd",
                business_description="A cloud-based collaboration and analytics platform for SMEs.",
                industry_type="Software as a Service (SaaS)",
                company_size="Medium business (50–199 employees)",
                business_location_state_territory="Victoria",
                website_url="https://www.globalconnect.com.au",
                contact_email="support@globalconnect.com.au",
                phone_number="+61 3 9000 0000",
                customer_type="Both",
                international_customers="Yes – New Zealand, Singapore, United Kingdom",
                children_under_18_served="No",
                permitted_usage_types="Commercial and educational (approved training use only)",
                prohibited_activities="Credential stuffing, unauthorised access, scraping, reselling, uploading malicious code, harassment, unlawful processing",
                industry_specific_restrictions="Must not be used for credit reporting activities or to process payment card data unless authorised and compliant with applicable rules",
                user_monitoring_practices="Usage logs, access logs, anomaly detection alerts, and security events are monitored to detect misuse, fraud, and incidents",
                reporting_illegal_activities="Where required by law, suspected illegal activity may be reported to law enforcement or regulators",
            ),
        },
        {
            "name": "Security Platform (No cookies / privacy-by-design tone)",
            "args": dict(
                company_name="SecureDocs Pty Ltd",
                business_description="Secure document storage platform for Australian businesses.",
                industry_type="Cybersecurity SaaS",
                company_size="Small business (under 50 employees)",
                business_location_state_territory="Australian Capital Territory",
                website_url="https://www.securedocs.com.au",
                contact_email="support@securedocs.com.au",
                phone_number="+61 2 9000 4444",
                customer_type="Businesses",
                international_customers="No",
                children_under_18_served="No",
                permitted_usage_types="Commercial secure document storage and controlled sharing",
                prohibited_activities="Malware distribution, phishing, credential theft, unauthorised access attempts, illegal content distribution",
                industry_specific_restrictions="Do not store content that is unlawful to possess or share; do not use the platform for surveillance or unlawful monitoring",
                user_monitoring_practices="Security logs and access events are monitored to detect and investigate suspected compromise",
                reporting_illegal_activities="Suspected illegal activity may be reported to relevant authorities where required by law",
            ),
        },
        {
            "name": "EdTech Platform (Children served = Yes)",
            "args": dict(
                company_name="LearnNest Pty Ltd",
                business_description="Online learning platform used by Australian schools.",
                industry_type="EdTech (SaaS)",
                company_size="Medium business (50–199 employees)",
                business_location_state_territory="Queensland",
                website_url="https://www.learnnest.com.au",
                contact_email="privacy@learnnest.com.au",
                phone_number="+61 7 4000 2222",
                customer_type="Both",
                international_customers="No",
                children_under_18_served="Yes",
                permitted_usage_types="Educational use for teaching, learning, and school administration",
                prohibited_activities="Harassment, bullying, sharing inappropriate content, unauthorised access, impersonation, malware distribution",
                industry_specific_restrictions="No use for targeted advertising to students; no collection or uploading of sensitive information unless authorised by the school and permitted by law",
                user_monitoring_practices="Moderation signals and access/security events may be monitored to protect student safety and platform integrity",
                reporting_illegal_activities="Suspected illegal activity may be reported to relevant authorities where required by law",
            ),
        },
        {
            "name": "Marketplace Analytics Add-on (Businesses + Individuals)",
            "args": dict(
                company_name="TradeBay Pty Ltd",
                business_description="Online marketplace with seller analytics dashboards.",
                industry_type="Marketplace / E-commerce",
                company_size="Large business (200+ employees)",
                business_location_state_territory="Western Australia",
                website_url="https://www.tradebay.com.au",
                contact_email="support@tradebay.com.au",
                phone_number="+61 8 6000 3333",
                customer_type="Both",
                international_customers="Yes – New Zealand, Singapore",
                children_under_18_served="No",
                permitted_usage_types="Marketplace operations and analytics for buying/selling",
                prohibited_activities="Fraud, unauthorised access, scraping, reselling service access, harassment, illegal listings, malware distribution",
                industry_specific_restrictions="No use to facilitate prohibited goods/services; no scraping seller data at scale; no circumvention of trust & safety controls",
                user_monitoring_practices="Usage logs and trust & safety events are monitored to detect fraud, abuse, and security incidents",
                reporting_illegal_activities="Suspected illegal activity may be reported to law enforcement or regulators where required by law",
            ),
        },
    ]

    for test in tests:
        divider(f"AUP: {test['name']}")
        result = generate_acceptable_use_policy(**test["args"])
        pprint(result)


def run_dpa_tests() -> None:
    divider("DATA PROCESSING AGREEMENT (DPA) TESTS")

    tests = [
        {
            "name": "Your ClearView Analytics Example (Preferred structure)",
            "args": dict(
                company_name="ClearView Analytics Pty Ltd",
                business_description="A cloud-based analytics platform that helps small and medium businesses visualise sales and customer data.",
                industry_type="Software as a Service (SaaS)",
                company_size="Small business (under 50 employees)",
                business_location_state_territory="New South Wales",
                website_url="https://www.clearviewanalytics.com.au",
                contact_email="support@clearviewanalytics.com.au",
                phone_number=None,
                customer_type="Businesses",
                international_customers="Yes – New Zealand, Singapore",
                children_under_18_served="No",
                role_controller_or_processor="Processor (ClearView processes personal information on behalf of business customers)",
                sub_processors_used="Cloud hosting provider; Analytics/logging provider; Email delivery provider",
                data_processing_locations="Australia; Other locations used by approved sub-processors",
                security_certifications="Not specified",
                breach_notification_timeframe="Without undue delay after becoming aware of an Eligible Data Breach or suspected compromise involving Personal Information",
                data_deletion_timelines="Within 30 days of termination or upon written request, unless retention is required by law",
                audit_rights="Reasonable audit rights on reasonable notice, subject to confidentiality and security constraints",
                processing_summary="Customer uploads or connects sales/customer datasets. Platform stores, analyses, and generates dashboards and reports. Support staff may access data only to provide support and maintain the service.",
            ),
        },
        {
            "name": "Minimal DPA (Mostly Not specified)",
            "args": dict(
                company_name="LocalFlow Pty Ltd",
                business_description="Task management tool for Australian teams.",
                industry_type="Software as a Service (SaaS)",
                company_size="Small business (under 50 employees)",
                business_location_state_territory="New South Wales",
                website_url="https://www.localflow.com.au",
                contact_email="privacy@localflow.com.au",
                phone_number=None,
                customer_type="Businesses",
                international_customers="No",
                children_under_18_served="No",
                role_controller_or_processor="Processor",
                sub_processors_used="Not specified",
                data_processing_locations="Australia",
                security_certifications="Not specified",
                breach_notification_timeframe="Without undue delay after becoming aware of an Eligible Data Breach",
                data_deletion_timelines="Within 30 days of termination",
                audit_rights="Reasonable audit rights on reasonable notice",
                processing_summary="Not specified",
            ),
        },
        {
            "name": "Overseas processing + named sub-processor categories",
            "args": dict(
                company_name="GlobalConnect Pty Ltd",
                business_description="Cloud-based collaboration platform for SMEs.",
                industry_type="Software as a Service (SaaS)",
                company_size="Medium business (50–199 employees)",
                business_location_state_territory="Victoria",
                website_url="https://www.globalconnect.com.au",
                contact_email="privacy@globalconnect.com.au",
                phone_number="+61 3 9000 0000",
                customer_type="Both",
                international_customers="Yes – New Zealand, Singapore, United Kingdom",
                children_under_18_served="No",
                role_controller_or_processor="Processor",
                sub_processors_used="Cloud hosting provider; Email delivery provider; Customer support ticketing provider",
                data_processing_locations="Australia; Singapore; New Zealand",
                security_certifications="Not specified",
                breach_notification_timeframe="Without undue delay after becoming aware of an Eligible Data Breach",
                data_deletion_timelines="Within 60 days of termination or upon request (unless retention is required by law)",
                audit_rights="Reasonable audit rights on reasonable notice, subject to confidentiality and security constraints",
                processing_summary="Customers upload collaboration content and contact directories. The platform stores and processes content to provide collaboration features, audit logs, and reporting.",
            ),
        },
        {
            "name": "EdTech (Children served = Yes) + strict handling",
            "args": dict(
                company_name="LearnNest Pty Ltd",
                business_description="Online learning platform used by Australian schools.",
                industry_type="EdTech (SaaS)",
                company_size="Medium business (50–199 employees)",
                business_location_state_territory="Queensland",
                website_url="https://www.learnnest.com.au",
                contact_email="privacy@learnnest.com.au",
                phone_number="+61 7 4000 2222",
                customer_type="Both",
                international_customers="No",
                children_under_18_served="Yes",
                role_controller_or_processor="Processor",
                sub_processors_used="Cloud hosting provider; Email delivery provider",
                data_processing_locations="Australia",
                security_certifications="Not specified",
                breach_notification_timeframe="Without undue delay after becoming aware of an Eligible Data Breach",
                data_deletion_timelines="Within 30 days of termination (unless retention is required by law)",
                audit_rights="Reasonable audit rights on reasonable notice",
                processing_summary="Schools upload student enrolment and class data. Platform processes the data to provide learning activities, reporting, and support.",
            ),
        },
        {
            "name": "Security platform DPA (more conservative wording)",
            "args": dict(
                company_name="SecureDocs Pty Ltd",
                business_description="Secure document storage platform for Australian businesses.",
                industry_type="Cybersecurity SaaS",
                company_size="Small business (under 50 employees)",
                business_location_state_territory="Australian Capital Territory",
                website_url="https://www.securedocs.com.au",
                contact_email="support@securedocs.com.au",
                phone_number="+61 2 9000 4444",
                customer_type="Businesses",
                international_customers="No",
                children_under_18_served="No",
                role_controller_or_processor="Processor",
                sub_processors_used="Cloud hosting provider; Security monitoring provider",
                data_processing_locations="Australia",
                security_certifications="Not specified",
                breach_notification_timeframe="Without undue delay after becoming aware of an Eligible Data Breach or suspected compromise involving Personal Information",
                data_deletion_timelines="Within 30 days of termination or upon written request, unless retention is required by law",
                audit_rights="Reasonable audit rights on reasonable notice, subject to confidentiality and security constraints",
                processing_summary="Customers upload documents that may contain personal information. Platform stores and serves documents to authorised users and logs access for security.",
            ),
        },
    ]

    for test in tests:
        divider(f"DPA: {test['name']}")
        result = generate_data_processing_agreement(**test["args"])
        pprint(result)


if __name__ == "__main__":
    run_aup_tests()
    run_dpa_tests()

"""
Run 8 test cases for generate_privacy_policy() and log:
- start timestamp
- end timestamp
- duration (seconds)
- key input flags
- output file path
- success/error

Usage:
  python3 privacy_policy.py

Notes:
- If your LLM is streaming=True, outputs can interleave with logs.
  For clean logs during testing, set streaming=False in ChatGoogleGenerativeAI.
"""

import os
import json
import time
from datetime import datetime
from pathlib import Path
from privacy_policy import generate_privacy_policy


def run_policy_tests():
    # Folder to store outputs + logs
    out_dir = Path("./test_runs")
    out_dir.mkdir(parents=True, exist_ok=True)

    # 8 test cases (vary flags and inputs)
    tests = [
        {
            "test_id": "T1_baseline_no_marketing_no_cookies_no_payment_no_overseas",
            "args": dict(
                company_name="CompliGen Pty Ltd",
                business_description="A SaaS platform that helps Australian SMEs generate compliance documents.",
                industry="SaaS",
                company_size="Small business",
                location="Sydney, NSW, Australia",
                website="https://www.compligen.com.au",
                contact_email="support@compligen.com.au",
                phone_number="+61 2 9000 0000",
                customer_type="Businesses",
                international_operations=False,
                serves_children=False,
                data_types="Name, email address, IP address",
                payment_data_collected=False,
                cookies_used=False,
                collection_methods="Online forms and account registration",
                marketing_purpose=False,
                collection_purposes="Providing and improving our services; account management; customer support",
                third_parties="Cloud hosting providers",
                storage_location="Australia",
                security_measures="Role-based access control; encryption at rest",
                retention_period="7 years",
            ),
        },
        {
            "test_id": "T2_marketing_yes_no_overseas_no_cookies_no_payment",
            "args": dict(
                company_name="CompliGen Pty Ltd",
                business_description="A SaaS platform that helps Australian SMEs generate compliance documents.",
                industry="SaaS",
                company_size="Small business",
                location="Sydney, NSW, Australia",
                website="https://www.compligen.com.au",
                contact_email="support@compligen.com.au",
                phone_number="+61 2 9000 0000",
                customer_type="Businesses",
                international_operations=False,
                serves_children=False,
                data_types="Name, email address, IP address",
                payment_data_collected=False,
                cookies_used=False,
                collection_methods="Online forms, newsletter sign-up (optional), and account registration",
                marketing_purpose=True,
                collection_purposes="Provide services; product updates; optional marketing communications (opt-out)",
                third_parties="Cloud hosting providers; email delivery provider",
                storage_location="Australia",
                security_measures="Role-based access control; encryption at rest; MFA for admin accounts",
                retention_period="7 years",
            ),
        },
        {
            "test_id": "T3_cookies_yes_analytics_no_marketing_no_payment_no_overseas",
            "args": dict(
                company_name="CompliGen Pty Ltd",
                business_description="A SaaS platform that helps Australian SMEs generate compliance documents.",
                industry="SaaS",
                company_size="Small business",
                location="Sydney, NSW, Australia",
                website="https://www.compligen.com.au",
                contact_email="support@compligen.com.au",
                phone_number="+61 2 9000 0000",
                customer_type="Businesses",
                international_operations=False,
                serves_children=False,
                data_types="Name, email address, IP address, usage data (pages viewed, feature usage)",
                payment_data_collected=False,
                cookies_used=True,
                collection_methods="Account registration; cookies/tracking technologies; online forms",
                marketing_purpose=False,
                collection_purposes="Provide services; security; analytics and service improvement",
                third_parties="Cloud hosting providers; analytics provider",
                storage_location="Australia",
                security_measures="Role-based access control; encryption at rest; logging/monitoring",
                retention_period="7 years",
            ),
        },
        {
            "test_id": "T4_payment_yes_no_marketing_no_cookies_no_overseas",
            "args": dict(
                company_name="CompliGen Pty Ltd",
                business_description="A SaaS platform that helps Australian SMEs generate compliance documents.",
                industry="SaaS",
                company_size="Small business",
                location="Sydney, NSW, Australia",
                website="https://www.compligen.com.au",
                contact_email="support@compligen.com.au",
                phone_number="+61 2 9000 0000",
                customer_type="Businesses",
                international_operations=False,
                serves_children=False,
                data_types="Name, email address, IP address, billing details (business name, invoice address)",
                payment_data_collected=True,
                cookies_used=False,
                collection_methods="Account registration; billing checkout form",
                marketing_purpose=False,
                collection_purposes="Provide services; billing and invoicing; fraud prevention",
                third_parties="Cloud hosting providers; payment processor",
                storage_location="Australia",
                security_measures="Role-based access control; encryption at rest; secure payment processing (PCI-aligned provider)",
                retention_period="7 years",
            ),
        },
        {
            "test_id": "T5_overseas_yes_crossborder_disclosure",
            "args": dict(
                company_name="CompliGen Pty Ltd",
                business_description="A SaaS platform that helps Australian SMEs generate compliance documents.",
                industry="SaaS",
                company_size="Small business",
                location="Sydney, NSW, Australia",
                website="https://www.compligen.com.au",
                contact_email="support@compligen.com.au",
                phone_number="+61 2 9000 0000",
                customer_type="Businesses",
                international_operations=True,
                serves_children=False,
                data_types="Name, email address, IP address, usage data",
                payment_data_collected=False,
                cookies_used=False,
                collection_methods="Account registration; online forms",
                marketing_purpose=False,
                collection_purposes="Provide services; support; service improvement",
                third_parties="Cloud hosting providers (including overseas sub-processors); customer support tool",
                storage_location="Australia (primary) and limited overseas processing for support operations",
                security_measures="Role-based access control; encryption at rest; vendor due diligence; contractual safeguards",
                retention_period="7 years",
            ),
        },
        {
            "test_id": "T6_children_yes_serves_minors",
            "args": dict(
                company_name="KidSafe Learning Pty Ltd",
                business_description="An education platform for Australian schools providing learning content and compliance tools.",
                industry="Education Technology",
                company_size="Medium business",
                location="Melbourne, VIC, Australia",
                website="https://www.kidsafelearning.com.au",
                contact_email="privacy@kidsafelearning.com.au",
                phone_number="+61 3 8000 0000",
                customer_type="Individuals and Businesses",
                international_operations=False,
                serves_children=True,
                data_types="Name, email address, IP address, school name, student first name, grade level",
                payment_data_collected=False,
                cookies_used=False,
                collection_methods="School onboarding forms; account registration; support requests",
                marketing_purpose=False,
                collection_purposes="Provide services to schools; account management; support",
                third_parties="Cloud hosting providers; school administrators (as authorised)",
                storage_location="Australia",
                security_measures="Role-based access control; encryption at rest; least-privilege access; audit logs",
                retention_period="7 years",
            ),
        },
        {
            "test_id": "T7_all_flags_yes_marketing_cookies_payment_overseas_children_no",
            "args": dict(
                company_name="GlobalComply SaaS Pty Ltd",
                business_description="A global compliance SaaS platform serving Australian and international SME customers.",
                industry="SaaS",
                company_size="Large",
                location="Brisbane, QLD, Australia",
                website="https://www.globalcomply.example",
                contact_email="support@globalcomply.example",
                phone_number="+61 7 9000 0000",
                customer_type="Businesses",
                international_operations=True,
                serves_children=False,
                data_types="Name, email address, IP address, usage data, billing details",
                payment_data_collected=True,
                cookies_used=True,
                collection_methods="Account registration; cookies/tracking; checkout; support tickets",
                marketing_purpose=True,
                collection_purposes="Provide services; billing; analytics; security; direct marketing (opt-out)",
                third_parties="Cloud hosting providers; analytics provider; payment processor; email delivery provider; customer support platform",
                storage_location="Australia with limited overseas processing by third-party sub-processors",
                security_measures="Role-based access control; encryption at rest; MFA; security monitoring; vendor DPAs",
                retention_period="7 years",
            ),
        },
        {
            "test_id": "T8_minimal_inputs_short_data_types",
            "args": dict(
                company_name="SimpleDocs Pty Ltd",
                business_description="A lightweight tool that generates templated compliance documents for SMEs.",
                industry="SaaS",
                company_size="Startup",
                location="Hobart, TAS, Australia",
                website="https://www.simpledocs.example",
                contact_email="hello@simpledocs.example",
                phone_number="+61 3 7000 0000",
                customer_type="Businesses",
                international_operations=False,
                serves_children=False,
                data_types="Email address",
                payment_data_collected=False,
                cookies_used=False,
                collection_methods="Account registration",
                marketing_purpose=False,
                collection_purposes="Provide the Services; account login",
                third_parties="Cloud hosting providers",
                storage_location="Australia",
                security_measures="Access controls; encryption at rest",
                retention_period="7 years",
            ),
        },
    ]

    run_started = datetime.now().isoformat(timespec="seconds")
    log = {
        "run_started": run_started,
        "tests_total": len(tests),
        "results": [],
    }

    for idx, t in enumerate(tests, start=1):
        test_id = t["test_id"]
        args = t["args"]

        start_dt = datetime.now()
        start_ts = time.time()

        record = {
            "index": idx,
            "test_id": test_id,
            "started_at": start_dt.isoformat(timespec="seconds"),
            "duration_seconds": None,
            "status": "unknown",
            "output_file": None,
            "error": None,
            # quick flags snapshot for auditing
            "flags": {
                "international_operations": args.get("international_operations"),
                "serves_children": args.get("serves_children"),
                "payment_data_collected": args.get("payment_data_collected"),
                "cookies_used": args.get("cookies_used"),
                "marketing_purpose": args.get("marketing_purpose"),
            },
        }

        try:
            result = generate_privacy_policy(**args)

            # LangChain may return an AIMessage; you used result.content in your code.
            text = getattr(result, "content", str(result))

            safe_name = "".join(ch if ch.isalnum() or ch in "-_." else "_" for ch in test_id)
            out_path = out_dir / f"{safe_name}.md"
            out_path.write_text(text, encoding="utf-8")

            record["status"] = "success"
            record["output_file"] = str(out_path)

        except Exception as e:
            record["status"] = "error"
            record["error"] = f"{type(e).__name__}: {e}"

        finally:
            end_ts = time.time()
            record["duration_seconds"] = round(end_ts - start_ts, 3)
            record["ended_at"] = datetime.now().isoformat(timespec="seconds")
            log["results"].append(record)

            # Console progress (compact)
            print(
                f"[{idx}/{len(tests)}] {test_id} -> {record['status']} "
                f"({record['duration_seconds']}s)"
            )
            if record["status"] == "error":
                print(f"    Error: {record['error']}")

    log["run_ended"] = datetime.now().isoformat(timespec="seconds")

    log_path = out_dir / f"run_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    log_path.write_text(json.dumps(log, indent=2), encoding="utf-8")

    print("\nDone.")
    print(f"Log: {log_path}")
    print(f"Outputs folder: {out_dir.resolve()}")


if __name__ == "__main__":
    run_policy_tests()

"""
Run 8 test cases for generate_terms_of_service() and log:
- start timestamp
- end timestamp
- duration (seconds)
- key input flags
- output file path
- success/error

Usage:
  python3 terms_of_service_tests.py

Notes:
- If your LLM is streaming=True, outputs can interleave with logs.
  For clean logs during testing, set streaming=False in ChatGoogleGenerativeAI.
"""

import json
import time
from datetime import datetime
from pathlib import Path

# Import your generator
# Make sure this matches your actual module name where generate_terms_of_service lives.
from terms_of_service import generate_terms_of_service


def run_tos_tests():
    out_dir = Path("./test_runs_tos")
    out_dir.mkdir(parents=True, exist_ok=True)

    tests = [
        {
            "test_id": "T1_baseline_paid_subscription_trial_usercontent_no_international_no_minors",
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
                service_type="Paid",
                pricing_model="Subscription",
                free_trial=True,
                refund_policy="30-day money-back guarantee",
                minor_restrictions=False,
                user_content_uploads=True,
                prohibited_activities="Spam, hacking, unlawful content, reverse engineering, misuse of the platform",
                subscription_features="Basic, Pro, and Enterprise subscription tiers",
                payment_terms="Monthly and annual billing in advance",
            ),
        },
        {
            "test_id": "T2_paid_subscription_no_trial_usercontent_no_international_no_minors",
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
                service_type="Paid",
                pricing_model="Subscription",
                free_trial=False,
                refund_policy="30-day money-back guarantee",
                minor_restrictions=False,
                user_content_uploads=True,
                prohibited_activities="Spam, hacking, unlawful content, reverse engineering, misuse of the platform",
                subscription_features="Basic, Pro, and Enterprise subscription tiers",
                payment_terms="Monthly billing in advance",
            ),
        },
        {
            "test_id": "T3_paid_subscription_trial_no_usercontent_no_international_no_minors",
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
                service_type="Paid",
                pricing_model="Subscription",
                free_trial=True,
                refund_policy="30-day money-back guarantee",
                minor_restrictions=False,
                user_content_uploads=False,
                prohibited_activities="Spam, hacking, unlawful content, reverse engineering, misuse of the platform",
                subscription_features="Basic and Pro tiers",
                payment_terms="Monthly and annual billing in advance",
            ),
        },
        {
            "test_id": "T4_paid_subscription_trial_usercontent_international_yes_no_minors",
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
                service_type="Paid",
                pricing_model="Subscription",
                free_trial=True,
                refund_policy="30-day money-back guarantee",
                minor_restrictions=False,
                user_content_uploads=True,
                prohibited_activities="Spam, hacking, unlawful content, reverse engineering, misuse of the platform",
                subscription_features="Basic, Pro, and Enterprise subscription tiers",
                payment_terms="Monthly and annual billing in advance",
            ),
        },
        {
            "test_id": "T5_paid_subscription_no_trial_usercontent_international_yes_no_minors",
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
                service_type="Paid",
                pricing_model="Subscription",
                free_trial=False,
                refund_policy="30-day money-back guarantee",
                minor_restrictions=False,
                user_content_uploads=True,
                prohibited_activities="Spam, hacking, unlawful content, reverse engineering, misuse of the platform",
                subscription_features="Pro and Enterprise tiers",
                payment_terms="Annual billing in advance",
            ),
        },
        {
            "test_id": "T6_paid_subscription_trial_usercontent_minors_yes",
            "args": dict(
                company_name="StudentComply Pty Ltd",
                business_description="A compliance documentation platform offered to schools and training providers.",
                industry="Education Technology",
                company_size="Medium business",
                location="Melbourne, VIC, Australia",
                website="https://www.studentcomply.example",
                contact_email="support@studentcomply.example",
                phone_number="+61 3 8000 0000",
                customer_type="Individuals and Businesses",
                international_operations=False,
                service_type="Paid",
                pricing_model="Subscription",
                free_trial=True,
                refund_policy="30-day money-back guarantee",
                minor_restrictions=True,  # ensure your prompt includes explicit minor handling
                user_content_uploads=True,
                prohibited_activities="Spam, hacking, unlawful content, harassment, reverse engineering, misuse of the platform",
                subscription_features="Education and Enterprise tiers",
                payment_terms="Monthly billing in advance",
            ),
        },
        {
            "test_id": "T7_paid_usage_based_trial_usercontent_no_international_no_minors",
            "args": dict(
                company_name="MeteredComply Pty Ltd",
                business_description="A compliance SaaS platform that charges based on document generation volume.",
                industry="SaaS",
                company_size="Startup",
                location="Hobart, TAS, Australia",
                website="https://www.meteredcomply.example",
                contact_email="support@meteredcomply.example",
                phone_number="+61 3 7000 0000",
                customer_type="Businesses",
                international_operations=False,
                service_type="Paid",
                pricing_model="Usage-based",
                free_trial=True,
                refund_policy="30-day money-back guarantee",
                minor_restrictions=False,
                user_content_uploads=True,
                prohibited_activities="Spam, hacking, unlawful content, reverse engineering, misuse of the platform",
                subscription_features="Pay-as-you-go and Teams tiers",
                payment_terms="Usage charges billed monthly in arrears",
            ),
        },
        {
            "test_id": "T8_minimal_but_paid_subscription_trial_usercontent",
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
                service_type="Paid",
                pricing_model="Subscription",
                free_trial=True,
                refund_policy="30-day money-back guarantee",
                minor_restrictions=False,
                user_content_uploads=False,
                prohibited_activities="Spam, hacking, unlawful content, reverse engineering, misuse of the platform",
                subscription_features="Basic tier",
                payment_terms="Monthly billing in advance",
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
            "ended_at": None,
            "duration_seconds": None,
            "status": "unknown",
            "output_file": None,
            "error": None,
            "flags": {
                "international_operations": args.get("international_operations"),
                "service_type": args.get("service_type"),
                "pricing_model": args.get("pricing_model"),
                "free_trial": args.get("free_trial"),
                "refund_policy": args.get("refund_policy"),
                "minor_restrictions": args.get("minor_restrictions"),
                "user_content_uploads": args.get("user_content_uploads"),
            },
        }

        try:
            result = generate_terms_of_service(**args)

            # LangChain usually returns AIMessage with .content
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
    run_tos_tests()

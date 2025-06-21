import pandas as pd
from supabase import create_client, Client

# Supabase credentials
url = "https://gvhqpgtuxjloohkrloeu.supabase.co"
service_role_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2aHFwZ3R1eGpsb29oa3Jsb2V1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTkwOTU4NywiZXhwIjoyMDY1NDg1NTg3fQ.RiWdzkrAAj9dTtc1rRLudvHOEu9T6MQ_mwlWAA2nDlk"

# Load Excel
excel_data = pd.read_excel("Dataset - Dim 1.xlsx", sheet_name=None)

# Extract sheets
incidents_df = excel_data["F_Incidents"]
city_df = excel_data["Dim_City"]
scam_cat_df = excel_data["Dim_ScamCategory"]
news_df = excel_data["Dim_News"]

# Create Supabase client
supabase: Client = create_client(url, service_role_key)

# Fetch lookup tables
states_table = supabase.table("states").select("*").execute().data
scam_types_table = supabase.table("scam_types").select("*").execute().data

# Lookups
state_lookup = {row["name"]: row["id"] for row in states_table}
scam_lookup = {row["name"]: row["id"] for row in scam_types_table}

# Merge City → State
city_df["state_id"] = city_df["State"].map(state_lookup)
incidents_df = incidents_df.merge(city_df[["City ID", "state_id", "City/Town"]], on="City ID", how="left")

# Merge Scam Category
scam_cat_df = scam_cat_df.rename(columns={"Scam Category ID": "Scam_Category_ID", "Scam Type": "Scam_Type"})
incidents_df = incidents_df.merge(scam_cat_df[["Scam_Category_ID", "Scam_Type"]], left_on="Scam Category ID", right_on="Scam_Category_ID", how="left")
incidents_df["scam_type_id"] = incidents_df["Scam_Type"].map(scam_lookup)

# Merge News
news_df = news_df.rename(columns={"News ID": "News_ID", "Reference Url": "reference_url", "Title of News": "title", "Summary": "summary"})
incidents_df = incidents_df.merge(news_df[["News_ID", "reference_url", "title", "summary"]], left_on="News ID", right_on="News_ID", how="left")

# Prepare records for upload, clean NaN/nulls, use valid enum
records = []
for _, row in incidents_df.iterrows():
    record = {
        "case_id": str(row["Case ID"]).replace("#", ""),
        "report_date": str(row["Date"])[:10] if pd.notnull(row["Date"]) else None,
        "city_town": row["City/Town"] if pd.notnull(row["City/Town"]) else None,
        "amount_lost": float(row["Amount Lost"]) if pd.notnull(row["Amount Lost"]) else None,
        "scam_type_id": int(row["scam_type_id"]) if pd.notnull(row["scam_type_id"]) else None,
        "state_id": int(row["state_id"]) if pd.notnull(row["state_id"]) else None,
        "reference_url": row["reference_url"] if pd.notnull(row["reference_url"]) else None,
        "title": row["title"] if pd.notnull(row["title"]) else None,
        "summary": row["summary"] if pd.notnull(row["summary"]) else None,
        "case_status": "under_review"  # <--- Use one of: scam, legitimate, under_review
    }
    records.append(record)

# Fetch existing case_ids from fraud_reports to avoid duplicates
existing_case_ids = set()
offset = 0
batch_size = 1000

while True:
    res = supabase.table("fraud_reports").select("case_id").range(offset, offset + batch_size - 1).execute()
    if not res.data:
        break
    existing_case_ids.update(row["case_id"] for row in res.data if row["case_id"])
    if len(res.data) < batch_size:
        break
    offset += batch_size

# Filter out records that already exist
records_to_upload = [rec for rec in records if rec["case_id"] not in existing_case_ids]
print(f"Uploading {len(records_to_upload)} new records (skipping duplicates).")

# Upload in batches
# Upload in batches
for i in range(0, len(records_to_upload), 50):
    batch = records_to_upload[i:i+50]
    res = supabase.table("fraud_reports").insert(batch).execute()
    print(f"Batch {i//50 + 1}: Inserted {len(batch)} rows - Response: {res.data}")

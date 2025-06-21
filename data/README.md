# Data Directory

This directory contains the CSV files used by the application:

- `scam_dataset.csv` - Main dataset containing all approved fraud reports
- `pending_reports.csv` - Reports submitted by users awaiting admin approval

## Setup Instructions

1. Place your `scam_dataset.csv` file in this directory
2. The `pending_reports.csv` file will be created automatically when users submit reports
3. Make sure the CSV files have the correct column headers as defined in the schema

## File Permissions

Ensure the application has read/write permissions to this directory for proper functionality.

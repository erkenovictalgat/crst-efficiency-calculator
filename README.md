# CRST Efficiency Calculator

System for calculating employee efficiency based on work orders for the Installation and Current Development Unit.

## Features

- Upload Excel files with work order data
- Calculate employee efficiency metrics
- Display detailed statistics including:
  - Total orders completed
  - Total earnings
  - Average earnings per order
  - Working days statistics
  - Top work types by revenue

## Usage

1. Open public/efficiency.html in a web browser
2. Upload your Excel file (.xlsx or .xls)
3. View the efficiency calculations for each employee

## Data Structure

The system expects Excel files with the following structure:
- Row 1: Empty
- Row 2: Headers (employee name, address, order type, date, work types...)
- Row 3: Rates/prices for each work type
- Row 4+: Order data

## Technology

- Pure HTML/JavaScript
- SheetJS library for Excel file parsing
- No backend required - runs entirely in browser
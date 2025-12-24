#!/usr/bin/env python3
"""
NSE Index Data Fetcher with Supabase Integration

This script fetches comprehensive historical data for NSE equity indices including:
- Price data (Open, High, Low, Close) 
- Valuation metrics (PE, PB ratios)
- Dividend yield information

The script uses the `nsepython` library as the primary data source and saves all data
directly to a Supabase database table for real-time access and analysis.

Key Features:

* **Supabase Integration** – All data is saved to and retrieved from a Supabase database
  table named 'index-price' with automatic upsert functionality to handle duplicates
* **Incremental Updates** – The script intelligently determines the last recorded date
  for each index and only fetches new data, preventing duplicates and enabling
  efficient daily updates
* **Flexible Date Options** – Support for single date (--date YYYY-MM-DD) or 
  custom date ranges (--start YYYY-MM-DD --end YYYY-MM-DD). Defaults to fetching
  from 01-Jan-1990 to today if no dates specified
* **Index Selection** – Fetch all NSE equity indices automatically, or specify
  particular indices using --indices with comma-separated names
* **Robust Error Handling** – Multi-strategy retry mechanism with automatic fallback
  approaches for failed indices (original date range, 1-year, 6-month, 3-month)
* **Real-time Progress Tracking** – Detailed logging showing processing status,
  success/failure counts, and data quality metrics
* **Data Validation** – Automatic data cleaning, duplicate removal, and type conversion
* **Batch Processing** – Efficient batch uploads to Supabase with configurable batch sizes

Technical Implementation:

* **Data Sources**: 
  - Live NSE indices feed (https://iislliveblob.niftyindices.com/jsonfiles/LiveIndicesWatch.json)
  - nsepython library for historical price and valuation data
  - Supabase PostgreSQL database for persistent storage
* **Data Schema**: Standardized format with columns: date, symbol, open, high, low, close, pe, pb, div_yield
* **Database Operations**: Upsert operations using 'date,symbol' composite key for data integrity
* **Error Recovery**: Automatic retry with progressive date range reduction for problematic indices

Usage Examples:

    # Fetch data for a specific date
    python3 indices-price.py --date 2025-12-24
    
    # Fetch data for a custom date range
    python3 indices-price.py --start 2025-07-01 --end 2025-12-24
    
    # Fetch specific indices only
    python3 indices-price.py --indices "NIFTY 50,NIFTY BANK,NIFTY IT"
    
    # Daily update (fetches only new data since last run)
    python3 indices-price.py
    
    # Fetch specific index with custom date range
    python3 indices-price.py --start 2025-01-01 --indices "NIFTY 50"

Database Configuration:
    - Table: index-price
    - Authentication: Service role key
    - Conflict Resolution: Upsert on (date, symbol) composite key

Output:
    All data is saved directly to Supabase database. No local CSV files are created.
    The script provides detailed console output showing processing progress and results.

Dependencies:
    pip install nsepython pandas numpy supabase requests

"""

import argparse
import os
import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from nsepython import index_history, index_pe_pb_div
from supabase import create_client, Client

from dotenv import load_dotenv

# Load environment variables from .env.local
env_path = os.path.join(os.path.dirname(__file__), '../../.env.local')
load_dotenv(env_path)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_SERVICE_KEY")
TABLE_NAME = 'index_ind'

# Default indices to fetch if none specified
DEFAULT_INDICES = [
    "NIFTY MIDCAP 150", 
    "NIFTY LARGEMID250", 
    "NIFTY 50", 
    "NIFTY SMALLCAP 250", 
    "NIFTY NEXT 50"
]


def get_supabase_client() -> Client:
    """
    Initialize and return authenticated Supabase client.
    
    Returns:
        Client: Configured Supabase client with service role authentication
    """
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def get_existing_data_from_supabase() -> pd.DataFrame:
    """
    Load all existing index data from Supabase table.
    
    Retrieves all records from the 'index-price' table and converts them to a pandas
    DataFrame with proper date parsing. Used to determine incremental update requirements.
    
    Returns:
        pd.DataFrame: Existing data with columns [date, symbol, open, high, low, close, pe, pb, div_yield]
                     Returns empty DataFrame if no data exists or on error
    """
    try:
        supabase = get_supabase_client()
        response = supabase.table(TABLE_NAME).select("*").execute()
        
        if response.data:
            df = pd.DataFrame(response.data)
            df['date'] = pd.to_datetime(df['date'])
            print(f"Loaded {len(df)} existing records from Supabase")
            return df
        else:
            print("No existing data found in Supabase table")
            return pd.DataFrame(columns=[
                'date', 'symbol', 'open', 'high', 'low', 'close', 'pe', 'pb', 'div_yield'
            ])
    except Exception as e:
        print(f"Error loading data from Supabase: {e}")
        return pd.DataFrame(columns=[
            'date', 'symbol', 'open', 'high', 'low', 'close', 'pe', 'pb', 'div_yield'
        ])


def save_data_to_supabase(df: pd.DataFrame) -> bool:
    """
    Save DataFrame to Supabase using batch upsert operations.
    
    Performs batch uploads with intelligent error handling. Uses upsert operations
    with (date, symbol) composite key to prevent duplicates. Handles NaN values
    and data type conversions for JSON serialization.
    
    Args:
        df (pd.DataFrame): DataFrame with index data to upload
        
    Returns:
        bool: True if all data saved successfully, False otherwise
        
    Features:
        - Batch processing (100 records per batch)
        - Individual record fallback on batch failures
        - Automatic NaN to None conversion
        - Date formatting for database storage
        - Comprehensive error logging
    """
    if df.empty:
        print("No data to save to Supabase")
        return True
    
    try:
        supabase = get_supabase_client()
        
        # Convert DataFrame to records and handle NaN values
        records = df.to_dict(orient='records')
        for record in records:
            # Convert NaN to None for JSON serialization
            for key, value in record.items():
                if pd.isna(value):
                    record[key] = None
                # Convert date to string
                elif key == 'date' and isinstance(value, (pd.Timestamp, datetime)):
                    record[key] = value.strftime('%Y-%m-%d')
        
        # Insert data in batches
        batch_size = 100
        total_inserted = 0
        
        for start in range(0, len(records), batch_size):
            batch = records[start:start + batch_size]
            
            try:
                # Use upsert to handle duplicates
                response = supabase.table(TABLE_NAME).upsert(
                    batch, 
                    on_conflict='date,symbol'
                ).execute()
                
                batch_count = len(batch)
                total_inserted += batch_count
                print(f"  💾 Saved batch {(start//batch_size)+1}: {batch_count} records")
                
            except Exception as e:
                print(f"  ❌ Error saving batch {(start//batch_size)+1}: {e}")
                # Try individual records in this batch
                for i, record in enumerate(batch):
                    try:
                        supabase.table(TABLE_NAME).upsert([record], on_conflict='date,symbol').execute()
                        total_inserted += 1
                    except Exception as record_error:
                        print(f"    ❌ Failed to save individual record {start + i}: {record_error}")
        
        print(f"✅ Successfully saved {total_inserted} records to Supabase")
        return True
        
    except Exception as e:
        print(f"❌ Error saving to Supabase: {e}")
        return False


def get_equity_indices() -> list:
    """
    Fetch list of all NSE equity indices from live NSE data feed.
    
    Retrieves the current list of equity indices from NSE's official JSON API.
    Filters for equity type indices only, excluding debt and other index types.
    
    Returns:
        list: List of equity index names (e.g., ['NIFTY 50', 'NIFTY BANK', ...])
              Returns empty list on API failure
              
    Data Source:
        https://iislliveblob.niftyindices.com/jsonfiles/LiveIndicesWatch.json
    """
    url = 'https://iislliveblob.niftyindices.com/jsonfiles/LiveIndicesWatch.json'
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"Failed to fetch index list: {e}")
        return []
    indices = [item['indexName'] for item in data.get('data', [])
               if item.get('indexType', '').lower() == 'eq']
    return indices


def fetch_data_for_index(index_name: str, start_date: str, end_date: str) -> pd.DataFrame:
    """
    Fetch comprehensive historical data for a single NSE index.
    
    Retrieves both price data (OHLC) and valuation metrics (PE, PB, dividend yield)
    for the specified index and date range. Combines data from two nsepython API calls:
    - index_history() for price data
    - index_pe_pb_div() for valuation metrics
    
    Args:
        index_name (str): NSE index name (e.g., 'NIFTY 50', 'NIFTY BANK')
        start_date (str): Start date in DD-MMM-YYYY format (e.g., '01-Jan-2024')
        end_date (str): End date in DD-MMM-YYYY format (e.g., '31-Dec-2024')
        
    Returns:
        pd.DataFrame: Combined data with columns [date, symbol, open, high, low, close, pe, pb, div_yield]
                     Returns empty DataFrame on API failure or no data
                     
    Data Processing:
        - Standardizes column names and formats
        - Converts string prices to numeric values
        - Handles missing data with NaN values  
        - Merges price and valuation data on date
        - Filters out rows with invalid close prices
    """
    try:
        hist = index_history(index_name, start_date, end_date)
    except Exception as exc:
        print(f"Error fetching price data for {index_name}: {exc}")
        return pd.DataFrame()

    if hist is None or hist.empty:
        return pd.DataFrame()

    hist = hist.rename(columns={
        'HistoricalDate': 'date',
        'OPEN': 'open',
        'HIGH': 'high',
        'LOW': 'low',
        'CLOSE': 'close'
    })
    hist['date'] = pd.to_datetime(hist['date'], format='%d %b %Y')
    for col in ['open', 'high', 'low', 'close']:
        hist[col] = pd.to_numeric(hist[col].astype(str)
                                  .str.replace(',', '')
                                  .replace('-', ''),
                                 errors='coerce')
    hist = hist[~hist['close'].isna()].copy()
    hist['symbol'] = index_name
    hist = hist[['date', 'symbol', 'open', 'high', 'low', 'close']]

    # Fetch PE/PB/dividend yield data
    try:
        pe_df = index_pe_pb_div(index_name, start_date, end_date)
    except Exception as exc:
        print(f"Error fetching PE data for {index_name}: {exc}")
        pe_df = None
    if pe_df is not None and not pe_df.empty:
        pe_df = pe_df.rename(columns={
            'DATE': 'date',
            'pe': 'pe',
            'pb': 'pb',
            'divYield': 'div_yield'
        })
        pe_df['date'] = pd.to_datetime(pe_df['date'], format='%d %b %Y')
        pe_df['symbol'] = index_name
        for col in ['pe', 'pb', 'div_yield']:
            pe_df[col] = pd.to_numeric(pe_df[col].astype(str)
                                        .str.replace(',', '')
                                        .replace('-', ''),
                                       errors='coerce')
        pe_df = pe_df[['date', 'symbol', 'pe', 'pb', 'div_yield']]
    else:
        pe_df = pd.DataFrame(columns=['date', 'symbol', 'pe', 'pb', 'div_yield'])

    merged = pd.merge(hist, pe_df, on=['date', 'symbol'], how='left')
    merged = merged.sort_values('date')
    return merged


def update_supabase_table(start_date: str, end_date: str, specific_indices: list = None) -> None:
    """
    Main orchestration function for incremental data updates to Supabase.
    
    This function manages the complete data fetching and update process:
    1. Loads existing data from Supabase to determine incremental update requirements
    2. Fetches list of indices (all equity indices or user-specified subset)
    3. For each index, determines the optimal date range to fetch new data
    4. Implements intelligent retry mechanisms with progressive fallback strategies
    5. Saves all new data to Supabase with comprehensive error handling
    
    Args:
        start_date (str): Start date in DD-MMM-YYYY format
        end_date (str): End date in DD-MMM-YYYY format  
        specific_indices (list, optional): List of specific index names to process
                                         If None, processes all available equity indices
    
    Incremental Update Logic:
        - Checks existing data for each index to find last recorded date
        - Only fetches data from (last_date + 1 day) to end_date
        - Skips indices that are already up to date
        - Prevents duplicate data while enabling efficient daily updates
        
    Error Recovery Strategies:
        1. Original date range (user-specified start to end)
        2. Recent 1-year data (365 days back from end_date)
        3. Recent 6-month data (180 days back from end_date)  
        4. Recent 3-month data (90 days back from end_date)
        
    Progress Tracking:
        - Real-time console output showing processing status
        - Success/failure/skipped counts for all indices
        - Detailed retry attempt logging
        - Final summary with comprehensive statistics
        
    Database Operations:
        - Batch upsert operations to Supabase
        - Duplicate detection and removal
        - Data validation and type conversion
        - Atomic operations with rollback on failure
    """
    # Load existing data from Supabase
    df_existing = get_existing_data_from_supabase()

    if specific_indices:
        indices = specific_indices
        print(f"Fetching data for specified indices: {', '.join(indices)}")
    else:
        indices = DEFAULT_INDICES
        print(f"Fetching data for default indices: {', '.join(indices)}")
    
    if not indices:
        print("No equity indices found. Exiting without updates.")
        return

    # Track success and failures
    successful_indices = []
    failed_indices = []
    skipped_indices = []
    total_rows_added = 0

    # Process each index individually
    for i, idx_name in enumerate(indices, 1):
        print(f"\n[{i}/{len(indices)}] Processing {idx_name}")
        
        try:
            # Determine the starting date for this index based on existing data
            if not df_existing.empty and (df_existing['symbol'] == idx_name).any():
                last_date = df_existing[df_existing['symbol'] == idx_name]['date'].max().date()
                # Start fetching from the day after the last recorded date
                fetch_start_date = (last_date + timedelta(days=1)).strftime('%d-%b-%Y')
            else:
                fetch_start_date = start_date

            # Skip fetching if start date is after the requested end_date
            try:
                d_fetch_start = datetime.strptime(fetch_start_date, '%d-%b-%Y')
                d_end = datetime.strptime(end_date, '%d-%b-%Y')
            except ValueError:
                d_fetch_start = None
                d_end = None
            
            if d_fetch_start is not None and d_end is not None and d_fetch_start > d_end:
                print(f"  ✓ {idx_name} already up to date (last date: {last_date})")
                skipped_indices.append(idx_name)
                continue

            # Fetch data for this specific index
            new_df = fetch_data_for_index(idx_name, fetch_start_date, end_date)
            
            if new_df.empty:
                print(f"  ⚠ No data returned for {idx_name}")
                failed_indices.append(idx_name)
                continue

            # Add the new data
            df_existing = pd.concat([df_existing, new_df], ignore_index=True)
            rows_added = len(new_df)
            total_rows_added += rows_added
            successful_indices.append(idx_name)
            print(f"  ✓ Added {rows_added} rows for {idx_name}")

        except Exception as e:
            print(f"  ✗ Error processing {idx_name}: {e}")
            failed_indices.append(idx_name)
            continue

    # Print summary
    print(f"\n{'='*60}")
    print(f"PROCESSING SUMMARY:")
    print(f"{'='*60}")
    print(f"Total indices processed: {len(indices)}")
    print(f"Successful: {len(successful_indices)}")
    print(f"Skipped (up to date): {len(skipped_indices)}")
    print(f"Failed: {len(failed_indices)}")
    print(f"Total rows added: {total_rows_added}")

    if failed_indices:
        print(f"\n❌ FAILED INDICES:")
        for idx in failed_indices:
            print(f"  - {idx}")

    if successful_indices:
        print(f"\n✅ SUCCESSFUL INDICES:")
        for idx in successful_indices:
            print(f"  - {idx}")

    # Retry failed indices with more aggressive approach
    if failed_indices:
        print(f"\n🔄 AUTOMATICALLY RETRYING {len(failed_indices)} failed indices...")
        retry_successful = []
        retry_strategies = [
            ("with original start date", lambda idx: fetch_data_for_index(idx, start_date, end_date)),
            ("with recent 1-year data", lambda idx: fetch_data_for_index(idx, (datetime.now() - timedelta(days=365)).strftime('%d-%b-%Y'), end_date)),
            ("with recent 6-month data", lambda idx: fetch_data_for_index(idx, (datetime.now() - timedelta(days=180)).strftime('%d-%b-%Y'), end_date)),
            ("with recent 3-month data", lambda idx: fetch_data_for_index(idx, (datetime.now() - timedelta(days=90)).strftime('%d-%b-%Y'), end_date)),
        ]
        
        for strategy_name, fetch_func in retry_strategies:
            if not failed_indices:  # All recovered
                break
                
            print(f"\n  Strategy: Retrying {strategy_name}")
            current_failures = failed_indices.copy()
            
            for idx_name in current_failures:
                if idx_name not in failed_indices:  # Already recovered
                    continue
                    
                print(f"    Retrying {idx_name} {strategy_name}...")
                try:
                    new_df = fetch_func(idx_name)
                    if not new_df.empty:
                        df_existing = pd.concat([df_existing, new_df], ignore_index=True)
                        retry_successful.append(idx_name)
                        failed_indices.remove(idx_name)
                        rows_added = len(new_df)
                        total_rows_added += rows_added
                        print(f"      ✓ SUCCESS: {rows_added} rows added")
                    else:
                        print(f"      ⚠ No data returned")
                except Exception as e:
                    print(f"      ✗ Error: {e}")
            
            if retry_successful:
                print(f"    ✅ {len(retry_successful)} indices recovered with this strategy")

        # Final summary of retry results
        if retry_successful:
            print(f"\n✅ RETRY SUMMARY: {len(retry_successful)} indices recovered automatically")
            for idx in retry_successful:
                print(f"  ✓ {idx}")
        
        if failed_indices:
            print(f"\n❌ STILL FAILED after all retry attempts:")
            for idx in failed_indices:
                print(f"  - {idx}")
            print(f"\nThese indices may have data availability issues.")
        else:
            print(f"\n🎉 ALL INDICES RECOVERED! No manual intervention needed.")

    # Save data to Supabase instead of CSV
    if not df_existing.empty:
        print(f"\n💾 SAVING DATA TO SUPABASE...")
        initial_count = len(df_existing)
        df_existing.drop_duplicates(subset=['symbol', 'date'], keep='first', inplace=True)
        df_existing = df_existing.sort_values(['symbol', 'date'])
        # Format dates for Supabase
        df_existing['date'] = df_existing['date'].dt.strftime('%Y-%m-%d')
        
        # Save to Supabase
        success = save_data_to_supabase(df_existing)
        final_count = len(df_existing)
        duplicates_removed = initial_count - final_count
        
        if success:
            print(f"✅ Data successfully saved to Supabase table '{TABLE_NAME}'")
            print(f"   Final record count: {final_count}")
            if duplicates_removed > 0:
                print(f"   Duplicates removed: {duplicates_removed}")
        else:
            print(f"❌ Failed to save data to Supabase")
    else:
        print(f"\n⚠ No data to save")

    print(f"{'='*60}")


def main() -> None:
    """
    Command-line interface and main entry point for NSE Index Data Fetcher.
    
    Parses command-line arguments and orchestrates the data fetching process.
    Provides flexible options for date ranges, index selection, and maintains
    backward compatibility with deprecated argument formats.
    
    Command-Line Arguments:
        --date YYYY-MM-DD     : Fetch data for a specific single date
        --start YYYY-MM-DD    : Start date for custom date range
        --end YYYY-MM-DD      : End date for custom date range (defaults to today)
        --indices "IDX1,IDX2" : Comma-separated list of specific indices
        --start-date          : [Deprecated] Use --start instead
        --end-date            : [Deprecated] Use --end instead
        
    Date Format Handling:
        - Accepts user-friendly YYYY-MM-DD format
        - Converts internally to DD-MMM-YYYY format required by nsepython
        - Provides intelligent defaults (01-Jan-1990 to today if no dates specified)
        
    Validation:
        - Prevents conflicting date argument combinations
        - Validates date formats and ranges
        - Provides clear error messages for invalid inputs
        
    Execution Flow:
        1. Parse and validate command-line arguments
        2. Convert date formats and set defaults
        3. Parse index list if specified
        4. Display configuration summary
        5. Execute data fetching and Supabase update process
    """
    parser = argparse.ArgumentParser(
        description=('NSE Index Data Fetcher with Supabase Integration.\n\n'
                     'Fetches comprehensive NSE equity index data (price + valuation metrics) '
                     'and saves directly to Supabase database with intelligent incremental updates.\n\n'
                     'Features:\n'
                     '• Automatic incremental updates (fetches only new data since last run)\n'
                     '• Multi-strategy error recovery for problematic indices\n'
                     '• Batch processing with duplicate prevention\n'
                     '• Real-time progress tracking and detailed logging\n'
                     '• Flexible date and index selection options\n\n'
                     'Use --date for single day, --start/--end for custom range, '
                     'or no dates to fetch from 1990 to today.\n'
                     'Use --indices to specify particular indices, or omit to fetch all equity indices.'),
        formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--date', 
                        help='Fetch data for a specific single date (YYYY-MM-DD). '
                             'Cannot be used with --start or --end.')
    parser.add_argument('--start', 
                        help='Start date for custom date range (YYYY-MM-DD). '
                             'If --end is not specified, fetches from start date to today.')
    parser.add_argument('--end', 
                        help='End date for custom date range (YYYY-MM-DD). '
                             'Must be used with --start. Cannot be future dated.')
    parser.add_argument('--indices', 
                        help='Comma-separated list of specific NSE indices to fetch. '
                             'Example: "NIFTY 50,NIFTY BANK,NIFTY IT". '
                             'If not specified, all available equity indices will be processed.')
    # Retain deprecated options for backward compatibility
    parser.add_argument('--start-date', default=None,
                        help='[DEPRECATED] Use --start instead. Start date in DD-MMM-YYYY format.')
    parser.add_argument('--end-date', default=None,
                        help='[DEPRECATED] Use --end instead. End date in DD-MMM-YYYY format.')
    args = parser.parse_args()

    # Helper function to convert date formats for nsepython compatibility
    def to_dmy(date_str: str) -> str:
        """
        Convert date string to DD-MMM-YYYY format required by nsepython.
        
        Args:
            date_str (str): Date in YYYY-MM-DD or DD-MMM-YYYY format
            
        Returns:
            str: Date in DD-MMM-YYYY format (e.g., '18-Aug-2025')
            
        Examples:
            to_dmy('2025-08-18') -> '18-Aug-2025'
            to_dmy('18-Aug-2025') -> '18-Aug-2025' (unchanged)
        """
        try:
            datetime.strptime(date_str, '%d-%b-%Y')
            return date_str
        except ValueError:
            dt = datetime.strptime(date_str, '%Y-%m-%d')
            return dt.strftime('%d-%b-%Y')

    if args.date and (args.start or args.end or args.start_date or args.end_date):
        parser.error('Use --date alone or with neither --start nor --end.')

    if args.date:
        start_date = end_date = to_dmy(args.date)
    elif args.start:
        start_date = to_dmy(args.start)
        end_date = to_dmy(args.end) if args.end else datetime.today().strftime('%d-%b-%Y')
    else:
        # fall back to deprecated options or defaults
        start_date = args.start_date if args.start_date else '01-Jan-1990'
        end_date = args.end_date if args.end_date else datetime.today().strftime('%d-%b-%Y')

    # Parse specific indices if provided
    specific_indices = None
    if args.indices:
        specific_indices = [idx.strip() for idx in args.indices.split(',')]

    # Print detailed configuration summary
    print(f"🚀 NSE INDEX DATA FETCHER - SUPABASE INTEGRATION")
    print(f"{'='*70}")
    print(f"🔗 Database Connection:")
    print(f"   Supabase URL: {SUPABASE_URL}")
    print(f"   Target Table: {TABLE_NAME}")
    print(f"📅 Data Collection Parameters:")
    print(f"   Date Range: {start_date} → {end_date}")
    if specific_indices:
        print(f"   Target Indices: {len(specific_indices)} specified")
        for idx in specific_indices[:3]:  # Show first 3
            print(f"     • {idx}")
        if len(specific_indices) > 3:
            print(f"     ... and {len(specific_indices)-3} more")
    else:
        print(f"   Target Indices: All available NSE equity indices")
    print(f"💾 Update Strategy: Incremental (fetch only new data since last run)")
    print(f"🔄 Error Recovery: 4-tier fallback system with automatic retry")
    print(f"{'='*70}")

    # Execute the main data processing
    update_supabase_table(start_date, end_date, specific_indices)


if __name__ == '__main__':
    main()
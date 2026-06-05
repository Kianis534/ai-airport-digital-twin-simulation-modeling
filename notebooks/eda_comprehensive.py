import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os

# Set aesthetic style for the notebook
sns.set_theme(style="whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)

def print_header(text):
    print("\n" + "="*50)
    print(f"  {text}")
    print("="*50)

# --- DATASET 1: OPERATIONAL DATA (FLIGHTS) ---
print_header("DATASET 1: FLIGHT OPERATIONS")
# Note: flights.csv is ~560MB, loading a sample of 100,000 rows for efficient EDA
flights_path = '../datasets/dataset_1_flights.csv'
if os.path.exists(flights_path):
    df_flights = pd.read_csv(flights_path, nrows=100000) 
    print("Dataset 1 (Flights Sample) Loaded.")
    print(df_flights.head())
    df_flights.info()
    print("\nMissing Values:\n", df_flights.isnull().sum())
    
    # Distribution of Delays
    plt.figure()
    sns.histplot(df_flights['DEPARTURE_DELAY'].dropna(), bins=50, kde=True, color='skyblue')
    plt.title('Distribution of Departure Delays (Sample)')
    plt.xlim(-20, 150) # Focused on the most common delay range
    plt.show()

    # Correlation Heatmap for Operational Metrics
    cols_of_interest = ['DEPARTURE_DELAY', 'ARRIVAL_DELAY', 'TAXI_OUT', 'TAXI_IN', 'AIR_TIME', 'DISTANCE']
    plt.figure(figsize=(10, 8))
    sns.heatmap(df_flights[cols_of_interest].corr(), annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Correlation Heatmap: Operational Metrics')
    plt.show()

# --- DATASET 2: PASSENGER SATISFACTION (CLASSIFICATION) ---
print_header("DATASET 2: PASSENGER SATISFACTION")
train_path = '../datasets/dataset_2_train.csv'
if os.path.exists(train_path):
    df_sat = pd.read_csv(train_path)
    print("Dataset 2 Loaded.")
    print(df_sat.head())
    print(df_sat.describe())
    
    # Target Variable Distribution
    plt.figure()
    sns.countplot(data=df_sat, x='satisfaction', palette='viridis')
    plt.title('Distribution of Passenger Satisfaction')
    plt.show()
    
    # Correlation between Ratings and Satisfaction
    # Filter only numeric rating columns
    rating_cols = [col for col in df_sat.columns if 'service' in col.lower() or 'Ease' in col or 'comfort' in col or 'booking' in col]
    plt.figure(figsize=(12, 10))
    sns.heatmap(df_sat[rating_cols].corr(), annot=False, cmap='YlGnBu')
    plt.title('Correlation Heatmap: Service Ratings')
    plt.show()

# --- DATASET 3: PASSENGER TRAFFIC (TIME SERIES) ---
print_header("DATASET 3: PASSENGER TRAFFIC TRENDS")
traffic_path = '../datasets/dataset_3_passenger_traffic.csv'
if os.path.exists(traffic_path):
    df_traffic = pd.read_csv(traffic_path)
    print("Dataset 3 Loaded.")
    
    # Convert 'Activity Period' (e.g., 200507) to datetime
    df_traffic['Date'] = pd.to_datetime(df_traffic['Activity Period'].astype(str), format='%Y%m')
    
    # Aggregate traffic by month
    monthly_traffic = df_traffic.groupby('Date')['Passenger Count'].sum().reset_index()
    
    # Plot Trend
    plt.figure()
    sns.lineplot(data=monthly_traffic, x='Date', y='Passenger Count', color='red', linewidth=2)
    plt.title('Total Passenger Traffic Over Time')
    plt.ylabel('Total Passenger Count')
    plt.xlabel('Year')
    plt.xticks(rotation=45)
    plt.show()
    
    # Top Airlines by Traffic
    plt.figure()
    top_airlines = df_traffic.groupby('Operating Airline')['Passenger Count'].sum().nlargest(10).reset_index()
    sns.barplot(data=top_airlines, x='Passenger Count', y='Operating Airline', palette='magma')
    plt.title('Top 10 Airlines by Total Passenger Traffic')
    plt.show()

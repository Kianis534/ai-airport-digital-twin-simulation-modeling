import pandas as pd
import numpy as np
import os
import logging
import joblib
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error
from typing import Tuple, List

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TrafficForecaster:
    """
    Production-level LSTM training pipeline for Passenger Traffic Forecasting.
    Predicts future passenger counts based on historical trends.
    """

    def __init__(self, data_path: str, model_save_path: str, scaler_save_path: str):
        self.data_path = data_path
        self.model_save_path = model_save_path
        self.scaler_save_path = scaler_save_path
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.look_back = 12  # Use past 12 months to predict the next

    def load_and_preprocess(self) -> np.ndarray:
        """
        Loads data, sorts chronologically, and normalizes.
        """
        logger.info(f"Loading forecasting data from {self.data_path}...")
        df = pd.read_csv(self.data_path)
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.sort_values('Date')
        
        data = df['Passenger Count'].values.reshape(-1, 1)
        scaled_data = self.scaler.fit_transform(data)
        
        # Save scaler for inference
        joblib.dump(self.scaler, self.scaler_save_path)
        logger.info(f"Scaler saved at {self.scaler_save_path}")
        
        return scaled_data

    def create_sequences(self, data: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Transforms time-series data into supervised learning sequences.
        """
        X, y = [], []
        for i in range(len(data) - self.look_back):
            X.append(data[i:(i + self.look_back), 0])
            y.append(data[i + self.look_back, 0])
        return np.array(X), np.array(y)

    def build_model(self, input_shape: Tuple[int, int]) -> Sequential:
        """
        Constructs the LSTM Architecture.
        """
        model = Sequential([
            LSTM(64, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(32, return_sequences=False),
            Dropout(0.2),
            Dense(16, activation='relu'),
            Dense(1)
        ])
        model.compile(optimizer='adam', loss='mean_squared_error')
        return model

    def train(self):
        try:
            scaled_data = self.load_and_preprocess()
            X, y = self.create_sequences(scaled_data)
            
            # Reshape for LSTM [samples, time steps, features]
            X = np.reshape(X, (X.shape[0], X.shape[1], 1))
            
            # Time-series Split (Manual to maintain order)
            train_size = int(len(X) * 0.8)
            X_train, X_test = X[:train_size], X[train_size:]
            y_train, y_test = y[:train_size], y[train_size:]
            
            logger.info(f"Training LSTM on {len(X_train)} samples...")
            model = self.build_model((self.look_back, 1))
            
            # Train model
            model.fit(
                X_train, y_train, 
                epochs=50, 
                batch_size=16, 
                validation_data=(X_test, y_test),
                verbose=1
            )
            
            # Evaluation
            predictions = model.predict(X_test)
            # Inverse transform to get real counts
            predictions_rescaled = self.scaler.inverse_transform(predictions)
            y_test_rescaled = self.scaler.inverse_transform(y_test.reshape(-1, 1))
            
            rmse = np.sqrt(mean_squared_error(y_test_rescaled, predictions_rescaled))
            mae = mean_absolute_error(y_test_rescaled, predictions_rescaled)
            
            print("\n" + "="*40)
            print("  TRAFFIC FORECASTING METRICS (LSTM)")
            print("="*40)
            print(f"RMSE: {rmse:.2f} passengers")
            print(f"MAE : {mae:.2f} passengers")
            print("="*40 + "\n")
            
            # Save model
            model.save(self.model_save_path)
            logger.info(f"LSTM Model saved at {self.model_save_path}")
            
        except Exception as e:
            logger.error(f"Forecasting pipeline failed: {e}")
            raise

if __name__ == "__main__":
    DATA_PATH = "outputs/passenger_forecasting_data.csv"
    MODEL_PATH = "ml_models/saved_models/traffic_lstm_model.h5"
    SCALER_PATH = "ml_models/saved_models/traffic_scaler.pkl"
    
    # Path correction for relative execution
    if not os.path.exists(DATA_PATH) and os.path.exists("../outputs/passenger_forecasting_data.csv"):
        DATA_PATH = "../outputs/passenger_forecasting_data.csv"
        MODEL_PATH = "../ml_models/saved_models/traffic_lstm_model.h5"
        SCALER_PATH = "../ml_models/saved_models/traffic_scaler.pkl"

    forecaster = TrafficForecaster(DATA_PATH, MODEL_PATH, SCALER_PATH)
    forecaster.train()

import pandas as pd
import numpy as np
import os
import logging
import joblib
import xgboost as xgb
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
from typing import Tuple, Dict

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SatisfactionTrainer:
    """
    Production-level training pipeline for Passenger Satisfaction Classification.
    Uses XGBoost Classifier to predict binary 'satisfaction'.
    """

    def __init__(self, train_path: str, test_path: str, model_save_path: str):
        self.train_path = train_path
        self.test_path = test_path
        self.model_save_path = model_save_path
        self.model = None

    def load_data(self) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
        """
        Loads pre-split training and testing datasets.
        """
        logger.info(f"Loading datasets...")
        if not os.path.exists(self.train_path) or not os.path.exists(self.test_path):
            raise FileNotFoundError("Training or Testing CSV files not found.")

        train_df = pd.read_csv(self.train_path)
        test_df = pd.read_csv(self.test_path)
        
        target = 'satisfaction'
        X_train = train_df.drop(columns=[target])
        y_train = train_df[target]
        X_test = test_df.drop(columns=[target])
        y_test = test_df[target]

        return X_train, X_test, y_train, y_test

    def train_model(self, X_train: pd.DataFrame, y_train: pd.Series):
        """
        Trains the XGBoost Classifier. Handles class imbalance via scale_pos_weight.
        """
        logger.info("Starting model training with XGBoost Classifier...")
        
        # Calculate scale_pos_weight for imbalance (ratio of negative to positive cases)
        counts = y_train.value_counts()
        imbalance_ratio = counts[0] / counts[1] if 1 in counts and 0 in counts else 1
        
        self.model = xgb.XGBClassifier(
            n_estimators=500,
            learning_rate=0.1,
            max_depth=6,
            scale_pos_weight=imbalance_ratio,
            objective='binary:logistic',
            random_state=42,
            n_jobs=-1
        )

        self.model.fit(
            X_train, 
            y_train,
            eval_set=[(X_train, y_train)],
            verbose=False
        )
        logger.info("Model training complete.")

    def evaluate_model(self, X_test: pd.DataFrame, y_test: pd.Series) -> Dict[str, float]:
        """
        Evaluates the classifier and prints standard metrics.
        """
        logger.info("Evaluating classifier performance...")
        y_pred = self.model.predict(X_test)
        
        metrics = {
            "Accuracy": accuracy_score(y_test, y_pred),
            "Precision": precision_score(y_test, y_pred),
            "Recall": recall_score(y_test, y_pred),
            "F1-Score": f1_score(y_test, y_pred)
        }
        
        print("\n" + "="*40)
        print("  SATISFACTION CLASSIFICATION METRICS")
        print("="*40)
        for name, value in metrics.items():
            print(f"{name:10}: {value:.4f}")
        print("="*40)
        print("\nFull Classification Report:")
        print(classification_report(y_test, y_pred))
        
        return metrics

    def print_feature_importance(self, X_train: pd.DataFrame):
        """
        Prints the top drivers of passenger satisfaction.
        """
        importance = self.model.feature_importances_
        feature_names = X_train.columns
        
        fi_df = pd.DataFrame({'Feature': feature_names, 'Importance': importance})
        fi_df = fi_df.sort_values(by='Importance', ascending=False).head(10)
        
        print("\nTOP 10 SATISFACTION DRIVERS:")
        print(fi_df.to_string(index=False))
        print("\n")

    def save_model(self):
        """
        Persists the classifier.
        """
        os.makedirs(os.path.dirname(self.model_save_path), exist_ok=True)
        joblib.dump(self.model, self.model_save_path)
        logger.info(f"Satisfaction model saved at {self.model_save_path}")

    def run(self):
        try:
            X_train, X_test, y_train, y_test = self.load_data()
            self.train_model(X_train, y_train)
            self.evaluate_model(X_test, y_test)
            self.print_feature_importance(X_train)
            self.save_model()
        except Exception as e:
            logger.error(f"Pipeline failed: {e}")
            raise

if __name__ == "__main__":
    TRAIN_FILE = "outputs/satisfaction_train.csv"
    TEST_FILE = "outputs/satisfaction_test.csv"
    MODEL_FILE = "ml_models/saved_models/satisfaction_classifier.pkl"
    
    # Path correction for relative execution
    if not os.path.exists(TRAIN_FILE) and os.path.exists("../outputs/satisfaction_train.csv"):
        TRAIN_FILE = "../outputs/satisfaction_train.csv"
        TEST_FILE = "../outputs/satisfaction_test.csv"
        MODEL_FILE = "../ml_models/saved_models/satisfaction_classifier.pkl"

    trainer = SatisfactionTrainer(TRAIN_FILE, TEST_FILE, MODEL_FILE)
    trainer.run()

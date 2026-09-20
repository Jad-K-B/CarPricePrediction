from fastapi import FastAPI
app=FastAPI()

@app.get("/")
def home():
    return{"message": "Car Price Prediction API"}

import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

model = joblib.load(BASE_DIR / "models" / "best_random_forest.pkl")
preprocessor = joblib.load(BASE_DIR / "models" / "preprocessor.pkl")
print("PREPROCESSOR PATH:", BASE_DIR / "models" / "preprocessor.pkl")
print("API PREPROCESSOR:", preprocessor.feature_names_in_)
from pydantic import BaseModel
class CarInput(BaseModel):
    Date: str
    Gender: str
    Annual_Income: float
    Company: str
    Model: str
    Engine: str
    Transmission: str
    Color: str
    Body_Style: str
    Dealer_Region: str

@app.post("/predict")
def predict_price(car: CarInput):
    data =car.model_dump()
    data["Annual Income"] = data.pop("Annual_Income")
    data["Body Style"] = data.pop("Body_Style")


    import pandas as pd
    input_df = pd.DataFrame([data])

    processed_data=preprocessor.transform(input_df)
    prediction=model.predict(processed_data)

    return {"predicted_price": float(prediction[0])}
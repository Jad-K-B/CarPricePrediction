from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return{"message": "Car Price Prediction API"}

import joblib
from pathlib import Path

from huggingface_hub import hf_hub_download

REPO_ID = "Jad0011/car-price-prediction-model"

model_path = hf_hub_download(
    repo_id=REPO_ID,
    filename="best_random_forest.pkl")
preprocessor_path = hf_hub_download(
    repo_id=REPO_ID,
    filename="preprocessor.pkl")
model = joblib.load(model_path)
preprocessor = joblib.load(preprocessor_path)

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
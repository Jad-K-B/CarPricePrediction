# Car Price Prediction

This project uses machine learning to predict car prices based on information about the car, customer, and dealer.

I started the project in a Jupyter notebook, where I explored and cleaned the data, prepared it for machine learning, trained different regression models, and compared their results. After choosing and tuning the final model, I connected it to a FastAPI backend and built a frontend where a user can enter the required information and get a predicted price.

## Model

I tested different regression models and used a Random Forest as the final model.

I tuned the Random Forest using RandomizedSearchCV with 5 fold cross validation.

The best parameters were:

n_estimators: 700  
min_samples_split: 5  
min_samples_leaf: 4  
max_features: 0.5  
max_depth: None  
bootstrap: True

After tuning the Random Forest, I got an R2 score of 0.6764 on the test data, with an MAE of 4493.81 and an MSE of 68503564.96.

The best cross-validation R2 score was 0.6759.

## Data preprocessing

The dataset contains both numerical and categorical data.

Before training the models, I cleaned the data and prepared the features for training. Categorical features were encoded so they could be used by the machine learning models.

The same preprocessing is also used when the API receives new data for a prediction.

## Feature importance

After training the Random Forest, I checked the feature importances to see which features the model was using most when making predictions.

Some of the main feature groups were:

- Model
- Color
- Company
- Engine
- Transmission
- Annual Income
- Month
- Body Style

The notebook contains the preprocessing, model training, tuning, evaluation, and feature importance steps.

## API

I used FastAPI to make the trained model accessible outside the notebook.

The backend has a /predict endpoint. It receives the input data, applies the preprocessing, runs the model, and returns the predicted car price.

For example, the API returns a predicted_price value that is then displayed by the frontend.

## Frontend

The frontend is built with React and TypeScript.

It has a form where the user enters the information needed by the model. When a prediction is requested, the frontend sends the information to the FastAPI backend and displays the returned price.

The frontend code is inside the frontend folder.

## Technologies

- Python
- pandas
- NumPy
- scikit-learn
- Jupyter Notebook
- FastAPI
- React
- TypeScript
- Vite

## Running the project

Install the Python requirements:

pip install -r requirements.txt

## Start API
uvicorn app.main:app --reload

For the frontend:

cd frontend  
npm install  
npm run dev

The API URL used by the frontend can be configured through the frontend environment settings.

## Current results and improvements

The final Random Forest has an R2 score of about 0.68 on the test data.

There is still room to improve the model. I would like to test more feature engineering and other regression models and compare them with the current Random Forest. 

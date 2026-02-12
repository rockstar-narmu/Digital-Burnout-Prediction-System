import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# ==============================
# 1️⃣ Load Dataset
# ==============================
df = pd.read_csv("burnout_dataset.csv")

print("Initial Shape:", df.shape)
print(df.head())

# ==============================
# 2️⃣ Handle Missing Values
# ==============================
df = df.fillna(0)

print("Missing values after cleaning:")
print(df.isnull().sum())

# ==============================
# 3️⃣ Remove Unrealistic Rows
# ==============================
df = df[~((df["totalScreenTime"] > 15000) & (df["taskSwitches"] < 50))]

print("Shape after removing unrealistic rows:", df.shape)

# ==============================
# 4️⃣ Separate Features & Label
# ==============================
X = df.drop("burnoutLevel", axis=1)
y = df["burnoutLevel"]

print("Class distribution:")
print(y.value_counts())

# ==============================
# 5️⃣ Train/Test Split
# ==============================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ==============================
# 6️⃣ Train Model
# ==============================
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X, y, cv=5)

print("Cross Validation Scores:", scores)
print("Average Accuracy:", scores.mean())


# ==============================
# 7️⃣ Evaluate
# ==============================
y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

# ==============================
# 8️⃣ Save Model
# ==============================
joblib.dump(model, "burnout_model.pkl")
print("Model saved successfully!")

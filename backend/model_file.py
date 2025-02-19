from flask import Flask, request, jsonify
import pickle
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to TaskFlow.ai Backend!"

# Load datasets
employees = pd.read_csv("Data/Employees.csv")
tasks = pd.read_csv("Data/Tasks.csv")
task_history = pd.read_csv("Data/Task_History.csv")  


# Feature Engineering: Skill Matching Score
def skill_match(employee_skills, task_skills):
    emp_skills_set = set(employee_skills.split(", "))
    task_skills_set = set(task_skills.split(", "))
    return len(emp_skills_set & task_skills_set) / len(task_skills_set)

def train_model():
    if employees.empty or tasks.empty or task_history.empty:
        return None

    task_history_df = task_history[['Employee_ID', 'Task_ID', 'Feedback_Score']]
    employees_df = employees[['Employee_ID', 'Skills', 'Current_Workload', 'Experience', 'Availability']]
    tasks_df = tasks[['Task_ID', 'Required_Skills', 'Priority', 'Estimated_Time', 'Task_Complexity']]

    matches = []
    for _, task in tasks_df.iterrows():
        for _, emp in employees_df.iterrows():
            match_score = skill_match(emp["Skills"], task["Required_Skills"])
            if match_score > 0:
                matches.append([emp["Employee_ID"], task["Task_ID"], match_score])

    match_df = pd.DataFrame(matches, columns=["Employee_ID", "Task_ID", "Skill_Match_Score"])
    full_data = (match_df
                 .merge(employees_df, on="Employee_ID")
                 .merge(tasks_df, on="Task_ID")
                 .merge(task_history_df, on=["Employee_ID", "Task_ID"], how="left"))

    full_data["Feedback_Score"] = full_data["Feedback_Score"].fillna(0)
    
    feature_weights = {
        "Skill_Match_Score": 3.0,
        "Current_Workload": 2.5,
        "Experience": 2.0,
        "Availability": 1.0,
        "Priority": 0.8,
        "Estimated_Time": 0.6,
        "Task_Complexity": 0.7,
        "Feedback_Score": 1.0
    }

    X = full_data[list(feature_weights.keys())].copy()
    for feature, weight in feature_weights.items():
        X[feature] *= weight

    y = full_data["Employee_ID"]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=150, random_state=42)
    model.fit(X_train, y_train)

    with open('task_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    with open('scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)

    return model

@app.route('/train', methods=['POST'])
def train():
    model = train_model()
    if model:
        return jsonify({'message': 'Model trained successfully'})
    return jsonify({"error": "No Data Available for training"}), 400

@app.route('/recommend_employee', methods=['POST'])
def recommend_employee():
    data = request.get_json()
    task_id = data.get("Task_ID")

    if not task_id:
        return jsonify({"error": "Missing required field: Task_ID"}), 400
    
    try:
        with open('task_model.pkl', 'rb') as f:
            model = pickle.load(f)
        with open('scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)
        
        task = tasks[tasks['Task_ID'] == task_id]
        if task.empty:
            return jsonify({"error": "Task not found"}), 404
        
        matches = []
        for _, emp in employees.iterrows():
            match_score = skill_match(emp.Skills, task.iloc[0]['Required_Skills'])
            if match_score > 0:
                matches.append({
                    "Employee_ID": emp.Employee_ID,
                    "Name": emp.Name,
                    "Skill_Match_Score": match_score,
                    "Current_Workload": emp.Current_Workload,
                    "Experience": emp.Experience,
                    "Availability": emp.Availability
                })

        if not matches:
            return jsonify({"message": "No employees with matching skills found for this task."})

        candidates_df = pd.DataFrame(matches)
        feature_weights = {
            "Skill_Match_Score": 3.0,
            "Current_Workload": 2.5,
            "Experience": 2.0,
            "Availability": 1.0
        }

        X_candidates = candidates_df[list(feature_weights.keys())].copy()
        for feature, weight in feature_weights.items():
            if feature in X_candidates:
                X_candidates[feature] *= weight

        X_scaled = scaler.transform(X_candidates)
        predictions_proba = model.predict_proba(X_scaled) if hasattr(model, "predict_proba") else None
        if predictions_proba is None:
            return jsonify({"error": "Model does not support probability prediction"}), 500

        candidates_df["Prediction_Score"] = predictions_proba.max(axis=1)
        sorted_candidates = candidates_df.sort_values(["Skill_Match_Score", "Prediction_Score"], ascending=[False, False])
        if sorted_candidates.empty:
            return jsonify({"message": "No suitable employees found."})
        else:
            best_employee = sorted_candidates.iloc[0]
        
        return jsonify({
            "Best_Employee": best_employee.to_dict(),
            "All_Candidates": sorted_candidates.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

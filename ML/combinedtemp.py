from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///Task.db"
app.config["SQLALCHEMY_BINDS"] = {
    'task': "sqlite:///Task.db",
    'employee': "sqlite:///employee.db",
    'task_history': "sqlite:///Task_History.db"
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Tasks(db.Model):
    __bind_key__ = 'task'
    Task_ID = db.Column(db.Integer, primary_key=True)
    Description = db.Column(db.String(300))
    Required_Skills = db.Column(db.String(200))
    Priority = db.Column(db.Integer)
    Estimated_Time = db.Column(db.Integer)
    Task_Complexity = db.Column(db.Integer)

    def to_dict(self):
        return {
            "Task_ID": self.Task_ID,
            "Description": self.Description,
            "Required_Skills": self.Required_Skills,
            "Priority": self.Priority,
            "Estimated_Time": self.Estimated_Time,
            "Task_Complexity": self.Task_Complexity
        }

class Employee(db.Model):
    __bind_key__ = 'employee'
    Employee_ID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(100))
    Role = db.Column(db.String(100))
    Skills = db.Column(db.String(100))
    Experience = db.Column(db.Integer)
    Availability = db.Column(db.Integer)
    Current_Workload = db.Column(db.Integer)
    Performance_Score = db.Column(db.Integer)

    def to_dict(self):
        return {
            "Employee_ID": self.Employee_ID,
            "Name": self.Name,
            "Role": self.Role,
            "Skills": self.Skills,
            "Experience": self.Experience,
            "Availability": self.Availability,
            "Current_Workload": self.Current_Workload,
            "Performance_Score": self.Performance_Score,
        }

class Tasks_History(db.Model):
    __bind_key__ = 'task_history'
    id = db.Column(db.Integer, primary_key=True)
    Employee_ID = db.Column(db.Integer)
    Task_ID = db.Column(db.Integer)
    Assigned_Date = db.Column(db.String(100))
    Completed_Date = db.Column(db.String(100))
    Completion_Time = db.Column(db.Integer)
    Feedback_Score = db.Column(db.Integer)

    def to_dict(self):
        return {
            "id": self.id,
            "Employee_ID": self.Employee_ID,
            "Task_ID": self.Task_ID,
            "Assigned_Date": self.Assigned_Date,
            "Completed_Date": self.Completed_Date,
            "Completion_Time": self.Completion_Time,
            "Feedback_Score": self.Feedback_Score
        }

with app.app_context():
    db.create_all()

@app.route("/add_task", methods=["POST"])
def add_task():
    data = request.json
    if isinstance(data, list):
        new_tasks = []
        for item in data:
            new_task = Tasks(
                Task_ID=item["Task_ID"],
                Description=item["Description"],
                Required_Skills=item["Required_Skills"],
                Priority=item["Priority"],
                Estimated_Time=item["Estimated_Time"],
                Task_Complexity=item["Task_Complexity"]
            )
            new_tasks.append(new_task)
        
        db.session.add_all(new_tasks)
        db.session.commit()
        return jsonify({"message": f"{len(new_tasks)} tasks added successfully"}), 201
        
    else:  
        new_task = Tasks(  
            Task_ID=data["Task_ID"],
            Description=data["Description"], 
            Required_Skills=data["Required_Skills"],
            Priority=data["Priority"],
            Estimated_Time=data["Estimated_Time"],
            Task_Complexity=data["Task_Complexity"]
        )

        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Task added successfully"}), 201 

@app.route("/get_task", methods=["GET"])
def get_task():
    tasks = Tasks.query.all()
    return jsonify([t.to_dict() for t in tasks])  

@app.route("/get_task/<int:Task_ID>", methods=["GET"])
def get_task_by_id(Task_ID):
    task = Tasks.query.get(Task_ID)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task.to_dict())

@app.route("/update_task/<int:Task_ID>", methods=["PUT"])
def update_task(Task_ID):
    task = Tasks.query.get(Task_ID)
    if not task:
        return jsonify({"message": "Task not found"}), 404
    
    data = request.json
    task.Description = data.get("Description", task.Description) 
    task.Required_Skills = data.get("Required_Skills", task.Required_Skills)
    task.Priority = data.get("Priority", task.Priority)
    task.Estimated_Time = data.get("Estimated_Time", task.Estimated_Time)
    task.Task_Complexity = data.get("Task_Complexity", task.Task_Complexity)
    
    db.session.commit()
    return jsonify({"message": "Task updated successfully"})

@app.route("/delete_task/<int:Task_ID>", methods=["DELETE"])
def delete_task(Task_ID):
    task = Tasks.query.get(Task_ID)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted successfully"})

@app.route("/add_employee", methods=["POST"])
def add_employee():
    data = request.json
    
    if isinstance(data, list):
        data_list=[]
        for item in data:
            new_employee = Employee(
                Employee_ID=item["Employee_ID"],
                Name=item["Name"],
                Role=item["Role"],
                Skills=item["Skills"],
                Experience=item["Experience"],
                Availability=item["Availability"],
                Current_Workload=item["Current_Workload"],
                Performance_Score=item["Performance_Score"]
            )
            data_list.append(new_employee)
            
        db.session.add_all(data_list)
        db.session.commit()
        return jsonify({"message": f"{len(data_list)} employees added successfully"}), 201
    else:
        new_employee = Employee(
            Employee_ID=data["Employee_ID"],
            Name=data["Name"],
            Role=data["Role"],
            Skills=data["Skills"],
            Experience=data["Experience"],
            Availability=data["Availability"],
            Current_Workload=data["Current_Workload"],
            Performance_Score=data["Performance_Score"]
        )

        db.session.add(new_employee)
        db.session.commit()
        return jsonify({"message": "Employee added successfully"}), 201

@app.route("/get_employee", methods=["GET"])
def get_employee():
    employees = Employee.query.all()
    return jsonify([em.to_dict() for em in employees])

@app.route("/get_skills", methods=["GET"])
def get_skills():
    employees = Employee.query.all()
    skills = []
    for em in employees:
        skills.extend(em.Skills.split(", "))
    return jsonify(list(set(skills)))

@app.route("/get_employee/<int:eid>", methods=["GET"])
def get_employee_by_eid(eid):
    emp = Employee.query.get(eid)
    if not emp:
        return jsonify({"error": "Employee not found"}), 404
    return jsonify(emp.to_dict())

@app.route("/update_employee/<int:Employee_ID>", methods=["PUT"])
def update_employee(Employee_ID):
    emp = Employee.query.get(Employee_ID)
    if not emp:
        return jsonify({"message": "Employee not found"}), 404
    
    data = request.json
    emp.Name = data.get("Name", emp.Name)
    emp.Role = data.get("Role", emp.Role)
    emp.Skills = data.get("Skills", emp.Skills)
    emp.Experience = data.get("Experience", emp.Experience)
    emp.Availability = data.get("Availability", emp.Availability)
    emp.Current_Workload = data.get("Current_Workload", emp.Current_Workload)
    emp.Performance_Score = data.get("Performance_Score", emp.Performance_Score)
    
    db.session.commit()
    return jsonify({"message": "Employee updated successfully"})

@app.route("/delete_employee/<int:Employee_ID>", methods=["DELETE"])
def delete_employee(Employee_ID):
    emp = Employee.query.get(Employee_ID)
    if not emp:
        return jsonify({"error": "Employee not found"}), 404
    
    db.session.delete(emp)
    db.session.commit()
    return jsonify({"message": "Employee deleted successfully"})

@app.route("/add_task_history", methods=["POST"])
def add_task_history():
    data = request.json
    
    if isinstance(data, list):
        new_task_histories = []
        for item in data:
            new_task_history = Tasks_History(
                Employee_ID=item["Employee_ID"],
                Task_ID=item["Task_ID"],
                Assigned_Date=item["Assigned_Date"],
                Completed_Date=item.get("Completed_Date"),
                Completion_Time=item.get("Completion_Time"),
                Feedback_Score=item.get("Feedback_Score")
            )
            new_task_histories.append(new_task_history)
        
        db.session.add_all(new_task_histories)
        db.session.commit()
        return jsonify({"message": f"{len(new_task_histories)} task histories added successfully"}), 201
    else:
        new_task_history = Tasks_History(  
            Employee_ID=data["Employee_ID"],
            Task_ID=data["Task_ID"],
            Assigned_Date=data["Assigned_Date"],
            Completed_Date=data.get("Completed_Date"),  
            Completion_Time=data.get("Completion_Time"),
            Feedback_Score=data.get("Feedback_Score")
        )

        db.session.add(new_task_history)
        db.session.commit()
        return jsonify({"message": "Task History added successfully"}), 201

@app.route("/get_task_history", methods=["GET"])
def get_task_history():
    task_h = Tasks_History.query.all()
    return jsonify([t.to_dict() for t in task_h]) 

@app.route("/get_task_history/<int:id>", methods=["GET"])
def get_task_history_by_id(id):
    task = Tasks_History.query.get(id)
    if not task:
        return jsonify({"error": "Task history not found"}), 404
    return jsonify(task.to_dict())
    
@app.route("/update_task_history/<int:id>", methods=["PUT"])
def update_task_history(id):
    task = Tasks_History.query.get(id)
    if not task:
        return jsonify({"message": "Task history not found"}), 404
    
    data = request.json
    task.Assigned_Date = data.get("Assigned_Date", task.Assigned_Date)
    task.Completed_Date = data.get("Completed_Date", task.Completed_Date)
    task.Completion_Time = data.get("Completion_Time", task.Completion_Time)
    task.Feedback_Score = data.get("Feedback_Score", task.Feedback_Score)

    db.session.commit()
    return jsonify({"message": "Task history updated successfully"})

@app.route("/delete_task_history/<int:id>", methods=["DELETE"])
def delete_task_history(id):
    task = Tasks_History.query.get(id)
    if not task:
        return jsonify({"error": "Task history not found"}), 404
    
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task history deleted successfully"})

@app.route('/clear_task_history', methods=['DELETE'])
def clear_task_history():
    try:
        Tasks_History.query.delete()
        db.session.commit()
        return jsonify({"message": "Task history cleared successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/clear_tasks', methods=['DELETE'])
def clear_tasks():
    try:
        Tasks.query.delete()
        db.session.commit()
        return jsonify({"message": "Tasks cleared successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/clear_employees', methods=['DELETE'])
def clear_employees():
    try:
        Employee.query.delete()
        db.session.commit()
        return jsonify({"message": "Employees cleared successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

def skill_match(employee_skills, task_skills):
    emp_skills_set = set(s.strip() for s in employee_skills.split(","))
    task_skills_set = set(s.strip() for s in task_skills.split(","))
    matching_skills = emp_skills_set & task_skills_set
    
    if not matching_skills:
        return 0
    
    match_score = len(matching_skills) / len(task_skills_set)
    return max(0.1, match_score)  

def queries_to_dataframes():
    tasks_data = [task.to_dict() for task in Tasks.query.all()]
    employees_data = [emp.to_dict() for emp in Employee.query.all()]
    task_history_data = [th.to_dict() for th in Tasks_History.query.all()]
    
    tasks_df = pd.DataFrame(tasks_data)
    employees_df = pd.DataFrame(employees_data)
    task_history_df = pd.DataFrame(task_history_data)
    
    return tasks_df, employees_df, task_history_df

def prepare_dataset():
    tasks_df, employees_df, task_history_df = queries_to_dataframes()
    
    if tasks_df.empty or employees_df.empty:
        return None, None, None
    
    matches = []
    for _, task in tasks_df.iterrows():
        for _, emp in employees_df.iterrows():
            match_score = skill_match(emp["Skills"], task["Required_Skills"])
            if match_score > 0:
                matches.append([emp["Employee_ID"], task["Task_ID"], match_score])
    
    if not matches:
        return None, None, None
    
    match_df = pd.DataFrame(matches, columns=["Employee_ID", "Task_ID", "Skill_Match_Score"])
    full_data = match_df.merge(employees_df, on="Employee_ID").merge(tasks_df, on="Task_ID")
    
    numeric_columns = [
        "Skill_Match_Score", 
        "Current_Workload", 
        "Experience",
        "Performance_Score", 
        "Availability", 
        "Priority",
        "Estimated_Time", 
        "Task_Complexity"
    ]
        
    for col in numeric_columns:
        full_data[col] = pd.to_numeric(full_data[col], errors='coerce').fillna(0).astype(float)
    
    if not task_history_df.empty:
        full_data = full_data.merge(
            task_history_df[["Employee_ID", "Task_ID", "Feedback_Score"]], 
            on=["Employee_ID", "Task_ID"], 
            how="left"
        )
        full_data["Feedback_Score"] = pd.to_numeric(full_data["Feedback_Score"], errors='coerce').fillna(0).astype(float)
    else:
        full_data["Feedback_Score"] = 0.0

    feature_weights = {
        "Skill_Match_Score": 2.0,
        "Current_Workload": -4.0,
        "Experience": 3.0,
        "Performance_Score": 3.0,
        "Availability": 2.0,
        "Priority": 0.8,
        "Estimated_Time": 0.6,
        "Task_Complexity": 0.7,
        "Feedback_Score": 1.5
    }
    
    features = list(feature_weights.keys())
    X = full_data[features].copy()
    
    for feature, weight in feature_weights.items():
        X[feature] = X[feature] * weight
    
    y = full_data["Employee_ID"]
    
    return X, y, full_data

def train_model():
    X, y, full_data = prepare_dataset()
    if X is None or y is None:
        return None, None, None
    
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = RandomForestClassifier(n_estimators=150, random_state=42)
    model.fit(X_scaled, y)
    
    return model, scaler, full_data

@app.route("/recommend_employee/<int:task_id>", methods=["GET"])
def recommend_employee(task_id):
    model, scaler, full_data = train_model()
    if model is None:
        return jsonify({"message": "Could not train model. Check if there's enough data."}), 400
    
    task = Tasks.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    candidates = full_data[full_data["Task_ID"] == task_id]
    if candidates.empty:
        return jsonify({"message": "No employees with matching skills found for this task."}), 200
    
    features = ["Skill_Match_Score", "Current_Workload", "Experience", 
               "Performance_Score", "Availability", "Priority", 
               "Estimated_Time", "Task_Complexity", "Feedback_Score"]
               
    X_candidates = scaler.transform(candidates[features])
    predictions_proba = model.predict_proba(X_candidates)
    candidates["Prediction_Score"] = [prob.max() for prob in predictions_proba]
    
    sorted_candidates = candidates.sort_values(
        by=["Prediction_Score", "Current_Workload", "Performance_Score", "Experience"],
        ascending=[False, True, False, False]
    )
    
    best_employee = sorted_candidates.iloc[0]
    
    best_emp_data = {
        "Employee_ID": int(best_employee["Employee_ID"]),
        "Name": str(best_employee["Name"]),
        "Current_Workload": float(best_employee["Current_Workload"]),
        "Experience": int(best_employee["Experience"]),
        "Performance_Score": int(best_employee["Performance_Score"]),
        "Skill_Match_Score": float(best_employee["Skill_Match_Score"]),
        "Prediction_Score": float(best_employee["Prediction_Score"])
    }
    
    return jsonify({"Best_Employee": best_emp_data}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
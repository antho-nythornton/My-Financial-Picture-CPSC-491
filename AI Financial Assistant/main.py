from app.logic import suggest_budget

if __name__ == "__main__":
    result = suggest_budget(
        income=3200,
        fixed_expenses=1300,
        savings_goal=1800,
        months_to_goal=6
    )
    print(result)
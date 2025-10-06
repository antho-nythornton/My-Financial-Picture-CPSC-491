import pandas as pd
from app.model import load_model

model = load_model()

def suggest_budget(income, fixed_expenses, savings_goal, months_to_goal):
    """Suggest a personalized budget breakdown."""
    savings_per_month = savings_goal / months_to_goal
    available = income - fixed_expenses - savings_per_month

    if available <= 0:
        return "⚠️ This goal is not realistic with your current income and expenses."

    # Use DataFrame to avoid sklearn warnings
    input_data = pd.DataFrame(
        [[income, fixed_expenses, savings_goal, months_to_goal]],
        columns=['income', 'fixed_expenses', 'savings_goal', 'months_to_goal']
    )

    food_pct, entertainment_pct, shopping_pct = model.predict(input_data)[0]

    return {
        "Income": income,
        "Fixed Expenses": fixed_expenses,
        "Savings per Month": round(savings_per_month, 2),
        "Budget Allocation": {
            "Food": round(food_pct * available, 2),
            "Entertainment": round(entertainment_pct * available, 2),
            "Shopping": round(shopping_pct * available, 2)
        }
    }
